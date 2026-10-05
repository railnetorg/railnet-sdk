---
'@railnetorg/railnet-sdk': minor
---

Added a `predict…Deployment` read for every factory that lacked one: `predictAccessControlDeployment`,
`predictMultiVehicleDeployment`, `predictAaveV3VehicleDeployment`, `predictErc4626VehicleDeployment`,
`predictMorphoBlueVehicleDeployment` and `predictWrapperVehicleDeployment`, each with its query
options and `usePredict…Deployment` hook.

- They return the address the matching `buildSpawn…Call` deploys to, so a batch or a multisig
  proposal can reference the contract before its receipt exists.
- `predictMultiVehicleDeployment` returns the six contracts.
- A vehicle prediction holds only until the next spawn on the same factory, whose deployment counter
  enters the init code.
- All on `railnetActions`.
