'use client'

import { useMutation } from '@tanstack/react-query'
import type { Address, Hash } from 'viem'
import { useWalletClient } from 'wagmi'
import {
  type AuthorizeVehicleParameters,
  authorizeVehicle,
} from '../../actions/multiVehicle/authorizeVehicle.js'

export function useAuthorizeVehicle() {
  const { data: walletClient } = useWalletClient()

  return useMutation<Hash, Error, AuthorizeVehicleParameters & { account: Address }>({
    mutationFn: async (parameters) => {
      if (!walletClient) throw new Error('Wallet not connected')
      return authorizeVehicle(walletClient, parameters)
    },
  })
}
