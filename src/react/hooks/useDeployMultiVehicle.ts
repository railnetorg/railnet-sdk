'use client'

import { useMutation } from '@tanstack/react-query'
import type { Address } from 'viem'
import { useWalletClient } from 'wagmi'
import type { DeployMultiVehicleParameters } from '../../workflows/deployMultiVehicle.js'
import {
  type DeployMultiVehicleResult,
  deployMultiVehicle,
} from '../../workflows/deployMultiVehicle.js'

export function useDeployMultiVehicle() {
  const { data: walletClient } = useWalletClient()

  return useMutation<
    DeployMultiVehicleResult,
    Error,
    DeployMultiVehicleParameters & { account: Address }
  >({
    mutationFn: async (parameters) => {
      if (!walletClient) throw new Error('Wallet not connected')
      return deployMultiVehicle(walletClient, parameters)
    },
  })
}
