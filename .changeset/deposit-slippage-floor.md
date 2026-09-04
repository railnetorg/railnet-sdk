---
'@railnetorg/railnet-sdk': minor
---

Let a deposit set a slippage floor, which only the redeem side could.

`prepareRedeemConduit` has always taken `outputAsset: { asset, value }`, whose value is the floor.
`prepareDepositConduit` hardcoded `value: 0n`, and `BaseVehicle._validateConstraints` rejects only
when `query.output.value > estimate` — so zero rejects nothing and every deposit accepted whatever
the vehicle produced.

- `prepareDepositConduit` takes `minOutput?: bigint`. Omitted keeps today's behaviour.
- `depositConduit` also takes `slippageBps?: number` and derives the floor itself. The pure builder
  cannot read the chain, so it takes an absolute bound; the action already reads, so it accepts a
  relative one. `PrepareDepositConduitParameters` omits `slippageBps` to keep that split explicit.
- Adds `estimateVehicle` and `baseVehicleAbi`, transcribed from the `IBaseVehicle` interface.
  A deposit floor is measured against the vehicle's own output, not `estimateConduit`'s, which is
  net of the conduit's fees — so the floor was not computable from what the SDK exposed.
- Adds `applySlippage(estimate, bps)`.

Two limits the floor does not cover, both documented by the contracts. It is checked at create time
against the create-time estimate — `MultiVehicle` adds a post-mint re-check precisely because
"the create-time check alone is not end-to-end slippage protection on this path". And it bounds the
vehicle's output only: per `Conduit.createRedeemFromConduitShares`'s natspec it "ignores the
Conduit's own fees and share-exchange rate, so it does not bound the asset the receiver ultimately
gets".
