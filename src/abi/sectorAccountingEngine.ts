export const sectorAccountingEngineAbi = [
  {
    type: 'constructor',
    inputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'addToSector',
    inputs: [
      {
        name: 'target',
        type: 'bytes32',
        internalType: 'Sector',
      },
      {
        name: 'assets',
        type: 'tuple[]',
        internalType: 'struct Asset[]',
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
    outputs: [],
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
    name: 'assetDecimals',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint8',
        internalType: 'uint8',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'deposit',
    inputs: [
      {
        name: 'amount',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'allocate',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'dispatch',
    inputs: [
      {
        name: 'vehicle',
        type: 'address',
        internalType: 'contract IBaseVehicle',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'dispatch',
    inputs: [
      {
        name: 'vehicle',
        type: 'address',
        internalType: 'contract IBaseVehicle',
      },
      {
        name: 'depositParams',
        type: 'tuple',
        internalType: 'struct ISectorAccountingEngine.DispatchParams',
        components: [
          {
            name: 'minOutput',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'data',
            type: 'bytes',
            internalType: 'bytes',
          },
        ],
      },
      {
        name: 'redeemParams',
        type: 'tuple',
        internalType: 'struct ISectorAccountingEngine.DispatchParams',
        components: [
          {
            name: 'minOutput',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'data',
            type: 'bytes',
            internalType: 'bytes',
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getSectorBalance',
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
    name: 'getVehicleConfig',
    inputs: [
      {
        name: 'vehicle',
        type: 'address',
        internalType: 'contract IBaseVehicle',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct VehicleRegistry.VehicleConfig',
        components: [
          {
            name: 'mode',
            type: 'uint8',
            internalType: 'enum VehicleRegistry.VehicleMode',
          },
          {
            name: 'cap',
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
    name: 'initialize',
    inputs: [
      {
        name: 'owner_',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'asset_',
        type: 'address',
        internalType: 'contract IERC20',
      },
      {
        name: 'strategyEngine_',
        type: 'address',
        internalType: 'contract IQueueStrategyEngine',
      },
      {
        name: 'multiVehicle_',
        type: 'address',
        internalType: 'contract IBaseVehicle',
      },
      {
        name: 'subQueryEngine_',
        type: 'address',
        internalType: 'contract ISubQueryEngine',
      },
      {
        name: 'vehicleRegistry_',
        type: 'address',
        internalType: 'contract IVehicleRegistry',
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
    name: 'isAuthorizedVehicle',
    inputs: [
      {
        name: 'vehicle',
        type: 'address',
        internalType: 'contract IBaseVehicle',
      },
    ],
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
    name: 'isVehicleActive',
    inputs: [
      {
        name: 'vehicle',
        type: 'address',
        internalType: 'contract IBaseVehicle',
      },
    ],
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
    name: 'isVehicleTaggedActive',
    inputs: [
      {
        name: 'vehicle',
        type: 'address',
        internalType: 'contract IBaseVehicle',
      },
    ],
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
    name: 'maxDepositable',
    inputs: [
      {
        name: 'vehicle',
        type: 'address',
        internalType: 'contract IBaseVehicle',
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
    name: 'maxRedeemable',
    inputs: [
      {
        name: 'vehicle',
        type: 'address',
        internalType: 'contract IBaseVehicle',
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
    name: 'moveAssets',
    inputs: [
      {
        name: 'from',
        type: 'bytes32',
        internalType: 'Sector',
      },
      {
        name: 'to',
        type: 'bytes32',
        internalType: 'Sector',
      },
      {
        name: 'amount',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'moveFromSector',
    inputs: [
      {
        name: 'origin',
        type: 'bytes32',
        internalType: 'Sector',
      },
      {
        name: 'target',
        type: 'bytes32',
        internalType: 'Sector',
      },
      {
        name: 'assets',
        type: 'tuple[]',
        internalType: 'struct Asset[]',
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
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'moveShares',
    inputs: [
      {
        name: 'from',
        type: 'bytes32',
        internalType: 'Sector',
      },
      {
        name: 'to',
        type: 'bytes32',
        internalType: 'Sector',
      },
      {
        name: 'vehicle',
        type: 'address',
        internalType: 'contract IBaseVehicle',
      },
      {
        name: 'amount',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
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
    name: 'rebalance',
    inputs: [
      {
        name: 'from',
        type: 'address',
        internalType: 'contract IBaseVehicle',
      },
      {
        name: 'to',
        type: 'address',
        internalType: 'contract IBaseVehicle',
      },
      {
        name: 'amount',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'rebalance',
    inputs: [
      {
        name: 'from',
        type: 'address',
        internalType: 'contract IBaseVehicle',
      },
      {
        name: 'to',
        type: 'address',
        internalType: 'contract IBaseVehicle',
      },
      {
        name: 'amount',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'redeemParams',
        type: 'tuple',
        internalType: 'struct ISectorAccountingEngine.DispatchParams',
        components: [
          {
            name: 'minOutput',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'data',
            type: 'bytes',
            internalType: 'bytes',
          },
        ],
      },
      {
        name: 'depositParams',
        type: 'tuple',
        internalType: 'struct ISectorAccountingEngine.DispatchParams',
        components: [
          {
            name: 'minOutput',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'data',
            type: 'bytes',
            internalType: 'bytes',
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'removeFromSector',
    inputs: [
      {
        name: 'target',
        type: 'bytes32',
        internalType: 'Sector',
      },
      {
        name: 'assets',
        type: 'tuple[]',
        internalType: 'struct Asset[]',
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
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'requestWithdrawable',
    inputs: [
      {
        name: 'amount',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'strategyEngine',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract IQueueStrategyEngine',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'subQueryEngine',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract ISubQueryEngine',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'syncVehicleActivationStatus',
    inputs: [
      {
        name: 'vehicle',
        type: 'address',
        internalType: 'contract IBaseVehicle',
      },
      {
        name: 'active',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'totalAssets',
    inputs: [],
    outputs: [
      {
        name: 'total',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'vehicleHoldings',
    inputs: [
      {
        name: 'vehicle',
        type: 'address',
        internalType: 'contract IBaseVehicle',
      },
    ],
    outputs: [
      {
        name: 'sharesAfterUnlocks',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'sharesBeforeCreates',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'expectedSharesAfterUnlocks',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'expectedAssetsAfterUnlocks',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'assetsBeforeCreates',
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
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'withdrawable',
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
    type: 'event',
    name: 'DepositLimitedByCap',
    inputs: [
      {
        name: 'vehicle',
        type: 'address',
        indexed: true,
        internalType: 'contract IBaseVehicle',
      },
      {
        name: 'requestedAmount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'actualAmount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'cap',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Dispatched',
    inputs: [
      {
        name: 'vehicle',
        type: 'address',
        indexed: true,
        internalType: 'contract IBaseVehicle',
      },
      {
        name: 'settledDestination',
        type: 'bytes32',
        indexed: true,
        internalType: 'Sector',
      },
      {
        name: 'rejectedDestination',
        type: 'bytes32',
        indexed: true,
        internalType: 'Sector',
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
            type: 'tuple[]',
            internalType: 'struct Asset[]',
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
            type: 'tuple[]',
            internalType: 'struct Asset[]',
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
        name: 'queryState',
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
    name: 'MovedAssets',
    inputs: [
      {
        name: 'from',
        type: 'bytes32',
        indexed: true,
        internalType: 'Sector',
      },
      {
        name: 'to',
        type: 'bytes32',
        indexed: true,
        internalType: 'Sector',
      },
      {
        name: 'amount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'asset',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'MovedShares',
    inputs: [
      {
        name: 'from',
        type: 'bytes32',
        indexed: true,
        internalType: 'Sector',
      },
      {
        name: 'to',
        type: 'bytes32',
        indexed: true,
        internalType: 'Sector',
      },
      {
        name: 'vehicle',
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
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'MultiVehicleInitialized',
    inputs: [
      {
        name: 'multiVehicle',
        type: 'address',
        indexed: false,
        internalType: 'contract IBaseVehicle',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'OwnerInitialized',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Rebalanced',
    inputs: [
      {
        name: 'from',
        type: 'address',
        indexed: true,
        internalType: 'contract IBaseVehicle',
      },
      {
        name: 'to',
        type: 'address',
        indexed: true,
        internalType: 'contract IBaseVehicle',
      },
      {
        name: 'amount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'redeemQuery',
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
            type: 'tuple[]',
            internalType: 'struct Asset[]',
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
            type: 'tuple[]',
            internalType: 'struct Asset[]',
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
        name: 'redeemQueryState',
        type: 'uint8',
        indexed: false,
        internalType: 'enum State',
      },
      {
        name: 'depositQuery',
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
            type: 'tuple[]',
            internalType: 'struct Asset[]',
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
            type: 'tuple[]',
            internalType: 'struct Asset[]',
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
        name: 'depositQueryState',
        type: 'uint8',
        indexed: false,
        internalType: 'enum State',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'SectorTransfer',
    inputs: [
      {
        name: 'from',
        type: 'bytes32',
        indexed: true,
        internalType: 'Sector',
      },
      {
        name: 'to',
        type: 'bytes32',
        indexed: true,
        internalType: 'Sector',
      },
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
    name: 'StrategyEngineInitialized',
    inputs: [
      {
        name: 'strategyEngine',
        type: 'address',
        indexed: false,
        internalType: 'contract IQueueStrategyEngine',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'SubQueryEngineInitialized',
    inputs: [
      {
        name: 'subQueryEngine',
        type: 'address',
        indexed: false,
        internalType: 'contract ISubQueryEngine',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'VehicleStatusUpdated',
    inputs: [
      {
        name: 'vehicle',
        type: 'address',
        indexed: true,
        internalType: 'contract IBaseVehicle',
      },
      {
        name: 'active',
        type: 'bool',
        indexed: false,
        internalType: 'bool',
      },
    ],
    anonymous: false,
  },
  {
    type: 'error',
    name: 'AccountingError',
    inputs: [
      {
        name: 'asset',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'expectedBalance',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'actualBalance',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'AccountingOverflow',
    inputs: [
      {
        name: 'sector',
        type: 'bytes32',
        internalType: 'Sector',
      },
      {
        name: 'asset',
        type: 'address',
        internalType: 'contract IERC20',
      },
      {
        name: 'currentValue',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'incrementValue',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'AccountingUnderflow',
    inputs: [
      {
        name: 'sector',
        type: 'bytes32',
        internalType: 'Sector',
      },
      {
        name: 'asset',
        type: 'address',
        internalType: 'contract IERC20',
      },
      {
        name: 'currentValue',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'decrementValue',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
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
    name: 'AmountTooHigh',
    inputs: [
      {
        name: 'asset',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'requiredAmount',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'availableAmount',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'CapExceeded',
    inputs: [
      {
        name: 'vehicle',
        type: 'address',
        internalType: 'contract IBaseVehicle',
      },
      {
        name: 'cap',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'currentHoldings',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'attemptedAmount',
        type: 'uint256',
        internalType: 'uint256',
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
    name: 'IncompatibleVehicle',
    inputs: [
      {
        name: 'vehicleAsset',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'depositRoutes',
        type: 'tuple[]',
        internalType: 'struct Route[]',
        components: [
          {
            name: 'input',
            type: 'address[]',
            internalType: 'address[]',
          },
          {
            name: 'output',
            type: 'address[]',
            internalType: 'address[]',
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
            type: 'address[]',
            internalType: 'address[]',
          },
          {
            name: 'output',
            type: 'address[]',
            internalType: 'address[]',
          },
        ],
      },
    ],
  },
  {
    type: 'error',
    name: 'IneffectiveMove',
    inputs: [
      {
        name: 'from',
        type: 'bytes32',
        internalType: 'Sector',
      },
      {
        name: 'to',
        type: 'bytes32',
        internalType: 'Sector',
      },
    ],
  },
  {
    type: 'error',
    name: 'IneffectiveRebalance',
    inputs: [
      {
        name: 'from',
        type: 'address',
        internalType: 'contract IBaseVehicle',
      },
      {
        name: 'to',
        type: 'address',
        internalType: 'contract IBaseVehicle',
      },
    ],
  },
  {
    type: 'error',
    name: 'InvalidConvertedAssets',
    inputs: [
      {
        name: 'invalidAssets',
        type: 'tuple[]',
        internalType: 'struct Asset[]',
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
    name: 'InvalidEstimatedAssets',
    inputs: [
      {
        name: 'invalidAssets',
        type: 'tuple[]',
        internalType: 'struct Asset[]',
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
    name: 'InvalidPendingVehicleSector',
    inputs: [
      {
        name: 'sector',
        type: 'bytes32',
        internalType: 'Sector',
      },
      {
        name: 'source',
        type: 'bool',
        internalType: 'bool',
      },
    ],
  },
  {
    type: 'error',
    name: 'InvalidQuerySector',
    inputs: [
      {
        name: 'sector',
        type: 'bytes32',
        internalType: 'Sector',
      },
      {
        name: 'source',
        type: 'bool',
        internalType: 'bool',
      },
    ],
  },
  {
    type: 'error',
    name: 'InvalidSector',
    inputs: [
      {
        name: 'sector',
        type: 'bytes32',
        internalType: 'Sector',
      },
      {
        name: 'source',
        type: 'bool',
        internalType: 'bool',
      },
    ],
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
    name: 'InvalidStaticSector',
    inputs: [
      {
        name: 'sector',
        type: 'bytes32',
        internalType: 'Sector',
      },
      {
        name: 'source',
        type: 'bool',
        internalType: 'bool',
      },
    ],
  },
  {
    type: 'error',
    name: 'InvalidValue',
    inputs: [
      {
        name: 'value',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'InvalidVehicle',
    inputs: [
      {
        name: 'vehicle',
        type: 'address',
        internalType: 'contract IBaseVehicle',
      },
    ],
  },
  {
    type: 'error',
    name: 'InvalidVehicleSector',
    inputs: [
      {
        name: 'sector',
        type: 'bytes32',
        internalType: 'Sector',
      },
      {
        name: 'source',
        type: 'bool',
        internalType: 'bool',
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
    name: 'RebalanceQueryRejection',
    inputs: [
      {
        name: 'from',
        type: 'address',
        internalType: 'contract IBaseVehicle',
      },
      {
        name: 'to',
        type: 'address',
        internalType: 'contract IBaseVehicle',
      },
      {
        name: 'failingVehicle',
        type: 'address',
        internalType: 'contract IBaseVehicle',
      },
      {
        name: 'errorData',
        type: 'bytes',
        internalType: 'bytes',
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
