/**
 * The `ErrorLib` errors no contract ABI carries.
 *
 * A rejection is encoded as `abi.encodeWithSelector(ErrorLib.X.selector, ...)` and reverted through
 * assembly, so solc never lists it on the contract that throws it — `InvalidOutput` reaches a
 * caller from `BaseVehicle._validateOutput` but appears in no vehicle or conduit ABI, and
 * `InvalidEstimation` is declared on a facet the caller never addresses. viem decodes a revert
 * against the ABI of the call, so both arrive as undecoded bytes.
 *
 * The same holds for an error a shared base declares: `MaxDepositTooLow` reaches a caller through
 * whichever vehicle a conduit deposit routes into, but viem decodes against the ABI of the call —
 * `conduitAbi` — which does not carry it.
 *
 * {@link getRailnetError} falls back to this fragment. Keep it in step with `src/libs/Error.sol`
 * and `src/vehicles/base/abstracts/BaseVehicleErrors.sol`.
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
