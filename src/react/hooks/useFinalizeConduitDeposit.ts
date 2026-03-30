'use client'

import { useMutation } from '@tanstack/react-query'
import type { Address, Hash } from 'viem'
import { useWalletClient } from 'wagmi'
import {
  type FinalizeConduitDepositParameters,
  finalizeConduitDeposit,
} from '../../actions/conduit/finalizeConduitDeposit.js'

export function useFinalizeConduitDeposit() {
  const { data: walletClient } = useWalletClient()

  return useMutation<Hash, Error, FinalizeConduitDepositParameters & { account: Address }>({
    mutationFn: async (parameters) => {
      if (!walletClient) throw new Error('Wallet not connected')
      return finalizeConduitDeposit(walletClient, parameters)
    },
  })
}
