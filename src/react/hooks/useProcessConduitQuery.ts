'use client'

import { useMutation } from '@tanstack/react-query'
import type { Address, Hash } from 'viem'
import { usePublicClient, useWalletClient } from 'wagmi'
import {
  type ProcessConduitQueryParameters,
  processConduitQuery,
} from '../../actions/conduit/processConduitQuery.js'

export function useProcessConduitQuery() {
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  return useMutation<Hash, Error, ProcessConduitQueryParameters & { account: Address }>({
    mutationFn: async (parameters) => {
      if (!publicClient) throw new Error('Public client not available')
      if (!walletClient) throw new Error('Wallet not connected')
      return processConduitQuery(publicClient, walletClient, parameters)
    },
  })
}
