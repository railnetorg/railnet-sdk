import type { Hex } from 'viem'
import { BaseError, ContractFunctionRevertedError, decodeErrorResult } from 'viem'
import { protocolErrorsAbi } from './abi/protocolErrors.js'

/**
 * What to do about a revert, for the errors a caller can act on. Keyed by the custom error's name,
 * which viem decodes from the ABIs this package ships.
 *
 * Deliberately not exhaustive: the protocol declares 121 errors, and the OpenZeppelin, ERC-20 and
 * proxy ones say what they mean already. Only the entries where the name alone leaves a caller
 * guessing are here.
 */
export const railnetErrorHints: Readonly<Record<string, string>> = {
  AddressAlreadyListed:
    'The account is already on that list, or appears twice in the batch. Diff against the current list before sending.',
  AddressNotListed: 'The account is not on the list being removed from.',
  AddressOnOtherList:
    'The account sits on the allow-list and the block-list at once. Remove it from the other list first.',
  AssetNotAuthorized:
    'The AssetRegistry has no initial deposit registered for this asset, so no factory will spawn against it.',
  CannotAuthorizeMultiVehicle: 'A multi vehicle cannot be authorized as its own sub-vehicle.',
  DepositLimitedByCap:
    'The sub-vehicle cap set by buildConfigureVehicleCall is reached. The cap is in share units of that vehicle, not in the asset of the multi vehicle.',
  DisabledConduit: 'The conduit has not been enabled yet, so it takes no deposits or redeems.',
  DisabledVehicle: 'The vehicle is paused or frozen at the beacon.',
  DispatchDepositAmountTooHigh:
    'The dispatch asks for more than the sector holds or than the vehicle accepts. Move assets into the sector first, or pass maxUint256 to send whatever is staged.',
  DispatchRedeemAmountTooHigh:
    'The dispatch asks for more shares than the sector holds or than the vehicle will redeem in one go.',
  EmptyStrictDispatch: 'The sector balance is zero, so the dispatch would move nothing.',
  ExpectedSupplyNotReached:
    'The seed deposit minted fewer shares than initialExpectedSupply. Lower the floor, or read the amount with getInitialDepositAmount.',
  ExtraAssetsForWithdrawalRequestsTooHigh:
    'The buffer exceeds type(uint128).max. It is in asset units of the multi vehicle, not shares.',
  FactoryDeprecated:
    'The factory address is a superseded generation. Upgrade the SDK, or read the current address from getAddresses.',
  FeeTooHigh:
    'The rate exceeds the matching initialMaxFees ceiling fixed when the FeeManager was spawned. Ceilings are immutable.',
  ForceRedeemNotAllowed: 'The caller lacks CONDUIT_FORCE_REDEEM for that holder.',
  IneffectiveMove: 'Source and destination sector are the same, so the move is a no-op.',
  InsufficientAllowance:
    'Approve the factory or the conduit first. For a spawn, the amount comes from getInitialDepositAmount.',
  InterceptionSharesTooHigh: 'The interception recipients total more than 10000 bps of the flow.',
  InvalidBps: 'A basis-point value is outside [0, 10000].',
  InvalidEstimation:
    'The output floor on the query was not met: the second argument is what the vehicle would actually produce. Re-read the estimate and lower minOutput, or widen the slippage.',
  InvalidOutput:
    'The query names an output asset the vehicle will not produce. A DEPOSIT must name the vehicle itself and a REDEEM its underlying asset — buildDepositConduitQuery and getRedeemConduitCall do this for you.',
  InvalidBpsValue:
    'A basis-point value is out of range, or a fee recipient split does not total exactly 10000.',
  InvalidCaller:
    'The function is restricted to one address. conduit.enable() for instance is reachable only through the ConduitFactory.',
  InvalidEstimatedAsset:
    'A vehicle answered estimate() with an asset that is not its own shares. The helper that raised this expects a single-asset vehicle.',
  InvalidPoolAddressesProvider:
    'The Aave pool addresses provider is not the one the factory implementation was built against. Use the address from getAddresses.',
  InvalidQueryOwnerOrReceiver:
    'The owner and receiver on the query are not what the conduit requires.',
  InvalidQuerySalt:
    'query.salt is keccak256(abi.encode(sender, salt)) and the sender it was built for is not msg.sender. Through a Safe, a batch or a relayer, pass that contract as `sender`.',
  InvalidQuerySector: 'The sector is not a query sector where one is required.',
  InvalidReceiver: 'The receiver is the zero address.',
  InvalidSector:
    'The sector is not one the engine accepts here. Build vehicle sectors with vehicleSector().',
  InvalidStaticSector:
    'A static sector was expected. Use SECTOR_AVAILABLE, SECTOR_ALLOCATION, SECTOR_RESERVED, SECTOR_ENTRY or SECTOR_EXIT.',
  InvalidState:
    'The query is not in the STEAM state this call needs. Compare against QueryState — an async vehicle leaves it PROCESSING until it settles.',
  InvalidTarget: 'A queue entry has a threshold above its value.',
  InvalidVehicle: 'The address is not a vehicle the protocol recognises.',
  InvalidVehicleSector: 'A vehicle sector was expected. Build one with vehicleSector(vehicle).',
  MaxDepositTooLow: 'The deposit exceeds the current capacity of the conduit.',
  MaxRedeemTooLow: 'The redeem exceeds the current capacity of the conduit.',
  MaxTotalAssetsExceeded:
    'The deposit would push totalAssets() past the cap set by buildSetMaxTotalAssetsCall.',
  MinOutputRequiresPinnedAmount:
    'A dispatch cannot combine minOutput with an amount of maxUint256. Pin the amount, or set minOutput to 0n.',
  MissingAccessControl:
    'The contract was spawned without an access control and cannot gate this call.',
  MissingRole:
    'The caller lacks the role for that scope. Scope a grant to the contract that performs the gated call — MULTI_VEHICLE_SET_QUEUES to the queue strategy engine, not to the multi vehicle. Check with getHasRole first.',
  ModeUnchanged: 'The allow-list mode already holds that value.',
  NoPendingDeposit: 'The conduit has no async initial deposit waiting to be finalized.',
  NotAllowed:
    'The AccountList blocks this account. Under REGULAR or STRICT the sender must be allow-listed; a blocked or sanctioned account is refused outright.',
  NotDeployedByFactory: 'The address was not spawned by the factory being asked about it.',
  NothingToFulfill: 'No redeem request is pending fulfilment.',
  NothingToRedeem: 'The holder has no position to redeem.',
  OracleUnchanged: 'The sanctions oracle already points there.',
  PublicRoleAuthDenied: 'DEFAULT_ADMIN_ROLE cannot be made public.',
  QueryAlreadyExists:
    'A query already exists under that salt. A salt fixes the identity of a query, so use a fresh randomSalt() per operation.',
  RecipientsNotStrictlyAscending:
    'Fee recipients must be sorted strictly ascending by target address, with no duplicates.',
  RolePublicStatusUnchanged: 'The role already has that public status.',
  SanctionsOracleRequired: 'Screening cannot be enabled before an oracle is set.',
  SanctionsUnchanged: 'Screening is already in that state.',
  StateUnchanged: 'The call re-sends the values already stored. Read them back before writing.',
  TransferNotAllowed:
    'The conduit was spawned with transferEnabled: false, or the AccountList refuses one side of the transfer.',
  UnauthorizedVehicle: 'The vehicle is not authorized on this multi vehicle.',
  UninitializedFeeManager: 'The FeeManager has no recipients configured yet.',
  UnknownQuery:
    'No query is stored under that id. The id of a redeem is only knowable once created — read it back with extractQueryIds.',
  VehicleAlreadyAuthorized: 'The vehicle is already authorized on this multi vehicle.',
  VehicleNotAuthorized:
    'Authorize the vehicle on the VehicleManager first, with buildAuthorizeVehicleCall.',
  VehicleNotReady: 'The vehicle has not completed its seed deposit.',
  ZeroBalance: 'The sector holds none of that asset.',
  ZeroInputValue: 'The input amount is zero.',
  ZeroTotalAssets: 'The vehicle holds nothing, so the conversion has no rate to apply.',
}

export type RailnetError = {
  /** The custom error's name, as declared in the contract. */
  name: string
  /** Its decoded arguments, in declaration order. Empty for an error that takes none. */
  args: readonly unknown[]
  /** What to do about it, when this package knows. */
  hint: string | undefined
  /** The `ContractFunctionRevertedError` this was read from, for the raw data and message. */
  cause: ContractFunctionRevertedError
}

/**
 * Reads a Railnet revert out of anything viem threw: it walks the error chain for the
 * `ContractFunctionRevertedError`, and returns the decoded name, its arguments, and what to do.
 *
 * @returns The revert, or `null` if the failure was not a contract revert — a rejected signature,
 * a transport error and a gas estimation failure all land here as `null`.
 *
 * @example
 * import { getRailnetError } from '@railnetorg/railnet-sdk'
 *
 * try {
 *   await simulateContract(client, { ...buildDepositConduitCall(parameters), account })
 * } catch (error) {
 *   const reverted = getRailnetError(error)
 *   if (reverted?.name === 'InsufficientAllowance') return approveFirst()
 *   throw error
 * }
 */
export function getRailnetError(error: unknown): RailnetError | null {
  if (!(error instanceof BaseError)) {
    return null
  }

  const reverted = error.walk((cause) => cause instanceof ContractFunctionRevertedError)
  if (!(reverted instanceof ContractFunctionRevertedError)) {
    return null
  }

  const decoded = reverted.data ?? decodeProtocolError(reverted.raw)
  if (!decoded) {
    return null
  }

  return {
    name: decoded.errorName,
    args: decoded.args ?? [],
    hint: railnetErrorHints[decoded.errorName],
    cause: reverted,
  }
}

/**
 * Second pass for a revert viem left undecoded, against the `ErrorLib` errors no contract ABI
 * carries. See {@link protocolErrorsAbi}.
 */
function decodeProtocolError(raw: Hex | undefined) {
  if (!raw) {
    return undefined
  }

  try {
    return decodeErrorResult({ abi: protocolErrorsAbi, data: raw })
  } catch {
    return undefined
  }
}
