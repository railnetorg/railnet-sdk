'use client'

import { useMutation } from '@tanstack/react-query'
import { type Address, erc20Abi, type Hash } from 'viem'
import { writeContract } from 'viem/actions'
import { useWalletClient } from 'wagmi'

export type ApproveConduitDepositVariables = {
  /** The conduit that will pull the token, and so the spender being approved. */
  conduit: Address
  token: Address
  amount: bigint
  account: Address
}

export type UseApproveConduitDepositParameters = {
  /** Chain to sign on. Defaults to the connected one. */
  chainId?: number | undefined
}

/**
 * Approves a conduit to pull the deposit token. A deposit reverts without it, and the allowance is
 * spent by the deposit, so a later deposit of the same size needs it again.
 */
export function useApproveConduitDeposit({ chainId }: UseApproveConduitDepositParameters = {}) {
  const { data: walletClient } = useWalletClient({ chainId })

  return useMutation<Hash, Error, ApproveConduitDepositVariables>({
    mutationFn: async ({ conduit, token, amount, account }) => {
      if (!walletClient) throw new Error('Wallet not connected')

      return writeContract(walletClient, {
        address: token,
        abi: erc20Abi,
        functionName: 'approve',
        args: [conduit, amount],
        account,
        chain: walletClient.chain,
      })
    },
  })
}
