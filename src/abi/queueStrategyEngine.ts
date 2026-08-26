export const queueStrategyEngineAbi = [
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
    name: 'allocate',
    inputs: [
      {
        name: 'amount',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: 'allocations',
        type: 'tuple[]',
        internalType: 'struct IQueueStrategyEngine.Allocation[]',
        components: [
          {
            name: 'vehicle',
            type: 'address',
            internalType: 'contract IBaseVehicle',
          },
          {
            name: 'asset',
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
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'initialize',
    inputs: [
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
    name: 'queues',
    inputs: [],
    outputs: [
      {
        name: 'depositQueue',
        type: 'tuple[]',
        internalType: 'struct IQueueStrategyEngine.QueueEntry[]',
        components: [
          {
            name: 'vehicle',
            type: 'address',
            internalType: 'contract IBaseVehicle',
          },
          {
            name: 'target',
            type: 'tuple',
            internalType: 'struct Target',
            components: [
              {
                name: 'value',
                type: 'uint256',
                internalType: 'uint256',
              },
              {
                name: 'threshold',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
        ],
      },
      {
        name: 'redeemQueue',
        type: 'tuple[]',
        internalType: 'struct IQueueStrategyEngine.QueueEntry[]',
        components: [
          {
            name: 'vehicle',
            type: 'address',
            internalType: 'contract IBaseVehicle',
          },
          {
            name: 'target',
            type: 'tuple',
            internalType: 'struct Target',
            components: [
              {
                name: 'value',
                type: 'uint256',
                internalType: 'uint256',
              },
              {
                name: 'threshold',
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
    name: 'setQueues',
    inputs: [
      {
        name: 'depositQueue',
        type: 'tuple[]',
        internalType: 'struct IQueueStrategyEngine.QueueEntry[]',
        components: [
          {
            name: 'vehicle',
            type: 'address',
            internalType: 'contract IBaseVehicle',
          },
          {
            name: 'target',
            type: 'tuple',
            internalType: 'struct Target',
            components: [
              {
                name: 'value',
                type: 'uint256',
                internalType: 'uint256',
              },
              {
                name: 'threshold',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
        ],
      },
      {
        name: 'redeemQueue',
        type: 'tuple[]',
        internalType: 'struct IQueueStrategyEngine.QueueEntry[]',
        components: [
          {
            name: 'vehicle',
            type: 'address',
            internalType: 'contract IBaseVehicle',
          },
          {
            name: 'target',
            type: 'tuple',
            internalType: 'struct Target',
            components: [
              {
                name: 'value',
                type: 'uint256',
                internalType: 'uint256',
              },
              {
                name: 'threshold',
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
    name: 'unallocate',
    inputs: [
      {
        name: 'amount',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: 'unallocations',
        type: 'tuple[]',
        internalType: 'struct IQueueStrategyEngine.Allocation[]',
        components: [
          {
            name: 'vehicle',
            type: 'address',
            internalType: 'contract IBaseVehicle',
          },
          {
            name: 'asset',
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
        name: 'remainingAssets',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
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
    name: 'UpdatedQueues',
    inputs: [
      {
        name: 'depositQueue',
        type: 'tuple[]',
        indexed: false,
        internalType: 'struct IQueueStrategyEngine.QueueEntry[]',
        components: [
          {
            name: 'vehicle',
            type: 'address',
            internalType: 'contract IBaseVehicle',
          },
          {
            name: 'target',
            type: 'tuple',
            internalType: 'struct Target',
            components: [
              {
                name: 'value',
                type: 'uint256',
                internalType: 'uint256',
              },
              {
                name: 'threshold',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
        ],
      },
      {
        name: 'redeemQueue',
        type: 'tuple[]',
        indexed: false,
        internalType: 'struct IQueueStrategyEngine.QueueEntry[]',
        components: [
          {
            name: 'vehicle',
            type: 'address',
            internalType: 'contract IBaseVehicle',
          },
          {
            name: 'target',
            type: 'tuple',
            internalType: 'struct Target',
            components: [
              {
                name: 'value',
                type: 'uint256',
                internalType: 'uint256',
              },
              {
                name: 'threshold',
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
    type: 'error',
    name: 'InvalidEstimatedAsset',
    inputs: [
      {
        name: 'invalidAsset',
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
    name: 'InvalidInitialization',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidQueueEntry',
    inputs: [
      {
        name: 'index',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'vehicle',
        type: 'address',
        internalType: 'contract IBaseVehicle',
      },
      {
        name: 'reason',
        type: 'bytes32',
        internalType: 'bytes32',
      },
    ],
  },
  {
    type: 'error',
    name: 'InvalidTarget',
    inputs: [
      {
        name: 'value',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'threshold',
        type: 'uint256',
        internalType: 'uint256',
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
    name: 'ReentrancyGuardReentrantCall',
    inputs: [],
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
  {
    type: 'error',
    name: 'ZeroValue',
    inputs: [],
  },
] as const
