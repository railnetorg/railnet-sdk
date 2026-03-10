export const conduitFactoryAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: 'coreFactory',
        type: 'address',
        internalType: 'contract CoreFactory',
      },
      {
        name: 'conduitBeacon',
        type: 'address',
        internalType: 'contract FreezablePausableBeacon',
      },
      {
        name: 'accessControl',
        type: 'address',
        internalType: 'contract ExternalAccessControl',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'CONDUIT_BEACON',
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
    name: 'finalizeConduitDeposit',
    inputs: [
      {
        name: 'conduit',
        type: 'address',
        internalType: 'contract IConduit',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
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
    name: 'predictConduitDeployment',
    inputs: [
      {
        name: 'params',
        type: 'tuple',
        internalType: 'struct ConduitFactory.SpawnParams',
        components: [
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
            name: 'vehicle',
            type: 'address',
            internalType: 'contract IVehicle',
          },
          {
            name: 'feeManager',
            type: 'address',
            internalType: 'contract IFeeManager',
          },
          {
            name: 'accountList',
            type: 'address',
            internalType: 'contract IAccountList',
          },
          {
            name: 'ownerRegistry',
            type: 'address',
            internalType: 'contract IOwnerRegistry',
          },
          {
            name: 'accessControl',
            type: 'address',
            internalType: 'contract ExternalAccessControl',
          },
          {
            name: 'transferMode',
            type: 'uint8',
            internalType: 'enum ConduitStructs.TransferMode',
          },
          {
            name: 'initialDepositSize',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'initialExpectedSupply',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'depositAsset',
            type: 'address',
            internalType: 'contract IERC20',
          },
          {
            name: 'querySalt',
            type: 'bytes32',
            internalType: 'bytes32',
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
    name: 'setDeprecated',
    inputs: [
      {
        name: 'deprecated',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'spawn',
    inputs: [
      {
        name: 'spawnParams',
        type: 'tuple',
        internalType: 'struct ConduitFactory.SpawnParams',
        components: [
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
            name: 'vehicle',
            type: 'address',
            internalType: 'contract IVehicle',
          },
          {
            name: 'feeManager',
            type: 'address',
            internalType: 'contract IFeeManager',
          },
          {
            name: 'accountList',
            type: 'address',
            internalType: 'contract IAccountList',
          },
          {
            name: 'ownerRegistry',
            type: 'address',
            internalType: 'contract IOwnerRegistry',
          },
          {
            name: 'accessControl',
            type: 'address',
            internalType: 'contract ExternalAccessControl',
          },
          {
            name: 'transferMode',
            type: 'uint8',
            internalType: 'enum ConduitStructs.TransferMode',
          },
          {
            name: 'initialDepositSize',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'initialExpectedSupply',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'depositAsset',
            type: 'address',
            internalType: 'contract IERC20',
          },
          {
            name: 'querySalt',
            type: 'bytes32',
            internalType: 'bytes32',
          },
          {
            name: 'deploymentSalt',
            type: 'bytes32',
            internalType: 'bytes32',
          },
        ],
      },
      {
        name: 'salt',
        type: 'bytes32',
        internalType: 'bytes32',
      },
    ],
    outputs: [
      {
        name: 'conduit',
        type: 'address',
        internalType: 'contract IConduit',
      },
    ],
    stateMutability: 'payable',
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
    name: 'ConduitDeployed',
    inputs: [
      {
        name: 'conduit',
        type: 'address',
        indexed: true,
        internalType: 'contract IConduit',
      },
      {
        name: 'params',
        type: 'tuple',
        indexed: false,
        internalType: 'struct ConduitFactory.SpawnParams',
        components: [
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
            name: 'vehicle',
            type: 'address',
            internalType: 'contract IVehicle',
          },
          {
            name: 'feeManager',
            type: 'address',
            internalType: 'contract IFeeManager',
          },
          {
            name: 'accountList',
            type: 'address',
            internalType: 'contract IAccountList',
          },
          {
            name: 'ownerRegistry',
            type: 'address',
            internalType: 'contract IOwnerRegistry',
          },
          {
            name: 'accessControl',
            type: 'address',
            internalType: 'contract ExternalAccessControl',
          },
          {
            name: 'transferMode',
            type: 'uint8',
            internalType: 'enum ConduitStructs.TransferMode',
          },
          {
            name: 'initialDepositSize',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'initialExpectedSupply',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'depositAsset',
            type: 'address',
            internalType: 'contract IERC20',
          },
          {
            name: 'querySalt',
            type: 'bytes32',
            internalType: 'bytes32',
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
    type: 'error',
    name: 'ExpectedSupplyNotReached',
    inputs: [
      {
        name: 'totalSupply',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'expectedSupply',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'FactoryDeprecated',
    inputs: [],
  },
  {
    type: 'error',
    name: 'FailedConduitCreation',
    inputs: [],
  },
  {
    type: 'error',
    name: 'FailedModuleInitialization',
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
    name: 'InsufficientAllowance',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InsufficientAssetBalance',
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
    name: 'NoPendingDeposit',
    inputs: [
      {
        name: 'conduit',
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
