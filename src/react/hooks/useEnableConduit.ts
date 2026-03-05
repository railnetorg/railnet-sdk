'use client'

import { useMutation } from '@tanstack/react-query'
import type { Address } from 'viem'
import { useWalletClient } from 'wagmi'
import {
  type EnableConduitParameters,
  type EnableConduitReturnType,
  enableConduit,
} from '../../actions/conduit/enableConduit.js'

export function useEnableConduit() {
  const { data: walletClient } = useWalletClient()

  return useMutation<
    EnableConduitReturnType,
    Error,
    EnableConduitParameters & { account: Address }
  >({
    mutationFn: async (parameters) => {
      if (!walletClient) throw new Error('Wallet not connected')
      return enableConduit(walletClient, parameters)
    },
  })
}
