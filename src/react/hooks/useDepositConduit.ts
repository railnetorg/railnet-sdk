'use client'

import { useMutation } from '@tanstack/react-query'
import type { Address, Hash, Hex } from 'viem'
import { readContract, writeContract } from 'viem/actions'
import { usePublicClient, useWalletClient } from 'wagmi'
import { conduitAbi } from '../../abi/conduit.js'
import {
  type PrepareDepositConduitParameters,
  prepareDepositConduit,
} from '../../actions/conduit/depositConduit.js'
import { randomSalt } from '../../utils/salt.js'

export type DepositConduitVariables = Omit<PrepareDepositConduitParameters, 'vehicle' | 'salt'> & {
  /** Read from `conduit.getVehicle()` when omitted. */
  vehicle?: Address | undefined
  salt?: Hex | undefined
}

export type UseDepositConduitParameters = {
  /** Chain to read and sign on. Defaults to the connected one. */
  chainId?: number | undefined
}

/**
 * Deposits into a conduit. The conduit must already be approved to pull the token — see
 * `useApproveConduitDeposit`. Reads go through the app's transport and only the transaction
 * reaches the wallet, so a wallet serving stale state cannot make the deposit read a spent
 * allowance.
 */
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

      return writeContract(walletClient, {
        ...prepareDepositConduit({
          ...parameters,
          vehicle,
          salt: parameters.salt ?? randomSalt(),
        }),
        account: parameters.account,
        chain: walletClient.chain,
      })
    },
  })
}
