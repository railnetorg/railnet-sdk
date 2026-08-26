import type { Hex } from 'viem'
import { toHex } from 'viem'

/**
 * Generates a cryptographically random 32-byte salt.
 *
 * Salts that determine a deployment address must be kept by the caller so a failed spawn can be
 * retried against the same address. Log the value; do not re-derive it.
 *
 * @returns A random `bytes32`
 *
 * @example
 * import { prepareSpawnConduit, randomSalt } from '@railnetorg/railnet-sdk'
 *
 * const deploymentSalt = randomSalt()
 * const querySalt = randomSalt()
 *
 * const prepared = prepareSpawnConduit({ deploymentSalt, querySalt, ...rest })
 */
export function randomSalt(): Hex {
  return toHex(crypto.getRandomValues(new Uint8Array(32)))
}
