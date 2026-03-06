'use client'

import { useMutation } from '@tanstack/react-query'
import type { Address } from 'viem'
import { useWalletClient } from 'wagmi'
import {
  type DepositConduitParameters,
  type DepositConduitReturnType,
  depositConduit,
} from '../../actions/conduit/depositConduit.js'

export function useDepositConduit() {
  const { data: walletClient } = useWalletClient()

  return useMutation<
    DepositConduitReturnType,
    Error,
    DepositConduitParameters & { account: Address }
  >({
    mutationFn: async (parameters) => {
      if (!walletClient) throw new Error('Wallet not connected')
      return depositConduit(walletClient, parameters)
    },
  })
}
