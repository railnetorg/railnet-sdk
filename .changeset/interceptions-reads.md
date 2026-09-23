---
'@railnetorg/railnet-sdk': minor
---

Added `getConduitInterceptions` and `getVehicleInterceptions`, which read the interception rules
currently stored ([#83](https://github.com/railnetorg/railnet-sdk/pull/83)).

- `buildSetConduitInterceptionsCall` and `buildSetVehicleInterceptionsCall` replace the list
  wholesale, so an edit of one rule starts from this read.
- Both on `railnetActions`.
