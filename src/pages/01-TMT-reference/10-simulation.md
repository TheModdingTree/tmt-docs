# Simulation

TMT's simulation can be configured through `defineMod.simulation`, and per-tick gameplay behavior can be added to `update`, `automate`, and passive generation callbacks.

## Time

- `delta` {type: number} {required}\
Elapsed time between this tick and the last, in seconds. Can be much larger than the usual timer interval in some cases.

The timer measures actual elapsed time with `performance.now()`. A requested 50 ms interval doesn't guarantee that every update receives `0.05`.

## Update Order

Each advance uses this order:

1. Stop if the engine is fatal, already advancing, or won without Keep Going.
2. Increment `player.timePlayed` and every layer's `resetTime`.
3. Evaluate `canGeneratePoints`. When enabled, add `pointGain * delta` to points and clamp the result to at least zero.
4. Run the mod's `update(context, delta)`.
5. In ascending row order, check layer unlocks, apply passive generation, and run layer updates.
6. In descending row order, run layer automation.
7. In ascending row order, award milestones and then achievements in declaration order.
8. Evaluate endgame if the player hasn't already won, validate state, and save on a win.

## Using delta

Multiply rates by delta time when adding your own per-second production:

```js
update(context, delta) {
    const state = context.layerState;
    state.energy = state.energy.add(new Decimal(5).mul(delta));
}
```

Adding `5` without multiplying by `delta` would award five per callback, making production depend on timer frequency and not consider offline time at all.

`automate(context)` has no delta argument. It runs once per advance and is suited to issuing actions such as purchases or resets.

## Locked and Deactivated Layers

The following table explains how locked and deactivated layers handle per-tick behavior:

| Work | Locked layer | Deactivated layer |
| --- | --- | --- |
| Reset Timer | Advances | Advances |
| Unlock Check (while locked) | Runs | Runs |
| Passive Generation and Update | Run | Skipped |
| Automation | Runs | Skipped |
| Milestone and Achievement Checks | Checked | Skipped |

## Offline Progress

Loading computes elapsed time since `savedAt`, clamps it to at least zero, and limits it to `offlineLimitHours * 3600`. The saved `offlineProgressEnabled` option can disable this

:::note Offline Progress is One Tick
All offline time is passed through one ordinary simulation advance. The tick length cap doesn't apply. Mod and layer updates run once with the offline `delta`.

For example, one hour offline gives a delta of `3600` seconds. A linear rate of five per second grants `18000`. An automation callback that buys one upgrade runs once, not once for each missed tick. Thresholds, compounding, and resets can therefore produce different results from an hour of online activity.
:::

New games, failed loads, and imports don't receive offline progress.