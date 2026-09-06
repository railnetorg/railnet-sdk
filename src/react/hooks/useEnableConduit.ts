'use client'

import { useMutation } from '@tanstack/react-query'
import type { Address, Hash } from 'viem'
import { usePublicClient, useWalletClient } from 'wagmi'
import {
  type EnableConduitParameters,
  prepareEnableConduit,
} from '../../actions/conduit/enableConduit.js'
import { simulateThenWrite } from '../../utils/simulateThenWrite.js'

export type UseEnableConduitParameters = {
  /** Chain to simulate and sign on. Defaults to the connected one. */
  chainId?: number | undefined
}

export function useEnableConduit({ chainId }: UseEnableConduitParameters = {}) {
  const publicClient = usePublicClient({ chainId })
  const { data: walletClient } = useWalletClient({ chainId })

  return useMutation<Hash, Error, EnableConduitParameters & { account: Address }>({
    mutationFn: async (parameters) => {
      if (!walletClient) throw new Error('Wallet not connected')
      if (!publicClient) throw new Error('No public client configured for the requested chain')

      return simulateThenWrite(
        { publicClient, walletClient },
        prepareEnableConduit(parameters),
        parameters.account,
      )
    },
  })
}
