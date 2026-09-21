# Conduit Module Reference

Parameter and revert tables for the four modules `buildSpawnConduitCall` takes as parameters. The
patterns live in `../SKILL.md`; this file is lookup only.

Every module is gated by the same ExternalAccessControl the conduit is. Roles named here are
scoped to the module's address unless stated otherwise. See `railnet-access-control/SKILL.md`.

---

## FeeManager

### Types

```typescript
type Fees = {
  performanceFeeBps: number
  managementFeeBps: number
  depositFeeBps: number
  redeemFeeBps: number
}

type FeeRecipient = { target: Address; shareBps: number }
```

Rates are basis points, 10000 bps = 100%. Ceilings differ by kind: 10000 for the ongoing fees
(`performanceFeeBps`, `managementFeeBps`), 9999 for the transactional ones (`depositFeeBps`,
`redeemFeeBps`).

A recipient split must be non-empty, sorted strictly ascending by `target`, and total exactly
10000 bps.

### `buildSpawnFeeManagerCall(parameters)`

| Parameter | Type | Notes |
| --- | --- | --- |
| `factory` | `Address` | `getAddresses(chainId).feeManagerFactory` |
| `accessControl` | `Address` | Gates every setter below |
| `initialFees` | `Fees` | Must sit within `initialMaxFees` |
| `initialMaxFees` | `Fees` | Immutable ceilings on what `buildSetFeesCall` can ever set |
| `initialRecipients` | `readonly FeeRecipient[]` | Non-empty |
| `deploymentSalt` | `Hex` | Fixes the address. Use `randomSalt()` |

Role: FACTORY_SPAWN on the factory's access control. Nothing is pulled from the caller.

Throws before encoding if a rate is out of range or above its ceiling, or the split is empty, out
of order, or does not total 10000.

`predictFeeManagerDeployment(client, parameters)` returns the CREATE2 address. The init code carries
the access control and every fee field, so predict with exactly the parameters you will send.

### Setters

| Function | Parameters | Role | Reverts |
| --- | --- | --- | --- |
| `buildSetFeesCall` | `{ feeManager, fees }` | FEE_MANAGER_SET_FEES | `StateUnchanged` on the current rates; each rate capped by `initialMaxFees` |
| `buildSetFeeRecipientsCall` | `{ feeManager, recipients }` | FEE_MANAGER_SET_FEE_RECIPIENTS | `ZeroAddress`, `ZeroValue`, `ZeroLength`, `RecipientsNotStrictlyAscending`, `InvalidBpsValue` |
| `buildDispatchFeesCall` | `{ feeManager, token }` | FEE_MANAGER_DISPATCH_ERC20 | — |

`buildSetFeeRecipientsCall` replaces the whole split. `buildDispatchFeesCall` pays out the collected
balance of one token, usually the vehicle's asset or its share token.

The validators the builders run are exported to use on their own: `assertFees(fees)`,
`assertFeesWithinMax(fees, maxFees)` and `assertFeeRecipients(recipients)`. Each throws rather than
returning a verdict, so wrap them to validate a form before the user submits it.

---

## AccountList

### `AllowlistMode`

| Value | Deposits | Transfers |
| --- | --- | --- |
| `OPEN` (0) | Anyone not blocked or sanctioned | Open to non-blocked parties |
| `REGULAR` (1) | Allow-list gated | Open to non-blocked parties |
| `STRICT` (2) | Allow-list gated | Allow-list gated, both sides |

Precedence across every predicate is sanctions, then block-list, then the allow-list. Redeem is
gated by sanctions alone, so a blocked holder can always exit.

### `buildSpawnAccountListCall(parameters)`

| Parameter | Type | Notes |
| --- | --- | --- |
| `factory` | `Address` | `getAddresses(chainId).accountListFactory` |
| `accessControl` | `Address` | |
| `mode` | `AllowlistMode` | |
| `initialAllowList` | `readonly Address[]` | |
| `initialBlockList` | `readonly Address[]` | |
| `sanctionsEnabled` | `boolean` | Requires a non-zero `oracle`, else `SanctionsOracleRequired` |
| `oracle` | `Address` | An ISanctionsList contract, or zero while screening is off |
| `deploymentSalt` | `Hex` | |

Role: FACTORY_SPAWN on the factory's access control. `predictAccountListDeployment(client, parameters)`
returns the CREATE2 address.

### Configuration

Every call below needs ACCOUNT_LIST_MANAGER.

| Function | Parameters | Reverts |
| --- | --- | --- |
| `buildSetAllowlistModeCall` | `{ accountList, mode }` | `ModeUnchanged` |
| `buildAddToAllowListCall` | `{ accountList, accounts }` | `AddressAlreadyListed`, `AddressOnOtherList`, `ZeroAddress` |
| `buildRemoveFromAllowListCall` | `{ accountList, accounts }` | `AddressNotListed` |
| `buildAddToBlockListCall` | `{ accountList, accounts }` | `AddressOnOtherList` when the allow-list already holds it |
| `buildRemoveFromBlockListCall` | `{ accountList, accounts }` | `AddressNotListed` |
| `buildToggleSanctionsCall` | `{ accountList, enabled }` | `SanctionsOracleRequired`, `SanctionsUnchanged` |
| `buildSetSanctionsOracleCall` | `{ accountList, oracle }` | `OracleUnchanged`; non-zero is contract-checked, zero only while screening is off |

The four list builders throw before encoding if the batch is empty, holds the zero address, or
repeats an account. The contract has no length check, so an empty batch would otherwise be a
transaction that succeeds having done nothing.

Switching mode is safe at any time: the lists themselves do not change.

### `getAccountListStatus(client, { accountList, account })`

One multicall, returning every verdict the list holds on one account.

| Field | Type | Notes |
| --- | --- | --- |
| `canDeposit` | `boolean` | Not blocked, not sanctioned, and allow-listed under REGULAR or STRICT |
| `canRedeem` | `boolean` | Sanctions alone gate this, so a blocked holder still passes |
| `canReceive` | `boolean` | |
| `isAllowListed` | `boolean` | |
| `isBlocked` | `boolean` | Also what makes a holder eligible for `forceRedeem` |
| `isSanctioned` | `boolean` | |
| `mode` | `AllowlistMode` | |

Screening fails closed. An oracle that reverts, or returns anything other than 32 bytes, marks the
account sanctioned. An EOA set as the oracle returns nothing, so it sanctions everyone.

---

## OwnerRegistry

Records who owns a conduit's live queries and lets an owner wrap that claim into a transferable
ERC-721. It carries no access control of its own.

### `buildSpawnOwnerRegistryCall(parameters)`

| Parameter | Type |
| --- | --- |
| `factory` | `Address` |
| `name` | `string` |
| `symbol` | `string` |
| `deploymentSalt` | `Hex` |

Role: FACTORY_SPAWN on the factory's access control. `predictOwnerRegistryDeployment(client, parameters)`
returns the CREATE2 address.

### `buildWrapQueryCall({ ownerRegistry, query, conduit })`

Mints an ERC-721 over a live query and returns the `tokenId`. `query` must be exactly as the conduit
created it; the registry namespaces every record by `conduit`.

| Revert | Cause |
| --- | --- |
| `QueryNotRegistered` | The registry holds no record for this query |
| `UnauthorizedWrap` | The caller is not the registered owner |
| `QueryAlreadyWrapped` | A token already exists for it |
| `TransferNotAllowed` | The conduit refuses the caller a transfer to itself |
| `NonWrappableState` | The query is EMPTY, SETTLED or REJECTED |

### `getQueryClaim(client, { ownerRegistry, conduit, queryId })`

| Field | Type | Notes |
| --- | --- | --- |
| `owner` | `Address` | Zero once wrapped, or when the query was never registered |
| `isWrapped` | `boolean` | Disambiguates a zero `owner` |
| `tokenId` | `bigint` | `0n` until wrapped |

---

## Interceptions

An interception diverts a share of one asset to a list of targets.

```typescript
type Interception = {
  asset: Address
  recipients: readonly { target: Address; shareBps: bigint; chainId: bigint }[]
}
```

`shareBps` is a `bigint` here, unlike `FeeRecipient.shareBps`. An interception's recipients may total
**at most** 10000 bps; a shortfall is legal and leaves the remainder undistributed. A fee split must
total exactly 10000.

| Function | Parameters | Role |
| --- | --- | --- |
| `buildSetConduitInterceptionsCall` | `{ conduit, interceptions }` | CONDUIT_SET_INTERCEPTIONS |
| `buildSetVehicleInterceptionsCall` | `{ vehicle, interceptions }` | VEHICLE_SET_INTERCEPTIONS, scoped to the vehicle |

Both replace the stored list wholesale, so an empty array clears every rule. Both throw before
encoding if an interception's shares exceed 10000 bps or a `shareBps` is negative;
`assertInterceptions(interceptions)` is exported to run that check on its own.

A conduit's initial rules can also be set at spawn through `initialInterceptions`.

---

## Encoding helpers

`toConduitSpawnParams(parameters)` returns the `SpawnParams` tuple the ConduitFactory takes, in its
declared field order. `buildSpawnConduitCall` applies it already; reach for it only when encoding
the factory call by hand.

`queryAbiParameter` is the `Query` struct as `abi.encode` lays it out, for hashing or decoding a
query outside the helpers that already do it.
