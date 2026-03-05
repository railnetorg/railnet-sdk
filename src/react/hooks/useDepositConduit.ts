'use client'

import { useMutation } from '@tanstack/react-query'
import type { Address } from 'viem'
import { useWalletClient } from 'wagmi'
import { depositConduit } from '../../actions/conduit/depositConduit.js'
import type {
  DepositConduitParameters,
  DepositConduitReturnType,
} from '../../actions/conduit/types.js'

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
