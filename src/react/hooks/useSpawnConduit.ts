'use client'

import { useMutation } from '@tanstack/react-query'
import type { Address, Hash } from 'viem'
import { usePublicClient, useWalletClient } from 'wagmi'
import { prepareSpawnConduit } from '../../actions/conduit/spawnConduit.js'
import type { SpawnConduitParameters } from '../../actions/conduit/types.js'
import { simulateThenWrite } from '../simulateThenWrite.js'

export type UseSpawnConduitParameters = {
  /** Chain to simulate and sign on. Defaults to the connected one. */
  chainId?: number | undefined
}

export function useSpawnConduit({ chainId }: UseSpawnConduitParameters = {}) {
  const publicClient = usePublicClient({ chainId })
  const { data: walletClient } = useWalletClient({ chainId })

  return useMutation<Hash, Error, SpawnConduitParameters & { account: Address }>({
    mutationFn: async (parameters) => {
      if (!walletClient) throw new Error('Wallet not connected')
      if (!publicClient) throw new Error('No public client configured for the requested chain')

      return simulateThenWrite(
        { publicClient, walletClient },
        prepareSpawnConduit(parameters),
        parameters.account,
      )
    },
  })
}
