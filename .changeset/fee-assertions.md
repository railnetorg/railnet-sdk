---
'@railnetorg/railnet-sdk': minor
---

Added `assertFeeRecipients` and `assertFees`, which validate a fee split and a rate set before a
call is built ([#41](https://github.com/railnetorg/railnet-sdk/pull/41)).

- Exported so a form can check a draft split before a call is assembled.
- Addresses are compared lowercased: the contract orders recipients as `uint160`, so a checksummed
  address would otherwise sort by case.
