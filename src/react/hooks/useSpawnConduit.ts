'use client'

import { useMutation } from '@tanstack/react-query'
import type { Address } from 'viem'
import { useWalletClient } from 'wagmi'
import { type SpawnConduitReturnType, spawnConduit } from '../../actions/conduit/spawnConduit.js'
import type { SpawnConduitParameters } from '../../actions/conduit/types.js'

export function useSpawnConduit() {
  const { data: walletClient } = useWalletClient()

  return useMutation<SpawnConduitReturnType, Error, SpawnConduitParameters & { account: Address }>({
    mutationFn: async (parameters) => {
      if (!walletClient) throw new Error('Wallet not connected')
      return spawnConduit(walletClient, parameters)
    },
  })
}
