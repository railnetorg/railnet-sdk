export const vehicleRegistryAbi = [
  {
    type: 'constructor',
    inputs: [],
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
        name: 'multiVehicle_',
        type: 'address',
        internalType: 'contract IVehicle',
      },
      {
        name: 'asset_',
        type: 'address',
        internalType: 'contract IERC20',
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
    anonymous: false,
  },
  {
    type: 'error',
    name: 'CyclicalDependencyDetected',
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
    name: 'InvalidInitialization',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidRouteLengths',
    inputs: [
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
] as const
