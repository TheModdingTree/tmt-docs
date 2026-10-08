# Context and State

In 2.x, most game code reads global `player`, `layers`, and `tmp` objects. In 3.x, a callback receives a context with the state and operations it can use.

A layer handle identifies a layer. It isn't the layer's saved state, so `prestige.points` is a currency resource handle rather than the player's current balance.

## Reading State

| 2.x | 3.x |
| --- | --- |
| `player.points` | `context.player.points` |
| `player.p.points` | `context.stateOf(prestige).points` |
| `player[this.layer].points` | `context.layerState.points` in a layer or item callback |
| `this.layer` | `context.layer` |
| `this.id` | `context.id` in an item callback |
| `tmp.p.effect` | `context.getLayerEffect(prestige)` |
| `tmp.p.resetGain` | `context.getResetGain(prestige)` |
| `tmp.p.nextAt` | `context.getNextRequirement(prestige)` |
| `tmp.p.canReset` | `context.canReset(prestige)` |

There is no replacement for the whole `tmp` object. Use the relevant getter or share a calculation through a module function. See [context](01/06) for a full breakdown and list of getters and setters.

The engine doesn't bind the old definition object as `this`. A 2.x method which calls `this.cost()` or reads `this.layer` needs to use context or an ordinary helper.

## Global Helpers Become Context Methods

These examples use an imported handle named `prestige` whose layer ID is `"p"`:

| 2.x | 3.x |
| --- | --- |
| `hasUpgrade("p", 11)` | `context.hasUpgrade("11", prestige)` |
| `upgradeEffect("p", 11)` | `context.getUpgradeEffect("11", prestige)` |
| `getBuyableAmount("p", 11)` | `context.getBuyableAmount("11", prestige)` |
| `setBuyableAmount("p", 11, value)` | `context.stateOf(prestige).buyables["11"] = new Decimal(value)` |
| `buyableEffect("p", 11)` | `context.getBuyableEffect("11", prestige)` |
| `hasMilestone("p", 0)` | `context.hasMilestone("0", prestige)` |
| `hasAchievement("p", 11)` | `context.hasAchievement("11", prestige)` |
| `inChallenge("p", 11)` | `context.inChallenge("11", prestige)` |
| `challengeCompletions("p", 11)` | `context.getChallengeCompletions("11", prestige)` |
| `challengeEffect("p", 11)` | `context.getChallengeEffect("11", prestige)` |
| `getClickableState("p", 11)` | `context.getClickableState("11", prestige)` |
| `setClickableState("p", 11, value)` | `context.setClickableState("11", value, prestige)` |
| `buyUpgrade("p", 11)` | `context.buyUpgrade("11", prestige)` |
| `doReset("p")` | `context.reset(prestige)` |
| `doReset("p", true)` | Review `context.forceReset({ layer: prestige })` and its source-reset behavior |

Notice the new order: item ID first, layer handle last. This is because the layer defaults to the calling layer, allowing you to omit the handle entirely in self-referencing checks. 

Use strings for item IDs, even if you keep keys such as `"11"` from the old game.

Effect getters can return `undefined` when the effect is absent or suppressed. Use the neutral value appropriate to your formula, such as `context.getUpgradeEffect("11") ?? 1` for a multiplier. Effects still need to be applied by your own calculations.

## Reading and Writing Have Different Jobs

Callbacks such as costs, effects, descriptions, and unlock conditions read state. Hooks such as `update`, `onClick`, and `onPurchase` can change it.

This old update:

```js
update(diff) {
    player[this.layer].energy = player[this.layer].energy.add(diff);
}
```

becomes this inside the layer's setup content:

```js
update(context, delta) {
    const state = context.layerState;
    state.energy = state.energy.add(delta);
}
```

Initialize `energy` with `new Decimal(0)` in `startState`. Both `diff` here and the new `delta` measure seconds.

Don't carry a write hidden inside a 2.x effect or display callback into the new read callback. Move that work into a write hook. 

:::warning Contexts Expire
A context and any methods run on it belong to the current callback. Don't keep them in module variables, timers, or promises. A later callback must use its own context. After a reset replaces layer state, look it up again before writing.
:::

## Custom Saved Fields

Move `startData` fields into `startState`. Move fields from `addedPlayerData()` into a layer too. The root player field set is immutable.

For example, a saved automation setting and a secondary balance can start like this:

```js
startState: () => ({
    unlocked: true,
    auto: false,
    energy: new Decimal(0)
})
```

Ownership storage has also changed. Upgrades, milestones, and achievements use records such as `{ "11": true }`, not arrays of owned IDs. Use the context helpers for gameplay checks and convert the old arrays when converting saves.

Saved custom values replace matching defaults as a whole. Adding a field inside a saved nested object doesn't recursively fill it into old saves. See [Loading and Migration](01/09?s=loading-and-migration) and [Saves and Release Checks](04/00/05).

## Timing and Failures

Layer `update(context, delta)` handles elapsed time while `automate(context)` has no delta argument. Locked layers can still update and automate. Deactivated layers skip that work.

Offline progress is one tick. Code which depended on repeatedly buying one item over many offline ticks needs a deliberate bulk calculation or a different balance. Returning `true` from an old auto-buy condition won't recreate that behavior by itself.

Invalid callback results, illegal writes, and thrown hooks stop the game. Fix the code and reload.

Next, port the layer definition in [Layers and Resets](04/00/02).