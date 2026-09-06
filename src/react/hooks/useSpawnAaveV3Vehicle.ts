'use client'

import { useMutation } from '@tanstack/react-query'
import type { Address, Hash } from 'viem'
import { usePublicClient, useWalletClient } from 'wagmi'
import {
  prepareSpawnAaveV3Vehicle,
  type SpawnAaveV3VehicleParameters,
} from '../../actions/vehicle/spawnAaveV3Vehicle.js'
import { simulateThenWrite } from '../../utils/simulateThenWrite.js'

export type UseSpawnAaveV3VehicleParameters = {
  /** Chain to simulate and sign on. Defaults to the connected one. */
  chainId?: number | undefined
}

export function useSpawnAaveV3Vehicle({ chainId }: UseSpawnAaveV3VehicleParameters = {}) {
  const publicClient = usePublicClient({ chainId })
  const { data: walletClient } = useWalletClient({ chainId })

  return useMutation<Hash, Error, SpawnAaveV3VehicleParameters & { account: Address }>({
    mutationFn: async (parameters) => {
      if (!walletClient) throw new Error('Wallet not connected')
      if (!publicClient) throw new Error('No public client configured for the requested chain')

      return simulateThenWrite(
        { publicClient, walletClient },
        prepareSpawnAaveV3Vehicle(parameters),
        parameters.account,
      )
    },
  })
}
