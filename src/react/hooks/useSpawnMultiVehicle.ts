'use client'

import { useMutation } from '@tanstack/react-query'
import type { Address, Hash } from 'viem'
import { usePublicClient, useWalletClient } from 'wagmi'
import {
  prepareSpawnMultiVehicle,
  type SpawnMultiVehicleParameters,
} from '../../actions/multiVehicle/spawnMultiVehicle.js'
import { simulateThenWrite } from '../simulateThenWrite.js'

export type UseSpawnMultiVehicleParameters = {
  /** Chain to simulate and sign on. Defaults to the connected one. */
  chainId?: number | undefined
}

export function useSpawnMultiVehicle({ chainId }: UseSpawnMultiVehicleParameters = {}) {
  const publicClient = usePublicClient({ chainId })
  const { data: walletClient } = useWalletClient({ chainId })

  return useMutation<Hash, Error, SpawnMultiVehicleParameters & { account: Address }>({
    mutationFn: async (parameters) => {
      if (!walletClient) throw new Error('Wallet not connected')
      if (!publicClient) throw new Error('No public client configured for the requested chain')

      return simulateThenWrite(
        { publicClient, walletClient },
        prepareSpawnMultiVehicle(parameters),
        parameters.account,
      )
    },
  })
}
