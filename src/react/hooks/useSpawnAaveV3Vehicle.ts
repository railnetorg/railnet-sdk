'use client'

import { useMutation } from '@tanstack/react-query'
import type { Address, Hash } from 'viem'
import { useWalletClient } from 'wagmi'
import {
  type SpawnAaveV3VehicleParameters,
  spawnAaveV3Vehicle,
} from '../../actions/vehicle/spawnAaveV3Vehicle.js'

export function useSpawnAaveV3Vehicle() {
  const { data: walletClient } = useWalletClient()

  return useMutation<Hash, Error, SpawnAaveV3VehicleParameters & { account: Address }>({
    mutationFn: async (parameters) => {
      if (!walletClient) throw new Error('Wallet not connected')
      return spawnAaveV3Vehicle(walletClient, parameters)
    },
  })
}
