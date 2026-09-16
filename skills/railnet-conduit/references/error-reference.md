# Conduit Error Reference

Common contract revert errors encountered when interacting with Railnet conduits.

| Error | Description |
| :--- | :--- |
| `DisabledConduit()` | The conduit has not been enabled yet. Only the ConduitFactory can enable it, once the seed deposit settles: inline in `spawn()` for a synchronous vehicle, or via `buildFinalizeConduitDepositCall()` for an async one. |
| `MissingRole(role, scope, caller)` | The caller is missing a required access control role (e.g., `VEHICLE_STEAM_DEPOSIT`). |
| `InsufficientAllowance()` | A factory spawn was not approved for its initial deposit. Raised by the factories only: a conduit deposit short on allowance reverts with the token's own ERC-20 error. |
| `InvalidState(expected, actual)` | The query is in an incorrect STEAM state for the requested action. |
| `MaxDepositTooLow(input, maxDeposit)` | The deposit amount exceeds the current conduit capacity. |
| `MaxRedeemTooLow(input, maxRedeem)` | The redemption amount exceeds the current conduit capacity. |
| `ZeroInputValue()` | The input amount for the operation is zero. |
| `InvalidCaller(expected, actual)` | The function is restricted to one address (e.g. `enable()`, which accepts only the ConduitFactory). |
| `InvalidReceiver()` | The receiver address is the zero address. |
| `QueryAlreadyExists(queryId)` | A query with the provided salt already exists. Use a unique salt. |
| `NotAllowed(from, to)` | The transfer is blocked by the `AccountList` restriction. |
| `TransferNotAllowed(from, to)` | The transfer is blocked because the conduit was spawned with `transferEnabled: false`. |
| `InvalidQueryOwnerOrReceiver(owner, receiver)` | The query structure is invalid (e.g., owner and receiver mismatch). |
| `VehicleNotAuthorized(vehicle)` | The vehicle is not authorized on the multi vehicle's VehicleManager. Authorize it with `buildAuthorizeVehicleCall`. |
| `IllegalTransition(from, to)` | An invalid STEAM state transition was attempted on a query. |
