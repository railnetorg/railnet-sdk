export const feeManagerFactoryAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: 'coreFactory',
        type: 'address',
        internalType: 'contract CoreFactory',
      },
      {
        name: 'accessControl',
        type: 'address',
        internalType: 'contract ExternalAccessControl',
      },
      {
        name: 'beacon',
        type: 'address',
        internalType: 'contract FreezablePausableBeacon',
      },
      {
        name: 'previousFactory',
        type: 'address',
        internalType: 'contract FactoryBase',
      },
      {
        name: 'accessControlFactory',
        type: 'address',
        internalType: 'contract FactoryBase',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'ACCESS_CONTROL_FACTORY',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract FactoryBase',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'BEACON',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract FreezablePausableBeacon',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'CORE_FACTORY',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract CoreFactory',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'deprecate',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getDeploymentAddress',
    inputs: [
      {
        name: 'params',
        type: 'tuple',
        internalType: 'struct FeeManagerFactory.SpawnParams',
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
          {
            name: 'deploymentSalt',
            type: 'bytes32',
            internalType: 'bytes32',
          },
        ],
      },
    ],
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
    name: 'isDeployedBy',
    inputs: [
      {
        name: 'addr',
        type: 'address',
        internalType: 'address',
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
    name: 'isDeprecated',
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
    name: 'previousFactory',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract FactoryBase',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'spawn',
    inputs: [
      {
        name: 'params',
        type: 'tuple',
        internalType: 'struct FeeManagerFactory.SpawnParams',
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
          {
            name: 'deploymentSalt',
            type: 'bytes32',
            internalType: 'bytes32',
          },
        ],
      },
    ],
    outputs: [
      {
        name: 'feeManager',
        type: 'address',
        internalType: 'contract FeeManager',
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
    name: 'BeaconInitialized',
    inputs: [
      {
        name: 'beacon',
        type: 'address',
        indexed: false,
        internalType: 'contract FreezablePausableBeacon',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'CoreFactoryInitialized',
    inputs: [
      {
        name: 'coreFactory',
        type: 'address',
        indexed: false,
        internalType: 'contract CoreFactory',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'DeploymentRegistered',
    inputs: [
      {
        name: 'deployed',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Deprecated',
    inputs: [],
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
    name: 'SpawnedFeeManager',
    inputs: [
      {
        name: 'deployer',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'feeManager',
        type: 'address',
        indexed: false,
        internalType: 'contract FeeManager',
      },
      {
        name: 'params',
        type: 'tuple',
        indexed: false,
        internalType: 'struct FeeManagerFactory.SpawnParams',
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
          {
            name: 'deploymentSalt',
            type: 'bytes32',
            internalType: 'bytes32',
          },
        ],
      },
    ],
    anonymous: false,
  },
  {
    type: 'error',
    name: 'FactoryDeprecated',
    inputs: [],
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
    name: 'NotDeployedByFactory',
    inputs: [
      {
        name: 'factory',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'addr',
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
