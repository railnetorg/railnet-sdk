import type { Hex } from 'viem'
import { toHex } from 'viem'

/**
 * Generates a cryptographically random 32-byte salt.
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
