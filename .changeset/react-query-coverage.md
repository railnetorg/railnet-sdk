---
'@railnetorg/railnet-sdk': minor
---

Added query options, a key, a prefix and a hook to **/react** for the fifteen read actions that
had none, listed in [Query options](https://sdk.railnet.org/react/queryOptions)
([#88](https://github.com/railnetorg/railnet-sdk/pull/88)).

- Access control: `usePendingDefaultAdmin`.
- Conduit: `useIsTransferable`, `useAccountListStatus`, `useQueryClaim`, `useInitialDepositAmount`,
  `useConduitInterceptions`.
- Vehicle: `useEstimateVehicle`, `useVehicleConversion`, `useVehicleInterceptions`,
  `useMorphoBlueSingleton`, `useMorphoMarketAsset`.
- MultiVehicle: `useSectorBalance`.
- Deployment predictions: `usePredictAccountListDeployment`, `usePredictFeeManagerDeployment`,
  `usePredictOwnerRegistryDeployment`.
