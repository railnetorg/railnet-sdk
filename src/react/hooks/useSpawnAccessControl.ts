'use client'

import { useMutation } from '@tanstack/react-query'
import type { Address } from 'viem'
import { usePublicClient, useWalletClient } from 'wagmi'
import type { SpawnAccessControlParameters } from '../../actions/accessControl/spawnAccessControl.js'
import {
  type SpawnAccessControlReturnType,
  spawnAccessControl,
} from '../../actions/accessControl/spawnAccessControl.js'

export function useSpawnAccessControl() {
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  return useMutation<
    SpawnAccessControlReturnType,
    Error,
    SpawnAccessControlParameters & { account: Address }
  >({
    mutationFn: async (parameters) => {
      if (!publicClient) throw new Error('Public client not available')
      if (!walletClient) throw new Error('Wallet not connected')
      return spawnAccessControl(publicClient, walletClient, parameters)
    },
  })
}
