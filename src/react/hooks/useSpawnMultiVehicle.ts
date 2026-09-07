'use client'

import { useMutation } from '@tanstack/react-query'
import type { Address, Hash } from 'viem'
import { useWalletClient } from 'wagmi'
import {
  type SpawnMultiVehicleParameters,
  spawnMultiVehicle,
} from '../../actions/multiVehicle/spawnMultiVehicle.js'

export function useSpawnMultiVehicle() {
  const { data: walletClient } = useWalletClient()

  return useMutation<Hash, Error, SpawnMultiVehicleParameters & { account: Address }>({
    mutationFn: async (parameters) => {
      if (!walletClient) throw new Error('Wallet not connected')
      return spawnMultiVehicle(walletClient, parameters)
    },
  })
}
