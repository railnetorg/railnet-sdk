'use client'

import { useMutation } from '@tanstack/react-query'
import type { Address, Hash } from 'viem'
import { useWalletClient } from 'wagmi'
import {
  type DepositConduitParameters,
  depositConduit,
} from '../../actions/conduit/depositConduit.js'

export function useDepositConduit() {
  const { data: walletClient } = useWalletClient()

  return useMutation<Hash, Error, DepositConduitParameters & { account: Address }>({
    mutationFn: async (parameters) => {
      if (!walletClient) throw new Error('Wallet not connected')
      return depositConduit(walletClient, parameters)
    },
  })
}
