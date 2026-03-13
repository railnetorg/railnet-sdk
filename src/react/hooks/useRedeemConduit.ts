'use client'

import { useMutation } from '@tanstack/react-query'
import type { Address, Hash } from 'viem'
import { usePublicClient, useWalletClient } from 'wagmi'
import { type RedeemConduitParameters, redeemConduit } from '../../actions/conduit/redeemConduit.js'

export function useRedeemConduit() {
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  return useMutation<Hash, Error, RedeemConduitParameters & { account: Address }>({
    mutationFn: async (parameters) => {
      if (!publicClient) throw new Error('Public client not available')
      if (!walletClient) throw new Error('Wallet not connected')
      return redeemConduit(publicClient, walletClient, parameters)
    },
  })
}
