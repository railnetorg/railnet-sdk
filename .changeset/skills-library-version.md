---
"@railnetorg/railnet-sdk": patch
---

Point the skills' `library_version` metadata at 0.3.0. It still declared 0.1.0, which is what `intent stale` was flagging after each release. Metadata only — no skill content changed.
