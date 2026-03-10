'use client'

import { useMutation } from '@tanstack/react-query'
import type { Address } from 'viem'
import { useWalletClient } from 'wagmi'
import type { SetQueuesParameters } from '../../actions/multiVehicle/setQueues.js'
import { type SetQueuesReturnType, setQueues } from '../../actions/multiVehicle/setQueues.js'

export function useSetQueues() {
  const { data: walletClient } = useWalletClient()

  return useMutation<SetQueuesReturnType, Error, SetQueuesParameters & { account: Address }>({
    mutationFn: async (parameters) => {
      if (!walletClient) throw new Error('Wallet not connected')
      return setQueues(walletClient, parameters)
    },
  })
}
