---
"@railnetorg/railnet-sdk": minor
---

Added an optional `deployer` argument to every spawn receipt helper (`extractAccessControlAddress`, `extractFeeManagerAddress`, `extractAccountListAddress`, `extractOwnerRegistryAddress`, the four vehicle helpers, `extractMultiVehicleContracts`, `extractConduitAddress`). With it, the helper reads the spawn of that account only; without it, it still returns the first spawn in the receipt.
  - Pass it whenever the transaction can carry someone else's call: a bundle of user operations, or a multisig execution wrapped by another contract.
