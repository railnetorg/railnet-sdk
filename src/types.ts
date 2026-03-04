import type { Address } from 'viem'

export type { Address } from 'viem'

export type ConduitPosition = {
  /** Conduit shares held by the account */
  shares: bigint
  /** Underlying asset value of the shares (converted via exchange rate) */
  assets: bigint
  /** Conduit contract address */
  conduit: Address
  /** Account address */
  account: Address
}

export type ConduitInfo = {
  /** Conduit contract address */
  conduit: Address
  /** Underlying asset address */
  asset: Address
  /** Total conduit shares in circulation */
  totalSupply: bigint
  /** Total underlying assets managed */
  totalAssets: bigint
  /** Vehicle shares held by the conduit */
  holdings: bigint
  /** Conduit share decimals */
  decimals: number
  /** Conduit token name */
  name: string
  /** Conduit token symbol */
  symbol: string
  /** Whether the conduit is enabled for public access */
  isEnabled: boolean
}
