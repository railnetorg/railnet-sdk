'use client'

import { useMutation } from '@tanstack/react-query'
import type { Address, Hash } from 'viem'
import { useWalletClient } from 'wagmi'
import { type RedeemConduitParameters, redeemConduit } from '../../actions/conduit/redeemConduit.js'

export function useRedeemConduit() {
  const { data: walletClient } = useWalletClient()

  return useMutation<Hash, Error, RedeemConduitParameters & { account: Address }>({
    mutationFn: async (parameters) => {
      if (!walletClient) throw new Error('Wallet not connected')
      return redeemConduit(walletClient, parameters)
    },
  })
}
