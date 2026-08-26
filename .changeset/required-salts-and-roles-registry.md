---
"@railnetorg/railnet-sdk": minor
---

Make every salt an explicit parameter, and export a role registry.

**Breaking.** `querySalt`, `deploymentSalt` and `salts` are now required on the four `spawn*` actions and their builders, on `deployMultiVehicle`, and `salt` is required on `prepareDepositConduit` / `prepareRedeemConduit`.

- **A `prepare*` is now a pure function of its inputs.** Nothing is drawn from the clock, so two calls with the same parameters encode the same calldata — which is what makes a prepared call comparable against a simulation and replayable after a failure.
- **`prepareSpawnMultiVehicle` derived seven deployment salts from one `Date.now()`.** A spawn that failed midway lost the timestamp, so the caller could not re-derive the salts and could never retry against the same seven addresses. A deployment salt fixes an address permanently; the caller has to own it.
- **`depositConduit` and `redeemConduit` keep a default**, because a query salt is disposable and the action makes the full round trip itself — but it now comes from `crypto.getRandomValues`, not the clock. Two deposits from the same account in the same millisecond previously shared a `sourceSalt`, so the second reverted. Harmless for a human signing one at a time, reachable by a script or a batch.
- **Salts no longer interpolate `name` or `symbol`.** `conduit-deploy-${symbol}-${now}` made a salt look deterministic when the timestamp silently broke that; a caller could reasonably expect the same symbol to redeploy to the same address.

Adds `randomSalt()` for generating them.

Adds `ROLES` (`readonly { name: string; hash: Hex }[]`) and `roleName(hash)`, so consumers labelling a role hash or building a role picker no longer reconstruct the list by introspecting the exports. A test asserts the registry stays in step with the named constants in both directions.

None of the above was a vulnerability: the contracts mix `msg.sender` into every salt — `Conduit.sol` for queries, `CoreFactory._computePermissionedSalt` for deployments — so a predictable salt let nobody front-run an address or occupy another account's queryId. These were operability and determinism defects.
