export const multiVehicleFactoryAbi = [
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
        name: 'beacons_',
        type: 'tuple',
        internalType: 'struct MultiVehicleFactory.Beacons',
        components: [
          {
            name: 'multiVehicle',
            type: 'address',
            internalType: 'contract FreezablePausableBeacon',
          },
          {
            name: 'queryRedeemQueue',
            type: 'address',
            internalType: 'contract FreezablePausableBeacon',
          },
          {
            name: 'queueStrategyEngine',
            type: 'address',
            internalType: 'contract FreezablePausableBeacon',
          },
          {
            name: 'sectorAccountingEngine',
            type: 'address',
            internalType: 'contract FreezablePausableBeacon',
          },
          {
            name: 'subQueryEngine',
            type: 'address',
            internalType: 'contract FreezablePausableBeacon',
          },
          {
            name: 'vehicleRegistry',
            type: 'address',
            internalType: 'contract FreezablePausableBeacon',
          },
        ],
      },
      {
        name: 'initialCounter',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
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
    name: 'beacons',
    inputs: [],
    outputs: [
      {
        name: 'multiVehicle',
        type: 'address',
        internalType: 'contract FreezablePausableBeacon',
      },
      {
        name: 'queryRedeemQueue',
        type: 'address',
        internalType: 'contract FreezablePausableBeacon',
      },
      {
        name: 'queueStrategyEngine',
        type: 'address',
        internalType: 'contract FreezablePausableBeacon',
      },
      {
        name: 'sectorAccountingEngine',
        type: 'address',
        internalType: 'contract FreezablePausableBeacon',
      },
      {
        name: 'subQueryEngine',
        type: 'address',
        internalType: 'contract FreezablePausableBeacon',
      },
      {
        name: 'vehicleRegistry',
        type: 'address',
        internalType: 'contract FreezablePausableBeacon',
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
    name: 'getDeploymentAddresses',
    inputs: [
      {
        name: 'params',
        type: 'tuple',
        internalType: 'struct MultiVehicleFactory.SpawnParams',
        components: [
          {
            name: 'asset',
            type: 'address',
            internalType: 'contract IERC20',
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
            name: 'initialInterceptions',
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
            name: 'salts',
            type: 'tuple',
            internalType: 'struct MultiVehicleFactory.Salts',
            components: [
              {
                name: 'multiVehicle',
                type: 'bytes32',
                internalType: 'bytes32',
              },
              {
                name: 'queryRedeemQueue',
                type: 'bytes32',
                internalType: 'bytes32',
              },
              {
                name: 'queueStrategyEngine',
                type: 'bytes32',
                internalType: 'bytes32',
              },
              {
                name: 'sectorAccountingEngine',
                type: 'bytes32',
                internalType: 'bytes32',
              },
              {
                name: 'subQueryEngine',
                type: 'bytes32',
                internalType: 'bytes32',
              },
              {
                name: 'vehicleRegistry',
                type: 'bytes32',
                internalType: 'bytes32',
              },
              {
                name: 'initialDepositQuery',
                type: 'bytes32',
                internalType: 'bytes32',
              },
            ],
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
        ],
      },
    ],
    outputs: [
      {
        name: 'multiVehicle',
        type: 'tuple',
        internalType: 'struct MultiVehicleFactory.Contracts',
        components: [
          {
            name: 'multiVehicle',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'queryRedeemQueue',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'queueStrategyEngine',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'sectorAccountingEngine',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'subQueryEngine',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'vehicleRegistry',
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
    name: 'implementations',
    inputs: [],
    outputs: [
      {
        name: 'multiVehicle',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'queryRedeemQueue',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'queueStrategyEngine',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'sectorAccountingEngine',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'subQueryEngine',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'vehicleRegistry',
        type: 'address',
        internalType: 'address',
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
        name: 'params',
        type: 'tuple',
        internalType: 'struct MultiVehicleFactory.SpawnParams',
        components: [
          {
            name: 'asset',
            type: 'address',
            internalType: 'contract IERC20',
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
            name: 'initialInterceptions',
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
            name: 'salts',
            type: 'tuple',
            internalType: 'struct MultiVehicleFactory.Salts',
            components: [
              {
                name: 'multiVehicle',
                type: 'bytes32',
                internalType: 'bytes32',
              },
              {
                name: 'queryRedeemQueue',
                type: 'bytes32',
                internalType: 'bytes32',
              },
              {
                name: 'queueStrategyEngine',
                type: 'bytes32',
                internalType: 'bytes32',
              },
              {
                name: 'sectorAccountingEngine',
                type: 'bytes32',
                internalType: 'bytes32',
              },
              {
                name: 'subQueryEngine',
                type: 'bytes32',
                internalType: 'bytes32',
              },
              {
                name: 'vehicleRegistry',
                type: 'bytes32',
                internalType: 'bytes32',
              },
              {
                name: 'initialDepositQuery',
                type: 'bytes32',
                internalType: 'bytes32',
              },
            ],
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
        ],
      },
    ],
    outputs: [
      {
        name: 'multiVehicle',
        type: 'tuple',
        internalType: 'struct MultiVehicleFactory.Contracts',
        components: [
          {
            name: 'multiVehicle',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'queryRedeemQueue',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'queueStrategyEngine',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'sectorAccountingEngine',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'subQueryEngine',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'vehicleRegistry',
            type: 'address',
            internalType: 'address',
          },
        ],
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
    name: 'BeaconsInitialized',
    inputs: [
      {
        name: 'beacons',
        type: 'tuple',
        indexed: false,
        internalType: 'struct MultiVehicleFactory.Beacons',
        components: [
          {
            name: 'multiVehicle',
            type: 'address',
            internalType: 'contract FreezablePausableBeacon',
          },
          {
            name: 'queryRedeemQueue',
            type: 'address',
            internalType: 'contract FreezablePausableBeacon',
          },
          {
            name: 'queueStrategyEngine',
            type: 'address',
            internalType: 'contract FreezablePausableBeacon',
          },
          {
            name: 'sectorAccountingEngine',
            type: 'address',
            internalType: 'contract FreezablePausableBeacon',
          },
          {
            name: 'subQueryEngine',
            type: 'address',
            internalType: 'contract FreezablePausableBeacon',
          },
          {
            name: 'vehicleRegistry',
            type: 'address',
            internalType: 'contract FreezablePausableBeacon',
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
    name: 'SpawnedMultiVehicle',
    inputs: [
      {
        name: 'contracts',
        type: 'tuple',
        indexed: false,
        internalType: 'struct MultiVehicleFactory.Contracts',
        components: [
          {
            name: 'multiVehicle',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'queryRedeemQueue',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'queueStrategyEngine',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'sectorAccountingEngine',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'subQueryEngine',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'vehicleRegistry',
            type: 'address',
            internalType: 'address',
          },
        ],
      },
      {
        name: 'params',
        type: 'tuple',
        indexed: false,
        internalType: 'struct MultiVehicleFactory.SpawnParams',
        components: [
          {
            name: 'asset',
            type: 'address',
            internalType: 'contract IERC20',
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
            name: 'initialInterceptions',
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
            name: 'salts',
            type: 'tuple',
            internalType: 'struct MultiVehicleFactory.Salts',
            components: [
              {
                name: 'multiVehicle',
                type: 'bytes32',
                internalType: 'bytes32',
              },
              {
                name: 'queryRedeemQueue',
                type: 'bytes32',
                internalType: 'bytes32',
              },
              {
                name: 'queueStrategyEngine',
                type: 'bytes32',
                internalType: 'bytes32',
              },
              {
                name: 'sectorAccountingEngine',
                type: 'bytes32',
                internalType: 'bytes32',
              },
              {
                name: 'subQueryEngine',
                type: 'bytes32',
                internalType: 'bytes32',
              },
              {
                name: 'vehicleRegistry',
                type: 'bytes32',
                internalType: 'bytes32',
              },
              {
                name: 'initialDepositQuery',
                type: 'bytes32',
                internalType: 'bytes32',
              },
            ],
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
