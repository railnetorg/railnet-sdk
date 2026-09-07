'use client'

import { useMutation } from '@tanstack/react-query'
import type { Address, Hash } from 'viem'
import { useWalletClient } from 'wagmi'
import {
  type SpawnAccessControlParameters,
  spawnAccessControl,
} from '../../actions/accessControl/spawnAccessControl.js'

export function useSpawnAccessControl() {
  const { data: walletClient } = useWalletClient()

  return useMutation<Hash, Error, SpawnAccessControlParameters & { account: Address }>({
    mutationFn: async (parameters) => {
      if (!walletClient) throw new Error('Wallet not connected')
      return spawnAccessControl(walletClient, parameters)
    },
  })
}
