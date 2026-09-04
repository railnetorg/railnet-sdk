export const baseVehicleAbi = [
  {
    type: 'function',
    name: 'accessControl',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'contract ExternalAccessControl' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'allowModule',
    inputs: [
      { name: 'module', type: 'address', internalType: 'address' },
      { name: 'allowed', type: 'bool', internalType: 'bool' },
    ],
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
      { name: 'value', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'nonpayable',
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
    name: 'balanceOf',
    inputs: [{ name: 'account', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'convert',
    inputs: [
      {
        name: 'asset_',
        type: 'tuple',
        internalType: 'struct Asset',
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
        type: 'tuple',
        internalType: 'struct Asset',
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
            type: 'tuple',
            internalType: 'struct Asset',
            components: [
              { name: 'asset', type: 'address', internalType: 'address' },
              { name: 'value', type: 'uint256', internalType: 'uint256' },
            ],
          },
          {
            name: 'output',
            type: 'tuple',
            internalType: 'struct Asset',
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
    outputs: [{ name: '', type: 'uint8', internalType: 'enum State' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'decimals',
    inputs: [],
    outputs: [{ name: '', type: 'uint8', internalType: 'uint8' }],
    stateMutability: 'view',
  },
  { type: 'function', name: 'enable', inputs: [], outputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    name: 'error',
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
            type: 'tuple',
            internalType: 'struct Asset',
            components: [
              { name: 'asset', type: 'address', internalType: 'address' },
              { name: 'value', type: 'uint256', internalType: 'uint256' },
            ],
          },
          {
            name: 'output',
            type: 'tuple',
            internalType: 'struct Asset',
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
    outputs: [{ name: '', type: 'bytes', internalType: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'estimate',
    inputs: [
      {
        name: 'asset_',
        type: 'tuple',
        internalType: 'struct Asset',
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
        name: '',
        type: 'tuple',
        internalType: 'struct Asset',
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
    name: 'feeManager',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'contract FeeManager' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'feesConfigId',
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
            type: 'tuple',
            internalType: 'struct Asset',
            components: [
              { name: 'asset', type: 'address', internalType: 'address' },
              { name: 'value', type: 'uint256', internalType: 'uint256' },
            ],
          },
          {
            name: 'output',
            type: 'tuple',
            internalType: 'struct Asset',
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
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'maxDeposit',
    inputs: [{ name: 'account', type: 'address', internalType: 'address' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct Asset',
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
    name: 'maxRedeem',
    inputs: [{ name: 'account', type: 'address', internalType: 'address' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct Asset',
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
    name: 'modulesManager',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'contract ModulesManager' }],
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
    name: 'ready',
    inputs: [],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'recover',
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
            type: 'tuple',
            internalType: 'struct Asset',
            components: [
              { name: 'asset', type: 'address', internalType: 'address' },
              { name: 'value', type: 'uint256', internalType: 'uint256' },
            ],
          },
          {
            name: 'output',
            type: 'tuple',
            internalType: 'struct Asset',
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
      { name: '', type: 'uint8', internalType: 'enum State' },
      {
        name: '',
        type: 'tuple',
        internalType: 'struct Asset',
        components: [
          { name: 'asset', type: 'address', internalType: 'address' },
          { name: 'value', type: 'uint256', internalType: 'uint256' },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'resume',
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
            type: 'tuple',
            internalType: 'struct Asset',
            components: [
              { name: 'asset', type: 'address', internalType: 'address' },
              { name: 'value', type: 'uint256', internalType: 'uint256' },
            ],
          },
          {
            name: 'output',
            type: 'tuple',
            internalType: 'struct Asset',
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
    outputs: [{ name: '', type: 'uint8', internalType: 'enum State' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'routes',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'tuple[]',
        internalType: 'struct Route[]',
        components: [
          { name: 'input', type: 'address', internalType: 'address' },
          { name: 'output', type: 'address', internalType: 'address' },
        ],
      },
      {
        name: '',
        type: 'tuple[]',
        internalType: 'struct Route[]',
        components: [
          { name: 'input', type: 'address', internalType: 'address' },
          { name: 'output', type: 'address', internalType: 'address' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'setInterceptions',
    inputs: [
      {
        name: 'interceptions',
        type: 'tuple[]',
        internalType: 'struct Interceptor.Interception[]',
        components: [
          { name: 'asset', type: 'address', internalType: 'address' },
          {
            name: 'recipients',
            type: 'tuple[]',
            internalType: 'struct Interceptor.Recipient[]',
            components: [
              { name: 'target', type: 'address', internalType: 'address' },
              { name: 'shareBps', type: 'uint256', internalType: 'uint256' },
              { name: 'chainId', type: 'uint256', internalType: 'uint256' },
            ],
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'state',
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
            type: 'tuple',
            internalType: 'struct Asset',
            components: [
              { name: 'asset', type: 'address', internalType: 'address' },
              { name: 'value', type: 'uint256', internalType: 'uint256' },
            ],
          },
          {
            name: 'output',
            type: 'tuple',
            internalType: 'struct Asset',
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
    outputs: [{ name: '', type: 'uint8', internalType: 'enum State' }],
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
    name: 'totalSupply',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'transfer',
    inputs: [
      { name: 'to', type: 'address', internalType: 'address' },
      { name: 'value', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'transferFrom',
    inputs: [
      { name: 'from', type: 'address', internalType: 'address' },
      { name: 'to', type: 'address', internalType: 'address' },
      { name: 'value', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'unlock',
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
            type: 'tuple',
            internalType: 'struct Asset',
            components: [
              { name: 'asset', type: 'address', internalType: 'address' },
              { name: 'value', type: 'uint256', internalType: 'uint256' },
            ],
          },
          {
            name: 'output',
            type: 'tuple',
            internalType: 'struct Asset',
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
      { name: '', type: 'uint8', internalType: 'enum State' },
      {
        name: '',
        type: 'tuple',
        internalType: 'struct Asset',
        components: [
          { name: 'asset', type: 'address', internalType: 'address' },
          { name: 'value', type: 'uint256', internalType: 'uint256' },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'Approval',
    inputs: [
      { name: 'owner', type: 'address', indexed: true, internalType: 'address' },
      { name: 'spender', type: 'address', indexed: true, internalType: 'address' },
      { name: 'value', type: 'uint256', indexed: false, internalType: 'uint256' },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Transfer',
    inputs: [
      { name: 'from', type: 'address', indexed: true, internalType: 'address' },
      { name: 'to', type: 'address', indexed: true, internalType: 'address' },
      { name: 'value', type: 'uint256', indexed: false, internalType: 'uint256' },
    ],
    anonymous: false,
  },
] as const
