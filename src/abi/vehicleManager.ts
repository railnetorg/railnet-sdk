export const vehicleManagerAbi = [
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
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'authorize',
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
    name: 'authorizeAndConfigure',
    inputs: [
      {
        name: 'vehicle',
        type: 'address',
        internalType: 'contract IVehicle',
      },
      {
        name: 'config',
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
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'configure',
    inputs: [
      {
        name: 'vehicle',
        type: 'address',
        internalType: 'contract IVehicle',
      },
      {
        name: 'config',
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
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'exitSupplies',
    inputs: [],
    outputs: [
      {
        name: 'withdrawableAssets',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'sharesDemand',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'convertedAssetDemand',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'feedQueryRedeemQueue',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getAuthorizedVehicles',
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
    name: 'getConfig',
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
        name: 'multiVehicle_',
        type: 'address',
        internalType: 'contract IBaseVehicle',
      },
      {
        name: 'asset_',
        type: 'address',
        internalType: 'contract IERC20',
      },
      {
        name: 'accountingEngine_',
        type: 'address',
        internalType: 'contract ISectorAccountingEngine',
      },
      {
        name: 'redeemQueue_',
        type: 'address',
        internalType: 'contract IQueryRedeemQueue',
      },
      {
        name: 'queueStrategyEngine_',
        type: 'address',
        internalType: 'contract IQueueStrategyEngine',
      },
      {
        name: 'subQueryEngine_',
        type: 'address',
        internalType: 'contract ISubQueryEngine',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'isAuthorized',
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
    name: 'maxTotalAssets',
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
    name: 'multiVehicle',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract IVehicle',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'queueStrategyEngine',
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
    name: 'redeemQueue',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract IQueryRedeemQueue',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'retrieveQueryRedeemQueueAssets',
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
    name: 'setMaxTotalAssets',
    inputs: [
      {
        name: 'newMaxTotalAssets',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setThresholds',
    inputs: [
      {
        name: 'newThresholds',
        type: 'tuple',
        internalType: 'struct MultiVehicleStructs.Thresholds',
        components: [
          {
            name: 'minSharesForAutoFulfill',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'extraAssetsForWithdrawalRequests',
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
    name: 'thresholds',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct MultiVehicleStructs.Thresholds',
        components: [
          {
            name: 'minSharesForAutoFulfill',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'extraAssetsForWithdrawalRequests',
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
    name: 'unauthorize',
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
    name: 'MaxTotalAssetsUpdated',
    inputs: [
      {
        name: 'newMaxTotalAssets',
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
    inputs: [],
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
    name: 'RedeemQueueInitialized',
    inputs: [
      {
        name: 'redeemQueue',
        type: 'address',
        indexed: true,
        internalType: 'contract IQueryRedeemQueue',
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
    name: 'ThresholdsSet',
    inputs: [
      {
        name: 'oldThresholds',
        type: 'tuple',
        indexed: false,
        internalType: 'struct MultiVehicleStructs.Thresholds',
        components: [
          {
            name: 'minSharesForAutoFulfill',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'extraAssetsForWithdrawalRequests',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
      },
      {
        name: 'newThresholds',
        type: 'tuple',
        indexed: false,
        internalType: 'struct MultiVehicleStructs.Thresholds',
        components: [
          {
            name: 'minSharesForAutoFulfill',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'extraAssetsForWithdrawalRequests',
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
    name: 'UpdatedVehicleStatus',
    inputs: [
      {
        name: 'vehicle',
        type: 'address',
        indexed: true,
        internalType: 'contract IVehicle',
      },
      {
        name: 'authorized',
        type: 'bool',
        indexed: false,
        internalType: 'bool',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'VehicleConfigured',
    inputs: [
      {
        name: 'vehicle',
        type: 'address',
        indexed: true,
        internalType: 'contract IVehicle',
      },
      {
        name: 'config',
        type: 'tuple',
        indexed: false,
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
    type: 'error',
    name: 'CannotAuthorizeMultiVehicle',
    inputs: [],
  },
  {
    type: 'error',
    name: 'CyclicalDependencyDetected',
    inputs: [],
  },
  {
    type: 'error',
    name: 'ExtraAssetsForWithdrawalRequestsTooHigh',
    inputs: [
      {
        name: 'value',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'max',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
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
  },
  {
    type: 'error',
    name: 'InvalidInitialization',
    inputs: [],
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
    name: 'MaxTotalAssetsExceeded',
    inputs: [
      {
        name: 'cap',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'actual',
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
    name: 'NothingToFulfill',
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
    name: 'VehicleAlreadyAuthorized',
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
    name: 'VehicleNotAuthorized',
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
    name: 'VehicleNotReady',
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
    name: 'ZeroTotalAssets',
    inputs: [],
  },
] as const
