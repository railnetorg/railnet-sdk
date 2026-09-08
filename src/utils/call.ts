import type { Address } from 'viem'

export type ToCallParameters = {
  address: Address
  abi: unknown
  functionName: string
  args?: readonly unknown[] | undefined
}

/**
 * Rewrites a built call for `sendCalls` (EIP-5792), whose calls name their target `to` rather than
 * `address`. Batching an approval with a deposit is one user confirmation on a wallet that
 * supports it — but check the wallet's capabilities before relying on the two landing atomically,
 * and build the call for the address that will end up as `msg.sender`.
 */
export function toCall<const call extends ToCallParameters>(call: call) {
  const { address, ...rest } = call
  return { ...rest, to: address }
}
