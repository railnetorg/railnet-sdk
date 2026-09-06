'use client'

import { useMutation } from '@tanstack/react-query'
import type { Address, Hash, Hex } from 'viem'
import { readContract } from 'viem/actions'
import { usePublicClient, useWalletClient } from 'wagmi'
import { conduitAbi } from '../../abi/conduit.js'
import {
  type PrepareRedeemConduitParameters,
  prepareRedeemConduit,
} from '../../actions/conduit/redeemConduit.js'
import type { Asset } from '../../actions/conduit/types.js'
import { randomSalt } from '../../utils/salt.js'
import { simulateThenWrite } from '../../utils/simulateThenWrite.js'

export type RedeemConduitVariables = Omit<
  PrepareRedeemConduitParameters,
  'outputAsset' | 'salt'
> & {
  /** Derived from `conduit.asset()` when omitted. */
  outputAsset?: Asset | undefined
  salt?: Hex | undefined
}

export type UseRedeemConduitParameters = {
  /** Chain to read, simulate and sign on. Defaults to the connected one. */
  chainId?: number | undefined
}

export function useRedeemConduit({ chainId }: UseRedeemConduitParameters = {}) {
  const publicClient = usePublicClient({ chainId })
  const { data: walletClient } = useWalletClient({ chainId })

  return useMutation<Hash, Error, RedeemConduitVariables>({
    mutationFn: async (parameters) => {
      if (!walletClient) throw new Error('Wallet not connected')
      if (!publicClient) throw new Error('No public client configured for the requested chain')

      const outputAsset: Asset = parameters.outputAsset ?? {
        asset: await readContract(publicClient, {
          address: parameters.conduit,
          abi: conduitAbi,
          functionName: 'asset',
        }),
        value: 0n,
      }

      return simulateThenWrite(
        { publicClient, walletClient },
        prepareRedeemConduit({
          ...parameters,
          outputAsset,
          salt: parameters.salt ?? randomSalt(),
        }),
        parameters.account satisfies Address,
      )
    },
  })
}
