export const conduitAbi = [
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
  {
    type: 'function',
    name: 'estimate',
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
      { name: 'mode', type: 'uint8', internalType: 'enum Mode' },
      { name: 'estimationType', type: 'uint8', internalType: 'enum EstimationType' },
    ],
    outputs: [
      {
        name: 'estimations',
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
    name: 'create',
    inputs: [
      {
        name: 'query',
        type: 'tuple',
        internalType: 'struct Query',
        components: [
          { name: 'owner', type: 'address', internalType: 'address' },
          { name: 'receiver', type: 'address', internalType: 'address' },
          {
            name: 'input',
            type: 'tuple[]',
            internalType: 'struct Asset[]',
            components: [
              { name: 'asset', type: 'address', internalType: 'address' },
              { name: 'value', type: 'uint256', internalType: 'uint256' },
            ],
          },
          {
            name: 'output',
            type: 'tuple[]',
            internalType: 'struct Asset[]',
            components: [
              { name: 'asset', type: 'address', internalType: 'address' },
              { name: 'value', type: 'uint256', internalType: 'uint256' },
            ],
          },
          { name: 'mode', type: 'uint8', internalType: 'enum Mode' },
          { name: 'salt', type: 'bytes32', internalType: 'bytes32' },
          { name: 'data', type: 'bytes', internalType: 'bytes' },
        ],
      },
      { name: 'receiver', type: 'address', internalType: 'address' },
    ],
    outputs: [
      { name: 'queryId', type: 'bytes32', internalType: 'Id' },
      { name: 'state', type: 'uint8', internalType: 'enum State' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'createRedeemFromConduitShares',
    inputs: [
      { name: 'conduitShares', type: 'uint256', internalType: 'uint256' },
      {
        name: 'outputAssets',
        type: 'tuple[]',
        internalType: 'struct Asset[]',
        components: [
          { name: 'asset', type: 'address', internalType: 'address' },
          { name: 'value', type: 'uint256', internalType: 'uint256' },
        ],
      },
      { name: 'salt', type: 'bytes32', internalType: 'bytes32' },
      { name: 'receiver', type: 'address', internalType: 'address' },
    ],
    outputs: [
      { name: 'queryId', type: 'bytes32', internalType: 'Id' },
      { name: 'state', type: 'uint8', internalType: 'enum State' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'process',
    inputs: [
      {
        name: 'query',
        type: 'tuple',
        internalType: 'struct Query',
        components: [
          { name: 'owner', type: 'address', internalType: 'address' },
          { name: 'receiver', type: 'address', internalType: 'address' },
          {
            name: 'input',
            type: 'tuple[]',
            internalType: 'struct Asset[]',
            components: [
              { name: 'asset', type: 'address', internalType: 'address' },
              { name: 'value', type: 'uint256', internalType: 'uint256' },
            ],
          },
          {
            name: 'output',
            type: 'tuple[]',
            internalType: 'struct Asset[]',
            components: [
              { name: 'asset', type: 'address', internalType: 'address' },
              { name: 'value', type: 'uint256', internalType: 'uint256' },
            ],
          },
          { name: 'mode', type: 'uint8', internalType: 'enum Mode' },
          { name: 'salt', type: 'bytes32', internalType: 'bytes32' },
          { name: 'data', type: 'bytes', internalType: 'bytes' },
        ],
      },
    ],
    outputs: [
      { name: 'queryId', type: 'bytes32', internalType: 'Id' },
      { name: 'state', type: 'uint8', internalType: 'enum State' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'enable',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'allowance',
    inputs: [
      { name: 'owner', type: 'address', internalType: 'address' },
      { name: 'spender', type: 'address', internalType: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'approve',
    inputs: [
      { name: 'spender', type: 'address', internalType: 'address' },
      { name: 'amount', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'nonpayable',
  },
] as const
