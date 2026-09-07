'use client'

import { useMutation } from '@tanstack/react-query'
import type { Address, Hash } from 'viem'
import { useWalletClient } from 'wagmi'
import { type SetQueuesParameters, setQueues } from '../../actions/multiVehicle/setQueues.js'

export function useSetQueues() {
  const { data: walletClient } = useWalletClient()

  return useMutation<Hash, Error, SetQueuesParameters & { account: Address }>({
    mutationFn: async (parameters) => {
      if (!walletClient) throw new Error('Wallet not connected')
      return setQueues(walletClient, parameters)
    },
  })
}
