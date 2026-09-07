'use client'

import { useMutation } from '@tanstack/react-query'
import type { Address, Hash } from 'viem'
import { useWalletClient } from 'wagmi'
import {
  type RevokeScopedRoleParameters,
  revokeScopedRole,
} from '../../actions/accessControl/revokeScopedRole.js'

export function useRevokeScopedRole() {
  const { data: walletClient } = useWalletClient()

  return useMutation<Hash, Error, RevokeScopedRoleParameters & { account: Address }>({
    mutationFn: async (parameters) => {
      if (!walletClient) throw new Error('Wallet not connected')
      return revokeScopedRole(walletClient, parameters)
    },
  })
}
