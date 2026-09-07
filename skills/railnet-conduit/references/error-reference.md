# Conduit Error Reference

Common contract revert errors encountered when interacting with Railnet conduits.

| Error | Description |
| :--- | :--- |
| `DisabledConduit()` | The conduit has not been enabled yet. Call `enableConduit()` first. |
| `MissingRole(role, scope, caller)` | The caller is missing a required access control role (e.g., `VEHICLE_STEAM_DEPOSIT`). |
| `InsufficientAllowance()` | The factory or conduit is not approved to spend the required assets. |
| `InvalidState(expected, actual)` | The query is in an incorrect STEAM state for the requested action. |
| `MaxDepositTooLow(input, maxDeposit)` | The deposit amount exceeds the current conduit capacity. |
| `MaxRedeemTooLow(input, maxRedeem)` | The redemption amount exceeds the current conduit capacity. |
| `ZeroInputValue()` | The input amount for the operation is zero. |
| `InvalidCaller(expected, actual)` | The function was called by an unauthorized address (e.g., `enable()` called by non-owner). |
| `InvalidReceiver()` | The receiver address is the zero address. |
| `QueryAlreadyExists(queryId)` | A query with the provided salt already exists. Use a unique salt. |
| `NotAllowed(from, to)` | The transfer is blocked by the `AccountList` restriction. |
| `TransferNotAllowed(from, to)` | The transfer is blocked because the conduit was spawned with `transferEnabled: false`. |
| `InvalidQueryOwnerOrReceiver(owner, receiver)` | The query structure is invalid (e.g., owner and receiver mismatch). |
| `VehicleNotAuthorized(vehicle)` | The specified vehicle is not authorized by the factory. |
| `IllegalTransition(from, to)` | An invalid STEAM state transition was attempted on a query. |
