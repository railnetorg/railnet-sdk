'use client'

import { useMutation } from '@tanstack/react-query'
import type { Address } from 'viem'
import { useWalletClient } from 'wagmi'
import {
  type ProcessConduitQueryParameters,
  type ProcessConduitQueryReturnType,
  processConduitQuery,
} from '../../actions/conduit/processConduitQuery.js'

export function useProcessConduitQuery() {
  const { data: walletClient } = useWalletClient()

  return useMutation<
    ProcessConduitQueryReturnType,
    Error,
    ProcessConduitQueryParameters & { account: Address }
  >({
    mutationFn: async (parameters) => {
      if (!walletClient) throw new Error('Wallet not connected')
      return processConduitQuery(walletClient, parameters)
    },
  })
}
