'use client'

import { useMutation } from '@tanstack/react-query'
import type { Address } from 'viem'
import { usePublicClient, useWalletClient } from 'wagmi'
import type { SpawnMultiVehicleParameters } from '../../actions/multiVehicle/spawnMultiVehicle.js'
import {
  type SpawnMultiVehicleReturnType,
  spawnMultiVehicle,
} from '../../actions/multiVehicle/spawnMultiVehicle.js'

export function useSpawnMultiVehicle() {
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  return useMutation<
    SpawnMultiVehicleReturnType,
    Error,
    SpawnMultiVehicleParameters & { account: Address }
  >({
    mutationFn: async (parameters) => {
      if (!publicClient) throw new Error('Public client not available')
      if (!walletClient) throw new Error('Wallet not connected')
      return spawnMultiVehicle(publicClient, walletClient, parameters)
    },
  })
}
