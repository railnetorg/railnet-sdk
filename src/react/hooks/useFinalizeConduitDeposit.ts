'use client'

import { useMutation } from '@tanstack/react-query'
import type { Address, Hash } from 'viem'
import { usePublicClient, useWalletClient } from 'wagmi'
import {
  type FinalizeConduitDepositParameters,
  prepareFinalizeConduitDeposit,
} from '../../actions/conduit/finalizeConduitDeposit.js'
import { simulateThenWrite } from '../simulateThenWrite.js'

export type UseFinalizeConduitDepositParameters = {
  /** Chain to simulate and sign on. Defaults to the connected one. */
  chainId?: number | undefined
}

export function useFinalizeConduitDeposit({ chainId }: UseFinalizeConduitDepositParameters = {}) {
  const publicClient = usePublicClient({ chainId })
  const { data: walletClient } = useWalletClient({ chainId })

  return useMutation<Hash, Error, FinalizeConduitDepositParameters & { account: Address }>({
    mutationFn: async (parameters) => {
      if (!walletClient) throw new Error('Wallet not connected')
      if (!publicClient) throw new Error('No public client configured for the requested chain')

      return simulateThenWrite(
        { publicClient, walletClient },
        prepareFinalizeConduitDeposit(parameters),
        parameters.account,
      )
    },
  })
}
