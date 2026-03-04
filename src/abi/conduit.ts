/**
 * ABI for the Railnet Conduit contract.
 *
 * A Conduit is an ERC-20 wrapper around a STEAM Vehicle that issues its own
 * shares to represent proportional ownership of the underlying vehicle position.
 *
 * Source: contracts/src/conduit/Conduit.sol
 */
export const conduitAbi = [
  // ─── ERC-20 (inherited from ERC20Upgradeable) ─────────────────────
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [{ name: 'account', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'totalSupply',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'decimals',
    inputs: [],
    outputs: [{ name: '', type: 'uint8', internalType: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'name',
    inputs: [],
    outputs: [{ name: '', type: 'string', internalType: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'symbol',
    inputs: [],
    outputs: [{ name: '', type: 'string', internalType: 'string' }],
    stateMutability: 'view',
  },

  // ─── Conduit-specific reads ───────────────────────────────────────
  {
    type: 'function',
    name: 'totalAssets',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'holdings',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'asset',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'isEnabled',
    inputs: [],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'queriesCount',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'convert',
    inputs: [
      {
        name: 'assets',
        type: 'tuple[]',
        internalType: 'struct Asset[]',
        components: [
          { name: 'asset', type: 'address', internalType: 'address' },
          { name: 'value', type: 'uint256', internalType: 'uint256' },
        ],
      },
      { name: 'sharesToAssets', type: 'bool', internalType: 'bool' },
    ],
    outputs: [
      {
        name: 'converted',
        type: 'tuple[]',
        internalType: 'struct Asset[]',
        components: [
          { name: 'asset', type: 'address', internalType: 'address' },
          { name: 'value', type: 'uint256', internalType: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getVehicle',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'contract IVehicle' }],
    stateMutability: 'view',
  },
] as const
