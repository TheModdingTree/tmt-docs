# Layers and Resets

A 3.x layer separates metadata, starting state, and gameplay content. Move the content into `setup`, then check reset behavior before adding the rest of the layer's features.

## From addLayer to defineLayer

A small 2.x layer might look like this:

```js
addLayer("p", {
    name: "Prestige",
    symbol: "P",
    color: "#4caf50",
    row: 0,
    resource: "Prestige Points",
    startData() {
        return { unlocked: true, points: new Decimal(0) };
    },
    baseResource: "points",
    baseAmount() { return player.points; },
    requires: new Decimal(10),
    type: "normal",
    exponent: 0.5,
    upgrades: {
        11: { title: "Better Tools", description: "Double point gain!", cost: new Decimal(1) }
    }
});
```

Its 3.x version can be `src/prestige.js`:

```js
import { defineLayer, points } from "tmt";

export const prestige = defineLayer({
    id: "p",
    name: "Prestige",
    symbol: "P",
    color: "#4caf50",
    row: 0,
    resource: "Prestige Points",

    startState: () => ({ unlocked: true }),

    setup: define => define({
        reset: {
            type: "normal",
            resource: points,
            requires: 10,
            exponent: 0.5
        },
        upgrades: {
            "11": {
                title: "Better Tools",
                description: "Double point gain!",
                cost: 1
            }
        }
    })
});
```

The layer keeps the ID `"p"`, but its exported handle variable doesn't have to have the same name. The mod includes the `prestige` handle and applies the upgrade's multiplier in `pointGain`, as shown in [Project and Mod Setup](04/00/00).

Starting points default to zero. `setup` calls `define` once, it isn't a per-tick hook.

## Move the Layer Fields

| 2.x | 3.x |
| --- | --- |
| `startData` | `startState` on the outer layer definition |
| `type`, `requires`, `exponent`, `base` | Corresponding fields inside `setup`'s `reset` |
| `baseAmount`, `baseResource` | One `reset.resource` handle |
| `gainMult` | `reset.gainMultiplier` |
| `gainExp` | `reset.gainExponent` |
| `directMult` | `reset.finalMultiplier` |
| `softcap` | `reset.softcapStart` |
| `softcapPower` | `reset.softcapPower` |
| `canBuyMax` | `reset.canMax` for static resets |
| `getResetGain` | `reset.gain(context)` |
| `getNextAt` | `reset.nextRequirement(context)` |
| `canReset` | `reset.canReset(context)` for custom resets |
| `prestigeButtonText` | `ui.resetButtonText` |
| `resetDescription` | `ui.resetDescription` |
| `effect`, `effectDescription` | Same names inside setup content |
| Definition `deactivated` | Saved state `deactivated`, initialized through `startState` |
| `update(diff)` | `update(context, delta)` inside setup content |
| `automate()` | `automate(context)` inside setup content |

Use the exported `points` for main currency, another layer's `.points` for its currency, or [defineResource](01/03) for a custom resource. A resource setter also tells the engine how to clear that balance during a reset.

## Unlocking is Separate

In the old prestige flow, a first reset could unlock a layer. In 3.x, set its initial availability in `startState` or provide an `unlock` calculation in setup:

```js
unlock: context => context.player.points.gte(10)
```

The starting layer defaults to unlocked and all other layers default to locked. Once `unlock` succeeds, the saved flag stays true. Tree visibility doesn't itself unlock a layer.

## Check the Formula

The normal and static formulas remain familiar, but don't assume every old edge case survives:

- Static resets need an explicit `base` greater than one.
- Formula factors must be positive and finite. Use a custom reset for behavior which depended on zero, negative, or infinite factors.
- Normal resets have **no default softcap** unless you supply `softcapStart`. Carry over an old softcap deliberately, including an old default your balance depended on.
- `gain` and `nextRequirement` overrides receive context. The old `getNextAt(canMax, useType)` calling convention isn't carried over.
- `roundUpCost` has no direct field. Put rounding into an explicit requirement calculation if the game needs it.
- A custom reset supplies `gain`, `canReset`, and `nextRequirement`. Its gain isn't automatically rounded down.

Compare results just below and above the first requirement, around a softcap, and at several static amounts. For static resets, `gainMultiplier` still multiplies cost, so a larger value makes the reset more expensive.

The exact formulas are in [defineLayer](01/01).

## Passive Generation and Automation

:::warning Passive Generation is Now a Rate
In 2.x, `passiveGeneration` multiplied the layer's calculated reset gain. In 3.x, it is the actual currency granted per second. Copying `passiveGeneration: 0.1` directly would grant only 0.1 currency per second.

To preserve ten percent of reset gain per second, use:

```js
passiveGeneration: context => context.getResetGain().mul(0.1)
```
:::

There is no `autoPrestige` or `autoUpgrade`. Add the relevant automation to `automate`, keeping your old eligibility conditions:

```js
automate(context) {
    if (!context.layerState.unlocked) return;
    if (context.canReset()) context.reset();
    context.buyUpgrade("11");
}
```

The commands perform their own affordability checks. Their order matters, especially when a reset changes resources used by the purchase.

## Replace doReset and layerDataReset

The old, very convoluted, doReset system is completely gone.

The reset's `targets` choose which other layers are rebuilt. By default, these are layers with lower logical rows. `only` replaces that default set, `include` adds targets, and `exclude` removes them.

On a target layer, `retention` now selects which state survives reset. For example, keep best currency, all earned milestones, upgrade `"11"`, and a custom automation setting:

```js
retention: {
    best: true,
    milestones: true,
    upgrades: ["11"],
    custom: ["auto"]
}
```

Retention can also use a callback and inspect `context.source` to choose rules for a particular incoming layer.

`retention: true` keeps all previous state, while `false` uses fresh defaults. Availability flags survive resets. There is no public `layerDataReset` call to place inside every old `doReset` hook.

A normal prestige doesn't reset itself. For a forced reset which does, use `context.forceReset({ resetSource: true })` from that layer's write context. The options object is required even when empty, and a forced reset grants no prestige currency.

## Replace onPrestige Carefully

`onReset(context)` runs for both source and incoming resets. Check its metadata if the old action only belonged to a successful prestige:

```js
onReset(context) {
    if (context.kind !== "self" || context.cause !== "prestige") return;
    context.layerState.energy = context.gain.add(context.layerState.energy);
}
```

In 2.x, `onPrestige(gain)` ran before the source received its currency. In 3.x, the source receives currency and updates its records before its hook runs. Incoming hooks see reset state and can inspect `previousTargetState`.

The ordinary sequence is source gain and hook, incoming targets from higher rows downward, base-resource clearing, then the source timer reset.

Next, move the feature collections in [Gameplay Features](04/00/03).