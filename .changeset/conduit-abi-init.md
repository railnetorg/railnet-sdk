---
"@railnetorg/railnet-sdk": patch
---

Removed `init` from `conduitAbi`. No deployed Conduit has it in its dispatcher: it belongs to the helper contract `initialize` delegates to, so calling it on a Conduit reverts.

- `functionName: 'init'` no longer compiles against `conduitAbi`.
