---
"@railnetorg/railnet-sdk": patch
---

Pin the transitive `ws` resolution to `^8.21.3`, clearing two advisories that reached the production tree through `viem › isows › ws`: a high memory-exhaustion DoS (GHSA-96hv-2xvq-fx4p, patched in 8.21.0) and a moderate uninitialized-memory disclosure (GHSA-58qx-3vcg-4xpx, patched in 8.20.1). Applied as an `overrides` entry, so the package still declares zero runtime dependencies.
