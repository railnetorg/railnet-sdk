---
'@railnetorg/railnet-sdk': minor
---

Added `assertFeeRecipients` and `assertFees`, which validate a fee split and a rate set before a
call is built ([#41](https://github.com/railnetorg/railnet-sdk/pull/41)).

- Both are what the builders call, exported so a form can check a draft without assembling a call.
- Addresses are compared lowercased: the contract orders recipients as `uint160`, so a checksummed
  address would otherwise sort by case.
