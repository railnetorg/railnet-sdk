export const subQueryEngineAbi = [
  {
    type: 'constructor',
    inputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'accountingEngine',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract ISectorAccountingEngine',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'asset',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract IERC20',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'createSubQuery',
    inputs: [
      {
        name: 'vehicle',
        type: 'address',
        internalType: 'contract IVehicle',
      },
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
      {
        name: 'settledSector',
        type: 'bytes32',
        internalType: 'Sector',
      },
      {
        name: 'rejectedSector',
        type: 'bytes32',
        internalType: 'Sector',
      },
    ],
    outputs: [
      {
        name: 'subQuery',
        type: 'tuple',
        internalType: 'struct SubQuery',
        components: [
          {
            name: 'vehicle',
            type: 'address',
            internalType: 'contract IVehicle',
          },
          {
            name: 'queryId',
            type: 'bytes32',
            internalType: 'Id',
          },
          {
            name: 'settledDestination',
            type: 'bytes32',
            internalType: 'Sector',
          },
          {
            name: 'rejectedDestination',
            type: 'bytes32',
            internalType: 'Sector',
          },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'inFlightQueries',
    inputs: [
      {
        name: 'vehicle',
        type: 'address',
        internalType: 'contract IVehicle',
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
    name: 'initialize',
    inputs: [
      {
        name: 'asset_',
        type: 'address',
        internalType: 'contract IERC20',
      },
      {
        name: 'multiVehicle_',
        type: 'address',
        internalType: 'contract IBaseVehicle',
      },
      {
        name: 'accountingEngine_',
        type: 'address',
        internalType: 'contract ISectorAccountingEngine',
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
    name: 'multiVehicle',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract IBaseVehicle',
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
    name: 'progressQuery',
    inputs: [
      {
        name: 'subQuery',
        type: 'tuple',
        internalType: 'struct SubQuery',
        components: [
          {
            name: 'vehicle',
            type: 'address',
            internalType: 'contract IVehicle',
          },
          {
            name: 'queryId',
            type: 'bytes32',
            internalType: 'Id',
          },
          {
            name: 'settledDestination',
            type: 'bytes32',
            internalType: 'Sector',
          },
          {
            name: 'rejectedDestination',
            type: 'bytes32',
            internalType: 'Sector',
          },
        ],
      },
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
        name: 'queryState',
        type: 'uint8',
        internalType: 'enum State',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'sectorEphemeralAccounting',
    inputs: [
      {
        name: 'sector',
        type: 'bytes32',
        internalType: 'Sector',
      },
      {
        name: 'asset_',
        type: 'address',
        internalType: 'contract IERC20',
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
    name: 'subQueryIndex',
    inputs: [
      {
        name: 'subQuery',
        type: 'tuple',
        internalType: 'struct SubQuery',
        components: [
          {
            name: 'vehicle',
            type: 'address',
            internalType: 'contract IVehicle',
          },
          {
            name: 'queryId',
            type: 'bytes32',
            internalType: 'Id',
          },
          {
            name: 'settledDestination',
            type: 'bytes32',
            internalType: 'Sector',
          },
          {
            name: 'rejectedDestination',
            type: 'bytes32',
            internalType: 'Sector',
          },
        ],
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint248',
        internalType: 'uint248',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'subQueryStatus',
    inputs: [
      {
        name: 'subQuery',
        type: 'tuple',
        internalType: 'struct SubQuery',
        components: [
          {
            name: 'vehicle',
            type: 'address',
            internalType: 'contract IVehicle',
          },
          {
            name: 'queryId',
            type: 'bytes32',
            internalType: 'Id',
          },
          {
            name: 'settledDestination',
            type: 'bytes32',
            internalType: 'Sector',
          },
          {
            name: 'rejectedDestination',
            type: 'bytes32',
            internalType: 'Sector',
          },
        ],
      },
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
        internalType: 'enum KeeperLib.JobStatus',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'vehicleEphemeralAccounting',
    inputs: [
      {
        name: 'vehicle',
        type: 'address',
        internalType: 'contract IVehicle',
      },
      {
        name: 'asset_',
        type: 'address',
        internalType: 'contract IERC20',
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
    name: 'withdraw',
    inputs: [
      {
        name: 'amount',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'recipient',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'AccountQuery',
    inputs: [
      {
        name: 'subQueryId',
        type: 'bytes32',
        indexed: true,
        internalType: 'Id',
      },
      {
        name: 'subQuery',
        type: 'tuple',
        indexed: false,
        internalType: 'struct SubQuery',
        components: [
          {
            name: 'vehicle',
            type: 'address',
            internalType: 'contract IVehicle',
          },
          {
            name: 'queryId',
            type: 'bytes32',
            internalType: 'Id',
          },
          {
            name: 'settledDestination',
            type: 'bytes32',
            internalType: 'Sector',
          },
          {
            name: 'rejectedDestination',
            type: 'bytes32',
            internalType: 'Sector',
          },
        ],
      },
      {
        name: 'query',
        type: 'tuple',
        indexed: false,
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
      {
        name: 'inputAsset',
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
        name: 'outputEstimation',
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
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'AccountingEngineInitialized',
    inputs: [
      {
        name: 'accountingEngine',
        type: 'address',
        indexed: true,
        internalType: 'contract ISectorAccountingEngine',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'BaseAssetInitialized',
    inputs: [
      {
        name: 'asset',
        type: 'address',
        indexed: true,
        internalType: 'contract IERC20',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'CreatedQuery',
    inputs: [
      {
        name: 'subQueryId',
        type: 'bytes32',
        indexed: true,
        internalType: 'Id',
      },
      {
        name: 'subQuery',
        type: 'tuple',
        indexed: false,
        internalType: 'struct SubQuery',
        components: [
          {
            name: 'vehicle',
            type: 'address',
            internalType: 'contract IVehicle',
          },
          {
            name: 'queryId',
            type: 'bytes32',
            internalType: 'Id',
          },
          {
            name: 'settledDestination',
            type: 'bytes32',
            internalType: 'Sector',
          },
          {
            name: 'rejectedDestination',
            type: 'bytes32',
            internalType: 'Sector',
          },
        ],
      },
      {
        name: 'subQueryIndex',
        type: 'uint248',
        indexed: true,
        internalType: 'uint248',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'FinalizedQuery',
    inputs: [
      {
        name: 'subQueryId',
        type: 'bytes32',
        indexed: true,
        internalType: 'Id',
      },
      {
        name: 'queryId',
        type: 'bytes32',
        indexed: false,
        internalType: 'Id',
      },
      {
        name: 'state',
        type: 'uint8',
        indexed: false,
        internalType: 'enum State',
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
    name: 'JobCancelled',
    inputs: [
      {
        name: 'jobId',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'caller',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'reason',
        type: 'bytes',
        indexed: false,
        internalType: 'bytes',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'JobDone',
    inputs: [
      {
        name: 'jobId',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'caller',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'JobStarted',
    inputs: [
      {
        name: 'jobId',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'statusTarget',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'statusCalldata',
        type: 'bytes',
        indexed: false,
        internalType: 'bytes',
      },
      {
        name: 'caller',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'execTarget',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'execCalldata',
        type: 'bytes',
        indexed: false,
        internalType: 'bytes',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'ParentMultiVehicleInitialized',
    inputs: [
      {
        name: 'multiVehicle',
        type: 'address',
        indexed: true,
        internalType: 'contract IBaseVehicle',
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
    name: 'UnaccountQuery',
    inputs: [
      {
        name: 'subQueryId',
        type: 'bytes32',
        indexed: true,
        internalType: 'Id',
      },
      {
        name: 'subQuery',
        type: 'tuple',
        indexed: false,
        internalType: 'struct SubQuery',
        components: [
          {
            name: 'vehicle',
            type: 'address',
            internalType: 'contract IVehicle',
          },
          {
            name: 'queryId',
            type: 'bytes32',
            internalType: 'Id',
          },
          {
            name: 'settledDestination',
            type: 'bytes32',
            internalType: 'Sector',
          },
          {
            name: 'rejectedDestination',
            type: 'bytes32',
            internalType: 'Sector',
          },
        ],
      },
      {
        name: 'query',
        type: 'tuple',
        indexed: false,
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
      {
        name: 'receivedAsset',
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
        name: 'updatedOutputEstimation',
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
        name: 'finalState',
        type: 'uint8',
        indexed: false,
        internalType: 'enum State',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Withdraw',
    inputs: [
      {
        name: 'caller',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'receiver',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'asset',
        type: 'address',
        indexed: true,
        internalType: 'contract IERC20',
      },
      {
        name: 'amount',
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
    name: 'DuplicateQuery',
    inputs: [
      {
        name: 'queryId',
        type: 'bytes32',
        internalType: 'Id',
      },
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
    name: 'InvalidInitialization',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidSectorConversion',
    inputs: [
      {
        name: 'sector',
        type: 'bytes32',
        internalType: 'Sector',
      },
    ],
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
    name: 'NotInitializing',
    inputs: [],
  },
  {
    type: 'error',
    name: 'QueryMismatch',
    inputs: [
      {
        name: 'expectedQueryId',
        type: 'bytes32',
        internalType: 'Id',
      },
      {
        name: 'actualQueryId',
        type: 'bytes32',
        internalType: 'Id',
      },
    ],
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
    name: 'SubQueryAlreadyFinalized',
    inputs: [
      {
        name: 'subQueryId',
        type: 'bytes32',
        internalType: 'Id',
      },
      {
        name: 'finalState',
        type: 'uint8',
        internalType: 'enum State',
      },
    ],
  },
  {
    type: 'error',
    name: 'Unauthorized',
    inputs: [
      {
        name: 'expectedCaller',
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
    name: 'UnknownSubQuery',
    inputs: [
      {
        name: 'subQueryId',
        type: 'bytes32',
        internalType: 'Id',
      },
    ],
  },
  {
    type: 'error',
    name: 'ZeroAddress',
    inputs: [],
  },
  {
    type: 'error',
    name: 'ZeroCode',
    inputs: [
      {
        name: 'invalidContract',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
] as const
