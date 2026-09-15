/**
 * Errors a caller can hit that no ABI it holds declares. {@link getRailnetError} falls back to this
 * fragment because viem decodes against the ABI of the call, so a reachable error the called
 * contract does not itself declare arrives as raw bytes: `InvalidOutput` is reverted from
 * `ErrorLib` through assembly, which solc lists on no contract at all.
 */
export const protocolErrorsAbi = [
  {
    type: 'error',
    name: 'InvalidOutput',
    inputs: [
      {
        name: 'queryOutput',
        type: 'tuple',
        internalType: 'struct Asset',
        components: [
          { name: 'asset', type: 'address', internalType: 'address' },
          { name: 'value', type: 'uint256', internalType: 'uint256' },
        ],
      },
    ],
  },
  {
    type: 'error',
    name: 'InvalidEstimation',
    inputs: [
      {
        name: 'queryOutput',
        type: 'tuple',
        internalType: 'struct Asset',
        components: [
          { name: 'asset', type: 'address', internalType: 'address' },
          { name: 'value', type: 'uint256', internalType: 'uint256' },
        ],
      },
      {
        name: 'estimationOutput',
        type: 'tuple',
        internalType: 'struct Asset',
        components: [
          { name: 'asset', type: 'address', internalType: 'address' },
          { name: 'value', type: 'uint256', internalType: 'uint256' },
        ],
      },
    ],
  },
  { type: 'error', name: 'DisabledVehicle', inputs: [] },
  { type: 'error', name: 'MissingAccessControl', inputs: [] },
  {
    type: 'error',
    name: 'InvalidState',
    inputs: [
      { name: 'expected', type: 'uint8', internalType: 'enum State' },
      { name: 'actual', type: 'uint8', internalType: 'enum State' },
    ],
  },
  {
    type: 'error',
    name: 'MaxDepositTooLow',
    inputs: [
      {
        name: 'input',
        type: 'tuple',
        internalType: 'struct Asset',
        components: [
          { name: 'asset', type: 'address', internalType: 'address' },
          { name: 'value', type: 'uint256', internalType: 'uint256' },
        ],
      },
      {
        name: 'maxDeposit',
        type: 'tuple',
        internalType: 'struct Asset',
        components: [
          { name: 'asset', type: 'address', internalType: 'address' },
          { name: 'value', type: 'uint256', internalType: 'uint256' },
        ],
      },
    ],
  },
  {
    type: 'error',
    name: 'MaxRedeemTooLow',
    inputs: [
      {
        name: 'input',
        type: 'tuple',
        internalType: 'struct Asset',
        components: [
          { name: 'asset', type: 'address', internalType: 'address' },
          { name: 'value', type: 'uint256', internalType: 'uint256' },
        ],
      },
      {
        name: 'maxRedeem',
        type: 'tuple',
        internalType: 'struct Asset',
        components: [
          { name: 'asset', type: 'address', internalType: 'address' },
          { name: 'value', type: 'uint256', internalType: 'uint256' },
        ],
      },
    ],
  },
  { type: 'error', name: 'InvalidValue', inputs: [{ name: 'value', type: 'uint256' }] },
  { type: 'error', name: 'ZeroOutputValue', inputs: [] },
  { type: 'error', name: 'ZeroAssetValue', inputs: [] },
  { type: 'error', name: 'ZeroSharesValue', inputs: [] },
  { type: 'error', name: 'InvalidBeacon', inputs: [] },
  { type: 'error', name: 'ExistingModule', inputs: [{ name: 'module', type: 'address' }] },
  { type: 'error', name: 'AlreadyAllowed', inputs: [{ name: 'module', type: 'address' }] },
  { type: 'error', name: 'AlreadyDisallowed', inputs: [{ name: 'module', type: 'address' }] },
  { type: 'error', name: 'ModuleDoesNotAcceptNativeCurrency', inputs: [] },
] as const
