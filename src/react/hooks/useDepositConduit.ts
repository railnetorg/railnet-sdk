'use client'

import { useMutation } from '@tanstack/react-query'
import type { Address, Hash, Hex } from 'viem'
import { readContract } from 'viem/actions'
import { usePublicClient, useWalletClient } from 'wagmi'
import { conduitAbi } from '../../abi/conduit.js'
import {
  type PrepareDepositConduitParameters,
  prepareDepositConduit,
} from '../../actions/conduit/depositConduit.js'
import { randomSalt } from '../../utils/salt.js'
import { simulateThenWrite } from '../simulateThenWrite.js'

export type DepositConduitVariables = Omit<PrepareDepositConduitParameters, 'vehicle' | 'salt'> & {
  /** Read from `conduit.getVehicle()` when omitted. */
  vehicle?: Address | undefined
  salt?: Hex | undefined
}

export type UseDepositConduitParameters = {
  /** Chain to read and sign on. Defaults to the connected one. */
  chainId?: number | undefined
}

/** The conduit must already be approved to pull the token: a plain ERC-20 approve. */
export function useDepositConduit({ chainId }: UseDepositConduitParameters = {}) {
  const publicClient = usePublicClient({ chainId })
  const { data: walletClient } = useWalletClient({ chainId })

  return useMutation<Hash, Error, DepositConduitVariables>({
    mutationFn: async (parameters) => {
      if (!walletClient) throw new Error('Wallet not connected')
      if (!publicClient) throw new Error('No public client configured for the requested chain')

      const vehicle =
        parameters.vehicle ??
        (await readContract(publicClient, {
          address: parameters.conduit,
          abi: conduitAbi,
          functionName: 'getVehicle',
        }))

      return simulateThenWrite(
        { publicClient, walletClient },
        prepareDepositConduit({
          ...parameters,
          vehicle,
          salt: parameters.salt ?? randomSalt(),
        }),
        parameters.account,
      )
    },
  })
}
