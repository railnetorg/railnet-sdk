'use client'

import { useMutation } from '@tanstack/react-query'
import type { Address } from 'viem'
import { useWalletClient } from 'wagmi'
import {
  type RedeemConduitParameters,
  type RedeemConduitReturnType,
  redeemConduit,
} from '../../actions/conduit/redeemConduit.js'

export function useRedeemConduit() {
  const { data: walletClient } = useWalletClient()

  return useMutation<
    RedeemConduitReturnType,
    Error,
    RedeemConduitParameters & { account: Address }
  >({
    mutationFn: async (parameters) => {
      if (!walletClient) throw new Error('Wallet not connected')
      return redeemConduit(walletClient, parameters)
    },
  })
}
