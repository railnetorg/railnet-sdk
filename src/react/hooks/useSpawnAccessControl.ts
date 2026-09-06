'use client'

import { useMutation } from '@tanstack/react-query'
import type { Address, Hash } from 'viem'
import { usePublicClient, useWalletClient } from 'wagmi'
import {
  prepareSpawnAccessControl,
  type SpawnAccessControlParameters,
} from '../../actions/accessControl/spawnAccessControl.js'
import { simulateThenWrite } from '../../utils/simulateThenWrite.js'

export type UseSpawnAccessControlParameters = {
  /** Chain to simulate and sign on. Defaults to the connected one. */
  chainId?: number | undefined
}

export function useSpawnAccessControl({ chainId }: UseSpawnAccessControlParameters = {}) {
  const publicClient = usePublicClient({ chainId })
  const { data: walletClient } = useWalletClient({ chainId })

  return useMutation<Hash, Error, SpawnAccessControlParameters & { account: Address }>({
    mutationFn: async (parameters) => {
      if (!walletClient) throw new Error('Wallet not connected')
      if (!publicClient) throw new Error('No public client configured for the requested chain')

      return simulateThenWrite(
        { publicClient, walletClient },
        prepareSpawnAccessControl(parameters),
        parameters.account,
      )
    },
  })
}
