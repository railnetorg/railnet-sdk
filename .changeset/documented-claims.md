---
'@railnetorg/railnet-sdk': patch
---

Fixed nine documented claims the contracts contradict, four of which broke a transaction for anyone
following them ([#52](https://github.com/railnetorg/railnet-sdk/pull/52)).

- `getInitialDepositAmount` named three factories of the seven that pull the deposit, and documented
  a `0n` return the read cannot produce: an unauthorized asset reverts `AssetNotAuthorized`.
- `buildSpawnConduitCall` documented no role. It needs CONDUIT_SPAWN, not the FACTORY_SPAWN every
  other spawn builder names.
- `buildSetQueuesCall` documented no validation against eight on-chain checks, one of which rejects
  the `2n ** 256n - 1n` the SDK teaches as "unlimited" everywhere else.
- The three scoped-role builders required the default admin. The contract takes the role's own
  admin, held globally or scoped to the same scope, so the docs ruled out a delegation it allows.
- `predictFeeManagerDeployment` said only `deploymentSalt` moved the address. Every factory folds
  its whole initializer into the init code the CREATE2 hashes.
