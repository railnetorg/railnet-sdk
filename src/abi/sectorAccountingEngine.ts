export const sectorAccountingEngineAbi = [
  {
    type: 'constructor',
    inputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'activeVehicles',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address[]',
        internalType: 'contract IVehicle[]',
      },
    ],
    stateMutability: 'view',
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
        name: 'params',
        type: 'tuple',
        internalType: 'struct ISectorAccountingEngine.DispatchParams',
        components: [
          {
            name: 'vehicle',
            type: 'address',
            internalType: 'contract IVehicle',
          },
          {
            name: 'mode',
            type: 'uint8',
            internalType: 'enum Mode',
          },
          {
            name: 'amount',
            type: 'uint256',
            internalType: 'uint256',
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
          {
            name: 'operationId',
            type: 'bytes32',
            internalType: 'bytes32',
          },
        ],
      },
    ],
    outputs: [
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
        name: 'dispatchState',
        type: 'uint8',
        internalType: 'enum State',
      },
    ],
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
        internalType: 'contract IVehicle',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct VehicleManagerStore.VehicleConfig',
        components: [
          {
            name: 'mode',
            type: 'uint8',
            internalType: 'enum VehicleManagerStore.VehicleMode',
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
        name: 'vehicleManager_',
        type: 'address',
        internalType: 'contract IVehicleManager',
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
        internalType: 'contract IVehicle',
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
        internalType: 'contract IVehicle',
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
        internalType: 'contract IVehicle',
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
    name: 'maxRedeemable',
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
    name: 'move',
    inputs: [
      {
        name: 'params',
        type: 'tuple',
        internalType: 'struct ISectorAccountingEngine.MoveParams',
        components: [
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
            name: 'asset',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'amount',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'operationId',
            type: 'bytes32',
            internalType: 'bytes32',
          },
        ],
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
    name: 'removeFromSector',
    inputs: [
      {
        name: 'target',
        type: 'bytes32',
        internalType: 'Sector',
      },
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
        internalType: 'contract IVehicle',
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
    name: 'vehicleEstimatedShares',
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
    name: 'vehicleHoldings',
    inputs: [
      {
        name: 'vehicle',
        type: 'address',
        internalType: 'contract IVehicle',
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
    name: 'vehicleManager',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract IVehicleManager',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'vehicleSettledShares',
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
    name: 'DepositPartiallyAllocated',
    inputs: [
      {
        name: 'totalAmount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'allocatedAmount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'residualIdle',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'DispatchSkipped',
    inputs: [
      {
        name: 'vehicle',
        type: 'address',
        indexed: true,
        internalType: 'contract IVehicle',
      },
      {
        name: 'mode',
        type: 'uint8',
        indexed: false,
        internalType: 'enum Mode',
      },
      {
        name: 'stagedAmount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'reason',
        type: 'uint8',
        indexed: false,
        internalType: 'enum SectorAccountingEngine.SkipReason',
      },
      {
        name: 'operationId',
        type: 'bytes32',
        indexed: false,
        internalType: 'bytes32',
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
        internalType: 'contract IVehicle',
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
        name: 'queryState',
        type: 'uint8',
        indexed: false,
        internalType: 'enum State',
      },
      {
        name: 'operationId',
        type: 'bytes32',
        indexed: false,
        internalType: 'bytes32',
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
    name: 'LimitedDeposit',
    inputs: [
      {
        name: 'vehicle',
        type: 'address',
        indexed: true,
        internalType: 'contract IVehicle',
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
      {
        name: 'maxDeposit',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'operationId',
        type: 'bytes32',
        indexed: false,
        internalType: 'bytes32',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'LimitedRedeem',
    inputs: [
      {
        name: 'vehicle',
        type: 'address',
        indexed: true,
        internalType: 'contract IVehicle',
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
        name: 'maxRedeem',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'operationId',
        type: 'bytes32',
        indexed: false,
        internalType: 'bytes32',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Moved',
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
      {
        name: 'operationId',
        type: 'bytes32',
        indexed: false,
        internalType: 'bytes32',
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
    name: 'RequestWithdrawableShortfall',
    inputs: [
      {
        name: 'requestedAmount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'plannedUnallocation',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'manualShortfall',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
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
        indexed: true,
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
        indexed: true,
        internalType: 'contract ISubQueryEngine',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'VehicleManagerInitialized',
    inputs: [
      {
        name: 'vehicleManager',
        type: 'address',
        indexed: true,
        internalType: 'contract IVehicleManager',
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
        internalType: 'contract IVehicle',
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
    name: 'DepositLimitedByCap',
    inputs: [
      {
        name: 'vehicle',
        type: 'address',
        internalType: 'contract IVehicle',
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
    name: 'DispatchDepositAmountTooHigh',
    inputs: [
      {
        name: 'vehicle',
        type: 'address',
        internalType: 'contract IVehicle',
      },
      {
        name: 'requestedAmount',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'sectorBalance',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'maxDeposit',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'cap',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'DispatchRedeemAmountTooHigh',
    inputs: [
      {
        name: 'vehicle',
        type: 'address',
        internalType: 'contract IVehicle',
      },
      {
        name: 'requestedAmount',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'sectorBalance',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'maxRedeem',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'EmptyStrictDispatch',
    inputs: [
      {
        name: 'vehicle',
        type: 'address',
        internalType: 'contract IVehicle',
      },
      {
        name: 'mode',
        type: 'uint8',
        internalType: 'enum Mode',
      },
      {
        name: 'requestedAmount',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'sectorBalance',
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
    name: 'InvalidVehicle',
    inputs: [
      {
        name: 'vehicle',
        type: 'address',
        internalType: 'contract IVehicle',
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
    name: 'MinOutputRequiresPinnedAmount',
    inputs: [
      {
        name: 'vehicle',
        type: 'address',
        internalType: 'contract IVehicle',
      },
      {
        name: 'minOutput',
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
    name: 'OnlyMultiVehicleOrManager',
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
    name: 'UnauthorizedVehicle',
    inputs: [
      {
        name: 'vehicle',
        type: 'address',
        internalType: 'contract IVehicle',
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
    name: 'ZeroBalance',
    inputs: [
      {
        name: 'sector',
        type: 'bytes32',
        internalType: 'Sector',
      },
      {
        name: 'asset',
        type: 'address',
        internalType: 'address',
      },
    ],
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
