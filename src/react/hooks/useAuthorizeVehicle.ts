'use client'

import { useMutation } from '@tanstack/react-query'
import type { Address } from 'viem'
import { useWalletClient } from 'wagmi'
import type { AuthorizeVehicleParameters } from '../../actions/multiVehicle/authorizeVehicle.js'
import {
  type AuthorizeVehicleReturnType,
  authorizeVehicle,
} from '../../actions/multiVehicle/authorizeVehicle.js'

export function useAuthorizeVehicle() {
  const { data: walletClient } = useWalletClient()

  return useMutation<
    AuthorizeVehicleReturnType,
    Error,
    AuthorizeVehicleParameters & { account: Address }
  >({
    mutationFn: async (parameters) => {
      if (!walletClient) throw new Error('Wallet not connected')
      return authorizeVehicle(walletClient, parameters)
    },
  })
}
