export const aaveV3VehicleFactoryAbi = [
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
        name: 'startingCounter',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'previousFactory',
        type: 'address',
        internalType: 'contract FactoryBase',
      },
      {
        name: 'feeManagerFactory',
        type: 'address',
        internalType: 'contract FactoryBase',
      },
      {
        name: 'modulesManagerFactory',
        type: 'address',
        internalType: 'contract FactoryBase',
      },
      {
        name: 'accessControlFactory',
        type: 'address',
        internalType: 'contract FactoryBase',
      },
      {
        name: 'assetRegistry',
        type: 'address',
        internalType: 'contract AssetRegistry',
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
    name: 'ASSET_REGISTRY',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract AssetRegistry',
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
    name: 'FEE_MANAGER_FACTORY',
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
    name: 'MODULES_MANAGER_FACTORY',
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
    name: 'deploymentCounter',
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
        internalType: 'struct AaveV3VehicleFactory.SpawnParams',
        components: [
          {
            name: 'asset',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'poolAddressesProvider',
            type: 'address',
            internalType: 'address',
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
            name: 'querySalt',
            type: 'bytes32',
            internalType: 'bytes32',
          },
          {
            name: 'deploymentSalt',
            type: 'bytes32',
            internalType: 'bytes32',
          },
          {
            name: 'forbiddenAddresses',
            type: 'address[]',
            internalType: 'address[]',
          },
          {
            name: 'initialExpectedSupply',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'queryRegistry',
            type: 'address',
            internalType: 'contract IQueryRegistry',
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
        internalType: 'struct AaveV3VehicleFactory.SpawnParams',
        components: [
          {
            name: 'asset',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'poolAddressesProvider',
            type: 'address',
            internalType: 'address',
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
            name: 'querySalt',
            type: 'bytes32',
            internalType: 'bytes32',
          },
          {
            name: 'deploymentSalt',
            type: 'bytes32',
            internalType: 'bytes32',
          },
          {
            name: 'forbiddenAddresses',
            type: 'address[]',
            internalType: 'address[]',
          },
          {
            name: 'initialExpectedSupply',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'queryRegistry',
            type: 'address',
            internalType: 'contract IQueryRegistry',
          },
        ],
      },
    ],
    outputs: [
      {
        name: 'vehicle',
        type: 'address',
        internalType: 'contract AaveV3Vehicle',
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
    name: 'AssetRegistryInitialized',
    inputs: [
      {
        name: 'assetRegistry',
        type: 'address',
        indexed: false,
        internalType: 'contract AssetRegistry',
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
    name: 'SpawnedAaveV3Vehicle',
    inputs: [
      {
        name: 'deployer',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'vehicle',
        type: 'address',
        indexed: false,
        internalType: 'contract AaveV3Vehicle',
      },
      {
        name: 'params',
        type: 'tuple',
        indexed: false,
        internalType: 'struct AaveV3VehicleFactory.SpawnParams',
        components: [
          {
            name: 'asset',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'poolAddressesProvider',
            type: 'address',
            internalType: 'address',
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
            name: 'querySalt',
            type: 'bytes32',
            internalType: 'bytes32',
          },
          {
            name: 'deploymentSalt',
            type: 'bytes32',
            internalType: 'bytes32',
          },
          {
            name: 'forbiddenAddresses',
            type: 'address[]',
            internalType: 'address[]',
          },
          {
            name: 'initialExpectedSupply',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'queryRegistry',
            type: 'address',
            internalType: 'contract IQueryRegistry',
          },
        ],
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
    name: 'FailedVehicleUnlock',
    inputs: [
      {
        name: 'factory',
        type: 'address',
        internalType: 'address',
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
    name: 'InvalidPoolAddressesProvider',
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
