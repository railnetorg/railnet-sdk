---
'@railnetorg/railnet-sdk': patch
---

Fixed twelve documentation pages listing `account` as a call-builder parameter ([#52](https://github.com/railnetorg/railnet-sdk/pull/52)). Builders take
no account; it goes to `simulateContract`.

```diff
- buildProcessConduitQueryCall({ conduit, account, query })
+ simulateContract(client, { ...buildProcessConduitQueryCall({ conduit, query }), account })
```
