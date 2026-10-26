# Gameplay Features

Put feature collections inside the object passed to `define` in layer setup. Most collections are still objects keyed by ID, so you can keep old IDs while porting.

Use string IDs in context calls and references. A key such as `"11"` no longer automatically places an item in row 1, column 1. Layout is handled separately.

## Upgrades

`title`, `description`, `cost`, `unlocked`, `effect`, and `onPurchase` still exist, but their callbacks receive context. `marked` becomes `mark` on features which support it.

Replace `currencyInternalName`, `currencyLayer`, and `currencyLocation` with one `currency` resource handle. Use the exported `points`, a layer's `.points`, or a handle from [defineResource](01/03).

A normal purchase deducts the cost and records ownership. A custom `pay(context, cost)` replaces payment, and `onPurchase(context)` runs after the purchase. Don't repeat the standard payment in `onPurchase`.

`canAfford` adds a condition. Returning true doesn't bypass the currency check.

## Buyables

3.x has a default buy-one action: pay the current cost, increase the amount by one, and call `onPurchase`. An ordinary 2.x buyable can often lose its custom `buy` entirely.

For example, this setup field defines a buyable whose price doubles each time:

```js
buyables: {
    "11": {
        title: "Generator",
        cost: context => new Decimal(2).pow(context.getBuyableAmount("11")),
        display: context => `You own ${format(context.getBuyableAmount("11"))} generators`,
        effect: context => context.getBuyableAmount("11").add(1)
    }
}
```

Import `Decimal` and `format` from `"tmt"`. The cost defaults to this layer's currency. Apply the generator effect in your production formula wherever the old effect was used.

The old `cost(x)` and `effect(x)` arguments become context. Read the current amount through `context.getBuyableAmount`, or move a calculation for a hypothetical amount into a helper such as `costAt(amount)`.

:::warning Custom buy Controls Payment
If you keep `buy(context, cost)`, it replaces both the default payment and amount increment. Either omit it and use the default action, or implement both operations yourself. Use `onPurchase` for extra work after a normal purchase.
:::

Buy Max, selling, and respec still need authored behavior. A custom Buy Max doesn't automatically call `onPurchase` for every level.

Move respec configuration out of the buyables collection:

| 2.x buyables-level field | 3.x setup field |
| --- | --- |
| `respec` | `buyableRespec.onRespec(context)` |
| `respecText` | `buyableRespec.label` |
| `respecMessage` | `buyableRespec.confirmation` |
| `showRespec` | `buyableRespec.unlocked` |

The respec hook controls refunds, amount changes, and resets. Put any saved respec accounting in your custom layer state, the engine doesn't maintain the old `spentOnBuyables` field for you.

## Clickables

Initialize an item's value with `initialValue`. Read it through `context.value`, and replace it with `context.setValue`:

```js
clickables: {
    "11": {
        initialValue: false,
        display: context => context.value ? "Automation: On" : "Automation: Off",
        onClick(context) {
            context.setValue(!context.value);
        }
    }
}
```

Clickable values now support any savable value, including nested data. 

Do note that even in a write hook, `context.value` is protected, you must use the setter.

`onHold(context, interval)` receives delta seconds. Use that interval for a per-second action instead of relying on the old fixed call frequency.

There is no clickables-level master-button field. Define an ordinary clickable for that action and place it where you want it in the layout.

## Challenges

| 2.x | 3.x |
| --- | --- |
| `name` | `title` |
| `challengeDescription` | `description` |
| `rewardEffect` | `effect` |
| Goal currency locator fields | `goalResource` |
| `countsAs: [11, 12]` | `countsAs: ["11", "12"]` |
| Numeric result from `canComplete` for bulk completions | Boolean `canComplete` plus `completionGain` |
| `onComplete()` | `onComplete(context, gained, total)` |

:::note Challenge Goals Use the Layer Currency by Default
Old goal-based challenges commonly used points. In 3.x, specify `goalResource: points` when that's what the goal should check.
:::

For example, after importing `points`:

```js
challenges: {
    "11": {
        title: "Dilation",
        description: "Main point gain is rooted",
        goal: 100,
        goalResource: points,
        goalDescription: "Reach 100 Points",
        rewardDescription: "Double point gain!",
        effect: () => 2
    }
}
```

In the mod's `pointGain`, use `context.inChallenge("11", prestige)` for the penalty and `context.getChallengeEffect("11", prestige) ?? 1` for the reward multiplier.

## Milestones and Achievements

Keep milestone `requirementDescription`, `effectDescription`, and `done`, and add context to callbacks. Achievement `name` becomes `title`. Use `description` for an achievement explanation.

Milestone toggles are now controlled through getters and setters. For example, in a layer whose `startState` contains `auto: false`, a milestone can contain:

```js
toggles: [{
    label: "Auto Prestige",
    value: {
        get: context => context.layerState.auto,
        set(context, value) { context.layerState.auto = value; }
    }
}]
```

Keep the milestone check in your automation if it controls permission to automate. A saved toggle doesn't itself prove the milestone is currently active.

The old per-layer `milestonePopups` and `achievementPopups` fields aren't supported. `defineMod.ui.notifications` configures the shared popup system.

## Grids

The old grid ID `101` becomes `"1:1"`, `102` becomes `"1:2"`, and `201` becomes `"2:1"`. Convert saved keys too.

| 2.x | 3.x |
| --- | --- |
| `cols` | `columns` |
| `getStartData(id)` | `startData(context)` |
| `getDisplay(data, id)` | `display(context)` |
| `getTitle`, `getTooltip`, `getStyle`, `getEffect` | `title`, `tooltip`, `style`, `effect` |
| `getUnlocked`, `getCanClick` | `unlocked`, `canClick` |
| `onClick(data, id)` | `onClick(context)` |
| `maxRows`, `maxCols` | Unsupported|

Cell context supplies `row`, `column`, `key`, and `data`. For example:

```js
grid: {
    rows: 2,
    columns: 2,
    startData: () => 0,
    display: context => String(context.data),
    onClick(context) {
        context.setGridData(context.key, context.data + 1);
    }
}
```

Use `context.getGridData(1, 1)` for coordinates, or `context.getGridData("1:1")` for a key. From a mod context, also pass the layer handle.

## Other Feature Changes

- Infoboxes keep `title` and `body`. Update their callbacks to use context.
- Bars use string directions such as `"right"` and `"up"`. Replace old direction globals.
- Feature branches use IDs or `{ target, color, width }` objects. Replace positional branch tuples and numeric theme colors.

Check the relevant [defineLayer fields](01/01) rather than copying every old property. Some 2.x feature-specific display and tooltip fields have no corresponding field on the new feature.

Next, arrange the converted features in [Pages and the Tree](04/00/04).