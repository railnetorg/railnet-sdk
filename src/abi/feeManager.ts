export const feeManagerAbi = [
  {
    type: 'constructor',
    inputs: [],
    stateMutability: 'nonpayable',
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
    name: 'applyFees',
    inputs: [
      {
        name: 'configId',
        type: 'bytes32',
        internalType: 'bytes32',
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
      {
        name: 'mode',
        type: 'uint8',
        internalType: 'enum Mode',
      },
    ],
    outputs: [
      {
        name: 'netAsset',
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
        name: 'feeAsset',
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
    name: 'cache',
    inputs: [
      {
        name: 'target',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct IFeeManager.Cache',
        components: [
          {
            name: 'lastTotalAssets',
            type: 'uint128',
            internalType: 'uint128',
          },
          {
            name: 'lastTimestamp',
            type: 'uint128',
            internalType: 'uint128',
          },
          {
            name: 'applicableConfigId',
            type: 'bytes32',
            internalType: 'bytes32',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'dispatchERC20',
    inputs: [
      {
        name: 'asset',
        type: 'address',
        internalType: 'contract IERC20',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'feeRecipients',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'tuple[]',
        internalType: 'struct IFeeManager.FeeRecipient[]',
        components: [
          {
            name: 'target',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'shareBps',
            type: 'uint32',
            internalType: 'uint32',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'fees',
    inputs: [],
    outputs: [
      {
        name: 'configId',
        type: 'bytes32',
        internalType: 'bytes32',
      },
      {
        name: '',
        type: 'tuple',
        internalType: 'struct IFeeManager.Fees',
        components: [
          {
            name: 'performanceFeeBps',
            type: 'uint32',
            internalType: 'uint32',
          },
          {
            name: 'managementFeeBps',
            type: 'uint32',
            internalType: 'uint32',
          },
          {
            name: 'depositFeeBps',
            type: 'uint32',
            internalType: 'uint32',
          },
          {
            name: 'redeemFeeBps',
            type: 'uint32',
            internalType: 'uint32',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'fees',
    inputs: [
      {
        name: 'configId',
        type: 'bytes32',
        internalType: 'bytes32',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct IFeeManager.Fees',
        components: [
          {
            name: 'performanceFeeBps',
            type: 'uint32',
            internalType: 'uint32',
          },
          {
            name: 'managementFeeBps',
            type: 'uint32',
            internalType: 'uint32',
          },
          {
            name: 'depositFeeBps',
            type: 'uint32',
            internalType: 'uint32',
          },
          {
            name: 'redeemFeeBps',
            type: 'uint32',
            internalType: 'uint32',
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
        name: 'params',
        type: 'tuple',
        internalType: 'struct FeeManager.InitParams',
        components: [
          {
            name: 'accessControl',
            type: 'address',
            internalType: 'contract ExternalAccessControl',
          },
          {
            name: 'initialFees',
            type: 'tuple',
            internalType: 'struct IFeeManager.Fees',
            components: [
              {
                name: 'performanceFeeBps',
                type: 'uint32',
                internalType: 'uint32',
              },
              {
                name: 'managementFeeBps',
                type: 'uint32',
                internalType: 'uint32',
              },
              {
                name: 'depositFeeBps',
                type: 'uint32',
                internalType: 'uint32',
              },
              {
                name: 'redeemFeeBps',
                type: 'uint32',
                internalType: 'uint32',
              },
            ],
          },
          {
            name: 'initialMaxFees',
            type: 'tuple',
            internalType: 'struct IFeeManager.Fees',
            components: [
              {
                name: 'performanceFeeBps',
                type: 'uint32',
                internalType: 'uint32',
              },
              {
                name: 'managementFeeBps',
                type: 'uint32',
                internalType: 'uint32',
              },
              {
                name: 'depositFeeBps',
                type: 'uint32',
                internalType: 'uint32',
              },
              {
                name: 'redeemFeeBps',
                type: 'uint32',
                internalType: 'uint32',
              },
            ],
          },
          {
            name: 'initialRecipients',
            type: 'tuple[]',
            internalType: 'struct IFeeManager.FeeRecipient[]',
            components: [
              {
                name: 'target',
                type: 'address',
                internalType: 'address',
              },
              {
                name: 'shareBps',
                type: 'uint32',
                internalType: 'uint32',
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
    name: 'maxFees',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct IFeeManager.Fees',
        components: [
          {
            name: 'performanceFeeBps',
            type: 'uint32',
            internalType: 'uint32',
          },
          {
            name: 'managementFeeBps',
            type: 'uint32',
            internalType: 'uint32',
          },
          {
            name: 'depositFeeBps',
            type: 'uint32',
            internalType: 'uint32',
          },
          {
            name: 'redeemFeeBps',
            type: 'uint32',
            internalType: 'uint32',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'onOperations',
    inputs: [
      {
        name: 'currentTotalSupply',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'currentTotalAssets',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'sharesDecimals',
        type: 'uint8',
        internalType: 'uint8',
      },
      {
        name: 'assetDecimals',
        type: 'uint8',
        internalType: 'uint8',
      },
    ],
    outputs: [
      {
        name: 'feeSharesToMint',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'onUpdate',
    inputs: [
      {
        name: 'currentTotalAssets',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'previewApplyTransactionalFees',
    inputs: [
      {
        name: 'configId',
        type: 'bytes32',
        internalType: 'bytes32',
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
      {
        name: 'mode',
        type: 'uint8',
        internalType: 'enum Mode',
      },
    ],
    outputs: [
      {
        name: 'netAsset',
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
        name: 'feeAsset',
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
    name: 'previewOnOperations',
    inputs: [
      {
        name: 'currentTotalSupply',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'currentTotalAssets',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'sharesDecimals',
        type: 'uint8',
        internalType: 'uint8',
      },
      {
        name: 'assetDecimals',
        type: 'uint8',
        internalType: 'uint8',
      },
    ],
    outputs: [
      {
        name: 'feeSharesToMint',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'reverseFees',
    inputs: [
      {
        name: 'configId',
        type: 'bytes32',
        internalType: 'bytes32',
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
      {
        name: 'mode',
        type: 'uint8',
        internalType: 'enum Mode',
      },
    ],
    outputs: [
      {
        name: 'grossAsset',
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
        name: 'feeAsset',
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
    name: 'setFeeRecipients',
    inputs: [
      {
        name: 'newRecipients',
        type: 'tuple[]',
        internalType: 'struct IFeeManager.FeeRecipient[]',
        components: [
          {
            name: 'target',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'shareBps',
            type: 'uint32',
            internalType: 'uint32',
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setFees',
    inputs: [
      {
        name: 'newFees',
        type: 'tuple',
        internalType: 'struct IFeeManager.Fees',
        components: [
          {
            name: 'performanceFeeBps',
            type: 'uint32',
            internalType: 'uint32',
          },
          {
            name: 'managementFeeBps',
            type: 'uint32',
            internalType: 'uint32',
          },
          {
            name: 'depositFeeBps',
            type: 'uint32',
            internalType: 'uint32',
          },
          {
            name: 'redeemFeeBps',
            type: 'uint32',
            internalType: 'uint32',
          },
        ],
      },
    ],
    outputs: [],
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
    name: 'Dispatched',
    inputs: [
      {
        name: 'recipient',
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
    type: 'event',
    name: 'FeesUpdated',
    inputs: [
      {
        name: 'configId',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'newFees',
        type: 'tuple',
        indexed: false,
        internalType: 'struct IFeeManager.Fees',
        components: [
          {
            name: 'performanceFeeBps',
            type: 'uint32',
            internalType: 'uint32',
          },
          {
            name: 'managementFeeBps',
            type: 'uint32',
            internalType: 'uint32',
          },
          {
            name: 'depositFeeBps',
            type: 'uint32',
            internalType: 'uint32',
          },
          {
            name: 'redeemFeeBps',
            type: 'uint32',
            internalType: 'uint32',
          },
        ],
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
    name: 'MaxFeesUpdated',
    inputs: [
      {
        name: 'newMaxFees',
        type: 'tuple',
        indexed: false,
        internalType: 'struct IFeeManager.Fees',
        components: [
          {
            name: 'performanceFeeBps',
            type: 'uint32',
            internalType: 'uint32',
          },
          {
            name: 'managementFeeBps',
            type: 'uint32',
            internalType: 'uint32',
          },
          {
            name: 'depositFeeBps',
            type: 'uint32',
            internalType: 'uint32',
          },
          {
            name: 'redeemFeeBps',
            type: 'uint32',
            internalType: 'uint32',
          },
        ],
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'OngoingFeesCollected',
    inputs: [
      {
        name: 'source',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'managementFeeShares',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'performanceFeeShares',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'RecipientsUpdated',
    inputs: [
      {
        name: 'newRecipients',
        type: 'tuple[]',
        indexed: false,
        internalType: 'struct IFeeManager.FeeRecipient[]',
        components: [
          {
            name: 'target',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'shareBps',
            type: 'uint32',
            internalType: 'uint32',
          },
        ],
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
    name: 'TransactionalFeeCollected',
    inputs: [
      {
        name: 'source',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'asset',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'feeType',
        type: 'uint8',
        indexed: false,
        internalType: 'enum Mode',
      },
      {
        name: 'feeAmount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'error',
    name: 'FeeTooHigh',
    inputs: [
      {
        name: 'attemptedFee',
        type: 'uint32',
        internalType: 'uint32',
      },
      {
        name: 'maxFee',
        type: 'uint32',
        internalType: 'uint32',
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
    name: 'InvalidBps',
    inputs: [
      {
        name: 'bpsValue',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'InvalidBpsValue',
    inputs: [
      {
        name: 'invalidValue',
        type: 'uint32',
        internalType: 'uint32',
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
    name: 'NonExistingConfigId',
    inputs: [
      {
        name: 'configId',
        type: 'bytes32',
        internalType: 'bytes32',
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
    name: 'RecipientsNotStrictlyAscending',
    inputs: [
      {
        name: 'recipient',
        type: 'address',
        internalType: 'address',
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
    name: 'SafeCastOverflowedUintDowncast',
    inputs: [
      {
        name: 'bits',
        type: 'uint8',
        internalType: 'uint8',
      },
      {
        name: 'value',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
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
    name: 'ZeroLength',
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
