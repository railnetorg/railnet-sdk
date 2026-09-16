---
'@railnetorg/railnet-sdk': minor
---

Added `getRailnetError`, which reads a revert out of whatever viem threw and returns its decoded
name, arguments and a hint, or `null` when the failure was not a contract revert ([#41](https://github.com/railnetorg/railnet-sdk/pull/41)).

```ts
const reverted = getRailnetError(error)
if (reverted?.name === 'InsufficientAllowance') return approveFirst()
```

- `railnetErrorHints` is the hint table itself, keyed by error name.
- `protocolErrorsAbi` is the fallback fragment it decodes against. viem decodes a revert using the
  ABI of the call, so an error the called contract does not itself declare arrives as raw bytes.
- Six such errors now decode, `InvalidOutput` and `InvalidEstimation` among them. Both are reverted
  from `ErrorLib` through assembly, which solc lists on no contract at all.
