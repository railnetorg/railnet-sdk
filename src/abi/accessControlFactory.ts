export const accessControlFactoryAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: 'previousFactory',
        type: 'address',
        internalType: 'contract FactoryBase',
      },
      {
        name: 'coreFactory',
        type: 'address',
        internalType: 'contract CoreFactory',
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
    name: 'getDeploymentAddress',
    inputs: [
      {
        name: 'params',
        type: 'tuple',
        internalType: 'struct AccessControlFactory.SpawnParams',
        components: [
          {
            name: 'initialDelay',
            type: 'uint48',
            internalType: 'uint48',
          },
          {
            name: 'initialDefaultAdmin',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'initialRoles',
            type: 'tuple[]',
            internalType: 'struct IExternalAccessControl.RoleAttribution[]',
            components: [
              {
                name: 'account',
                type: 'address',
                internalType: 'address',
              },
              {
                name: 'role',
                type: 'bytes32',
                internalType: 'bytes32',
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
        name: 'predictedAddress',
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
        internalType: 'struct AccessControlFactory.SpawnParams',
        components: [
          {
            name: 'initialDelay',
            type: 'uint48',
            internalType: 'uint48',
          },
          {
            name: 'initialDefaultAdmin',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'initialRoles',
            type: 'tuple[]',
            internalType: 'struct IExternalAccessControl.RoleAttribution[]',
            components: [
              {
                name: 'account',
                type: 'address',
                internalType: 'address',
              },
              {
                name: 'role',
                type: 'bytes32',
                internalType: 'bytes32',
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
        internalType: 'contract ExternalAccessControl',
      },
    ],
    stateMutability: 'nonpayable',
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
    name: 'SpawnedExternalAccessControl',
    inputs: [
      {
        name: 'eac',
        type: 'address',
        indexed: false,
        internalType: 'contract ExternalAccessControl',
      },
      {
        name: 'params',
        type: 'tuple',
        indexed: false,
        internalType: 'struct AccessControlFactory.SpawnParams',
        components: [
          {
            name: 'initialDelay',
            type: 'uint48',
            internalType: 'uint48',
          },
          {
            name: 'initialDefaultAdmin',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'initialRoles',
            type: 'tuple[]',
            internalType: 'struct IExternalAccessControl.RoleAttribution[]',
            components: [
              {
                name: 'account',
                type: 'address',
                internalType: 'address',
              },
              {
                name: 'role',
                type: 'bytes32',
                internalType: 'bytes32',
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
    name: 'ZeroAddress',
    inputs: [],
  },
] as const
