---
"@railnetorg/railnet-sdk": patch
---

Docs: correct the five call sites and four prose lines that showed write actions taking two clients. Every action takes `(client, parameters, options?)` — a single client that simulates and signs — as the skills already stated and the code always did.
