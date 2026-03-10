'use client'

import { useMutation } from '@tanstack/react-query'
import type { Address } from 'viem'
import { useWalletClient } from 'wagmi'
import type { SpawnAaveV3VehicleParameters } from '../../actions/vehicle/spawnAaveV3Vehicle.js'
import {
  type SpawnAaveV3VehicleReturnType,
  spawnAaveV3Vehicle,
} from '../../actions/vehicle/spawnAaveV3Vehicle.js'

export function useSpawnAaveV3Vehicle() {
  const { data: walletClient } = useWalletClient()

  return useMutation<
    SpawnAaveV3VehicleReturnType,
    Error,
    SpawnAaveV3VehicleParameters & { account: Address }
  >({
    mutationFn: async (parameters) => {
      if (!walletClient) throw new Error('Wallet not connected')
      return spawnAaveV3Vehicle(walletClient, parameters)
    },
  })
}
