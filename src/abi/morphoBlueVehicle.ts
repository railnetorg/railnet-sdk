export const morphoBlueVehicleAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: 'params',
        type: 'tuple',
        internalType: 'struct MorphoBlueVehicleStructs.ImmutableParams',
        components: [
          {
            name: 'morpho',
            type: 'address',
            internalType: 'contract IMorpho',
          },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'MORPHO',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract IMorpho',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'accessControl',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract ExternalAccessControl',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'allowModule',
    inputs: [
      {
        name: 'module',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'allowed',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'allowance',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'spender',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'approve',
    inputs: [
      {
        name: 'spender',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'value',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'asset',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [
      {
        name: 'account',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
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
          {
            name: 'asset',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'value',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
      },
      {
        name: 'sharesToAssets',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    outputs: [
      {
        name: 'converted',
        type: 'tuple',
        internalType: 'struct Asset',
        components: [
          {
            name: 'asset',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'value',
            type: 'uint256',
            internalType: 'uint256',
          },
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
          {
            name: 'owner',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'receiver',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'input',
            type: 'tuple',
            internalType: 'struct Asset',
            components: [
              {
                name: 'asset',
                type: 'address',
                internalType: 'address',
              },
              {
                name: 'value',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
          {
            name: 'output',
            type: 'tuple',
            internalType: 'struct Asset',
            components: [
              {
                name: 'asset',
                type: 'address',
                internalType: 'address',
              },
              {
                name: 'value',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
          {
            name: 'mode',
            type: 'uint8',
            internalType: 'enum Mode',
          },
          {
            name: 'salt',
            type: 'bytes32',
            internalType: 'bytes32',
          },
          {
            name: 'data',
            type: 'bytes',
            internalType: 'bytes',
          },
        ],
      },
    ],
    outputs: [
      {
        name: 'newState',
        type: 'uint8',
        internalType: 'enum State',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'decimals',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint8',
        internalType: 'uint8',
      },
    ],
    stateMutability: 'pure',
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
    name: 'error',
    inputs: [
      {
        name: 'query',
        type: 'tuple',
        internalType: 'struct Query',
        components: [
          {
            name: 'owner',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'receiver',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'input',
            type: 'tuple',
            internalType: 'struct Asset',
            components: [
              {
                name: 'asset',
                type: 'address',
                internalType: 'address',
              },
              {
                name: 'value',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
          {
            name: 'output',
            type: 'tuple',
            internalType: 'struct Asset',
            components: [
              {
                name: 'asset',
                type: 'address',
                internalType: 'address',
              },
              {
                name: 'value',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
          {
            name: 'mode',
            type: 'uint8',
            internalType: 'enum Mode',
          },
          {
            name: 'salt',
            type: 'bytes32',
            internalType: 'bytes32',
          },
          {
            name: 'data',
            type: 'bytes',
            internalType: 'bytes',
          },
        ],
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bytes',
        internalType: 'bytes',
      },
    ],
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
          {
            name: 'asset',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'value',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
      },
      {
        name: 'mode',
        type: 'uint8',
        internalType: 'enum Mode',
      },
      {
        name: 'estimationType',
        type: 'uint8',
        internalType: 'enum EstimationType',
      },
    ],
    outputs: [
      {
        name: 'estimation',
        type: 'tuple',
        internalType: 'struct Asset',
        components: [
          {
            name: 'asset',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'value',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'executeModule',
    inputs: [
      {
        name: 'module',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'data',
        type: 'bytes',
        internalType: 'bytes',
      },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'feeManager',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract FeeManager',
      },
    ],
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
          {
            name: 'owner',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'receiver',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'input',
            type: 'tuple',
            internalType: 'struct Asset',
            components: [
              {
                name: 'asset',
                type: 'address',
                internalType: 'address',
              },
              {
                name: 'value',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
          {
            name: 'output',
            type: 'tuple',
            internalType: 'struct Asset',
            components: [
              {
                name: 'asset',
                type: 'address',
                internalType: 'address',
              },
              {
                name: 'value',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
          {
            name: 'mode',
            type: 'uint8',
            internalType: 'enum Mode',
          },
          {
            name: 'salt',
            type: 'bytes32',
            internalType: 'bytes32',
          },
          {
            name: 'data',
            type: 'bytes',
            internalType: 'bytes',
          },
        ],
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bytes32',
        internalType: 'bytes32',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'initialize',
    inputs: [
      {
        name: 'params',
        type: 'tuple',
        internalType: 'struct MorphoBlueVehicleStructs.InitParams',
        components: [
          {
            name: 'deployer',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'marketId',
            type: 'bytes32',
            internalType: 'Id',
          },
          {
            name: 'accessControl',
            type: 'address',
            internalType: 'contract ExternalAccessControl',
          },
          {
            name: 'feeManager',
            type: 'address',
            internalType: 'contract FeeManager',
          },
          {
            name: 'modulesManager',
            type: 'address',
            internalType: 'contract ModulesManager',
          },
          {
            name: 'forbiddenAddresses',
            type: 'address[]',
            internalType: 'address[]',
          },
          {
            name: 'name',
            type: 'string',
            internalType: 'string',
          },
          {
            name: 'symbol',
            type: 'string',
            internalType: 'string',
          },
          {
            name: 'registry',
            type: 'address',
            internalType: 'contract IQueryRegistry',
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'interceptions',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'tuple[]',
        internalType: 'struct Interceptor.Interception[]',
        components: [
          {
            name: 'asset',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'recipients',
            type: 'tuple[]',
            internalType: 'struct Interceptor.Recipient[]',
            components: [
              {
                name: 'target',
                type: 'address',
                internalType: 'address',
              },
              {
                name: 'shareBps',
                type: 'uint256',
                internalType: 'uint256',
              },
              {
                name: 'chainId',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'marketId',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'bytes32',
        internalType: 'Id',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'maxDeposit',
    inputs: [
      {
        name: 'account',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: 'maxAsset',
        type: 'tuple',
        internalType: 'struct Asset',
        components: [
          {
            name: 'asset',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'value',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'maxRedeem',
    inputs: [
      {
        name: 'account',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: 'maxAsset',
        type: 'tuple',
        internalType: 'struct Asset',
        components: [
          {
            name: 'asset',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'value',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'modulesManager',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract ModulesManager',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'multicall',
    inputs: [
      {
        name: 'data',
        type: 'bytes[]',
        internalType: 'bytes[]',
      },
    ],
    outputs: [
      {
        name: 'results',
        type: 'bytes[]',
        internalType: 'bytes[]',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'name',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'string',
        internalType: 'string',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'ready',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'recover',
    inputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct Query',
        components: [
          {
            name: 'owner',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'receiver',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'input',
            type: 'tuple',
            internalType: 'struct Asset',
            components: [
              {
                name: 'asset',
                type: 'address',
                internalType: 'address',
              },
              {
                name: 'value',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
          {
            name: 'output',
            type: 'tuple',
            internalType: 'struct Asset',
            components: [
              {
                name: 'asset',
                type: 'address',
                internalType: 'address',
              },
              {
                name: 'value',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
          {
            name: 'mode',
            type: 'uint8',
            internalType: 'enum Mode',
          },
          {
            name: 'salt',
            type: 'bytes32',
            internalType: 'bytes32',
          },
          {
            name: 'data',
            type: 'bytes',
            internalType: 'bytes',
          },
        ],
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint8',
        internalType: 'enum State',
      },
      {
        name: '',
        type: 'tuple',
        internalType: 'struct Asset',
        components: [
          {
            name: 'asset',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'value',
            type: 'uint256',
            internalType: 'uint256',
          },
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
        name: '',
        type: 'tuple',
        internalType: 'struct Query',
        components: [
          {
            name: 'owner',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'receiver',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'input',
            type: 'tuple',
            internalType: 'struct Asset',
            components: [
              {
                name: 'asset',
                type: 'address',
                internalType: 'address',
              },
              {
                name: 'value',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
          {
            name: 'output',
            type: 'tuple',
            internalType: 'struct Asset',
            components: [
              {
                name: 'asset',
                type: 'address',
                internalType: 'address',
              },
              {
                name: 'value',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
          {
            name: 'mode',
            type: 'uint8',
            internalType: 'enum Mode',
          },
          {
            name: 'salt',
            type: 'bytes32',
            internalType: 'bytes32',
          },
          {
            name: 'data',
            type: 'bytes',
            internalType: 'bytes',
          },
        ],
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint8',
        internalType: 'enum State',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'routes',
    inputs: [],
    outputs: [
      {
        name: 'depositRoutes',
        type: 'tuple[]',
        internalType: 'struct Route[]',
        components: [
          {
            name: 'input',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'output',
            type: 'address',
            internalType: 'address',
          },
        ],
      },
      {
        name: 'redeemRoutes',
        type: 'tuple[]',
        internalType: 'struct Route[]',
        components: [
          {
            name: 'input',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'output',
            type: 'address',
            internalType: 'address',
          },
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
          {
            name: 'asset',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'recipients',
            type: 'tuple[]',
            internalType: 'struct Interceptor.Recipient[]',
            components: [
              {
                name: 'target',
                type: 'address',
                internalType: 'address',
              },
              {
                name: 'shareBps',
                type: 'uint256',
                internalType: 'uint256',
              },
              {
                name: 'chainId',
                type: 'uint256',
                internalType: 'uint256',
              },
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
          {
            name: 'owner',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'receiver',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'input',
            type: 'tuple',
            internalType: 'struct Asset',
            components: [
              {
                name: 'asset',
                type: 'address',
                internalType: 'address',
              },
              {
                name: 'value',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
          {
            name: 'output',
            type: 'tuple',
            internalType: 'struct Asset',
            components: [
              {
                name: 'asset',
                type: 'address',
                internalType: 'address',
              },
              {
                name: 'value',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
          {
            name: 'mode',
            type: 'uint8',
            internalType: 'enum Mode',
          },
          {
            name: 'salt',
            type: 'bytes32',
            internalType: 'bytes32',
          },
          {
            name: 'data',
            type: 'bytes',
            internalType: 'bytes',
          },
        ],
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint8',
        internalType: 'enum State',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'symbol',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'string',
        internalType: 'string',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'totalAssets',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'totalSupply',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'transfer',
    inputs: [
      {
        name: 'to',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'value',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'transferFrom',
    inputs: [
      {
        name: 'from',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'to',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'value',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
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
          {
            name: 'owner',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'receiver',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'input',
            type: 'tuple',
            internalType: 'struct Asset',
            components: [
              {
                name: 'asset',
                type: 'address',
                internalType: 'address',
              },
              {
                name: 'value',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
          {
            name: 'output',
            type: 'tuple',
            internalType: 'struct Asset',
            components: [
              {
                name: 'asset',
                type: 'address',
                internalType: 'address',
              },
              {
                name: 'value',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
          {
            name: 'mode',
            type: 'uint8',
            internalType: 'enum Mode',
          },
          {
            name: 'salt',
            type: 'bytes32',
            internalType: 'bytes32',
          },
          {
            name: 'data',
            type: 'bytes',
            internalType: 'bytes',
          },
        ],
      },
    ],
    outputs: [
      {
        name: 'newState',
        type: 'uint8',
        internalType: 'enum State',
      },
      {
        name: 'paidAsset',
        type: 'tuple',
        internalType: 'struct Asset',
        components: [
          {
            name: 'asset',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'value',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'AccessControlInitialized',
    inputs: [
      {
        name: 'accessControl',
        type: 'address',
        indexed: false,
        internalType: 'contract ExternalAccessControl',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Approval',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'spender',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'value',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'AssetHint',
    inputs: [
      {
        name: 'queryId',
        type: 'bytes32',
        indexed: false,
        internalType: 'Id',
      },
      {
        name: 'targetState',
        type: 'uint8',
        indexed: false,
        internalType: 'enum State',
      },
      {
        name: 'asset_',
        type: 'tuple',
        indexed: false,
        internalType: 'struct Asset',
        components: [
          {
            name: 'asset',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'value',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
      },
      {
        name: 'accuracy',
        type: 'uint8',
        indexed: false,
        internalType: 'enum BaseVehicleEvents.HintAccuracy',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'AssetInitialized',
    inputs: [
      {
        name: 'asset',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'decimals',
        type: 'uint8',
        indexed: false,
        internalType: 'uint8',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'DeployerInitialized',
    inputs: [
      {
        name: 'deployer',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Enabled',
    inputs: [],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'FeeManagerInitialized',
    inputs: [
      {
        name: 'feeManager',
        type: 'address',
        indexed: false,
        internalType: 'contract FeeManager',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'ForbiddenAddressesInitialized',
    inputs: [
      {
        name: 'forbiddenAddresses',
        type: 'address[]',
        indexed: false,
        internalType: 'address[]',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Initialized',
    inputs: [
      {
        name: 'version',
        type: 'uint64',
        indexed: false,
        internalType: 'uint64',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'ModuleExecuted',
    inputs: [
      {
        name: 'module',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'data',
        type: 'bytes',
        indexed: false,
        internalType: 'bytes',
      },
      {
        name: 'value',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'ModulesManagerInitialized',
    inputs: [
      {
        name: 'modulesManager',
        type: 'address',
        indexed: false,
        internalType: 'contract ModulesManager',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'MorphoBlueVehicleInitialized',
    inputs: [],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'MorphoMarketInitialized',
    inputs: [
      {
        name: 'morphoMarketId',
        type: 'bytes32',
        indexed: false,
        internalType: 'Id',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'NameInitialized',
    inputs: [
      {
        name: 'name',
        type: 'string',
        indexed: false,
        internalType: 'string',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Pulled',
    inputs: [
      {
        name: 'asset',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'amount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'from',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'queryId',
        type: 'bytes32',
        indexed: false,
        internalType: 'Id',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Pushed',
    inputs: [
      {
        name: 'asset',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'amount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'to',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'queryId',
        type: 'bytes32',
        indexed: false,
        internalType: 'Id',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'RegistryInitialized',
    inputs: [
      {
        name: 'registry',
        type: 'address',
        indexed: true,
        internalType: 'contract IQueryRegistry',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'SetInterceptions',
    inputs: [
      {
        name: 'interceptions',
        type: 'tuple[]',
        indexed: false,
        internalType: 'struct Interceptor.Interception[]',
        components: [
          {
            name: 'asset',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'recipients',
            type: 'tuple[]',
            internalType: 'struct Interceptor.Recipient[]',
            components: [
              {
                name: 'target',
                type: 'address',
                internalType: 'address',
              },
              {
                name: 'shareBps',
                type: 'uint256',
                internalType: 'uint256',
              },
              {
                name: 'chainId',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
        ],
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'SymbolInitialized',
    inputs: [
      {
        name: 'symbol',
        type: 'string',
        indexed: false,
        internalType: 'string',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'TimeHint',
    inputs: [
      {
        name: 'queryId',
        type: 'bytes32',
        indexed: false,
        internalType: 'Id',
      },
      {
        name: 'targetState',
        type: 'uint8',
        indexed: false,
        internalType: 'enum State',
      },
      {
        name: 'timestamp',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'accuracy',
        type: 'uint8',
        indexed: false,
        internalType: 'enum BaseVehicleEvents.HintAccuracy',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Transfer',
    inputs: [
      {
        name: 'from',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'to',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'value',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'error',
    name: 'AddressEmptyCode',
    inputs: [
      {
        name: 'target',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'DisabledVehicle',
    inputs: [],
  },
  {
    type: 'error',
    name: 'ERC20InsufficientAllowance',
    inputs: [
      {
        name: 'spender',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'allowance',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'needed',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'ERC20InsufficientBalance',
    inputs: [
      {
        name: 'sender',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'balance',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'needed',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'ERC20InvalidApprover',
    inputs: [
      {
        name: 'approver',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'ERC20InvalidReceiver',
    inputs: [
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'ERC20InvalidSender',
    inputs: [
      {
        name: 'sender',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'ERC20InvalidSpender',
    inputs: [
      {
        name: 'spender',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'FailedCall',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InterceptionSharesTooHigh',
    inputs: [
      {
        name: 'asset',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'InvalidCaller',
    inputs: [
      {
        name: 'expected',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'actual',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'InvalidContract',
    inputs: [
      {
        name: 'contractAddress',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'InvalidInitialization',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidRecipient',
    inputs: [
      {
        name: 'forbiddenAddress',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'InvalidState',
    inputs: [
      {
        name: 'expected',
        type: 'uint8',
        internalType: 'enum State',
      },
      {
        name: 'actual',
        type: 'uint8',
        internalType: 'enum State',
      },
    ],
  },
  {
    type: 'error',
    name: 'MarketDoesNotExist',
    inputs: [
      {
        name: 'marketId',
        type: 'bytes32',
        internalType: 'Id',
      },
    ],
  },
  {
    type: 'error',
    name: 'MaxDepositTooLow',
    inputs: [
      {
        name: 'input',
        type: 'tuple',
        internalType: 'struct Asset',
        components: [
          {
            name: 'asset',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'value',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
      },
      {
        name: 'maxDeposit',
        type: 'tuple',
        internalType: 'struct Asset',
        components: [
          {
            name: 'asset',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'value',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
      },
    ],
  },
  {
    type: 'error',
    name: 'MaxRedeemTooLow',
    inputs: [
      {
        name: 'input',
        type: 'tuple',
        internalType: 'struct Asset',
        components: [
          {
            name: 'asset',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'value',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
      },
      {
        name: 'maxRedeem',
        type: 'tuple',
        internalType: 'struct Asset',
        components: [
          {
            name: 'asset',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'value',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
      },
    ],
  },
  {
    type: 'error',
    name: 'MissingAccessControl',
    inputs: [],
  },
  {
    type: 'error',
    name: 'MissingFacet',
    inputs: [],
  },
  {
    type: 'error',
    name: 'MissingModulesManager',
    inputs: [],
  },
  {
    type: 'error',
    name: 'MissingRole',
    inputs: [
      {
        name: 'role',
        type: 'bytes32',
        internalType: 'bytes32',
      },
      {
        name: 'scope',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'caller',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'ModuleNotAllowed',
    inputs: [
      {
        name: 'module',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'ModuleNotFound',
    inputs: [
      {
        name: 'module',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'NotInitializing',
    inputs: [],
  },
  {
    type: 'error',
    name: 'ReentrancyGuardReentrantCall',
    inputs: [],
  },
  {
    type: 'error',
    name: 'SafeERC20FailedOperation',
    inputs: [
      {
        name: 'token',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'StateUnchanged',
    inputs: [],
  },
  {
    type: 'error',
    name: 'Unimplemented',
    inputs: [],
  },
  {
    type: 'error',
    name: 'UninitializedFeeManager',
    inputs: [],
  },
  {
    type: 'error',
    name: 'ZeroAddress',
    inputs: [],
  },
  {
    type: 'error',
    name: 'ZeroTotalAssets',
    inputs: [],
  },
  {
    type: 'error',
    name: 'ZeroValue',
    inputs: [],
  },
] as const
