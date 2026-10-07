# Troubleshooting

Something isn't working? Start by finding the error as described below. Most problems become much easier to solve once you know which file or callback failed.

## Find the Error

Open your browser's developer tools and select `Console`. Refresh the page, then repeat the action which causes the problem. Start with the first error, later messages may be consequences of it.

TMT errors often include a property path pointing to your definition or a callback. Look up that property in [the reference](01), then check the value your code supplies. If the message says TMT couldn't boot, expand the error's cause to find the underlying failure.

For files which won't load, use the `Network` tab and refresh again. Check the failed request's address, status, and response. An HTML error page returned for a JavaScript file is a path or hosting problem.

After fixing the code, reload the page.

## The Local Game Won't Open

Run the project through the runtime, as shown in [Creating a Game](00/00). Opening `index.html` directly gives you a `file://` address, which doesn't provide the web server the game needs.

If the launcher reports missing submodules, run this from the project folder:

```sh
git submodule update --init --recursive
```

The runtime serves your game at `http://localhost:8080/`. If the browser didn't open automatically, go there yourself.

If the runtime reports that the address is already in use, stop another running copy of the runtime or the other program using port 8080, then try again. Closing a browser tab doesn't stop the runtime.

## My Edits Don't Appear

Save the file in your editor and refresh the browser. The runtime doesn't refresh the page automatically.

If that doesn't help, check that the running project is the one you're editing. On a published site, check that you committed and pushed the file and that the latest deployment succeeded.

Changing `startState` doesn't replace values already present in a save. For example, changing the initial energy from `0` to `10` won't give an existing player ten energy. See [Loading and Migration](01/09?s=loading-and-migration).

## A Definition Is Rejected

Check that the field is in the right part of the definition. Layers put gameplay features inside `setup`, and item collections such as `upgrades` are keyed objects:

```js
setup: define => define({
    upgrades: {
        doubleGain: {
            title: "Better Tools",
            description: "Double main point gain.",
            cost: 1
        }
    }
})
```

Unknown configuration fields and explicit `undefined` values are rejected. Leave out a field you aren't using. For a callback, check every branch returns a value accepted by that field. A block-bodied arrow function needs `return`:

```js
pointGain: context => {
    return context.stateOf(prestige).points.add(1);
}
```

## A Layer or Feature Doesn't Appear

Check these separately:

1. Registration: import the layer handle and include it in `defineMod.layers`. Include nodes in `defineMod.nodes`.
2. Tree placement: check the layer's `tree.row`, `tree.position`, and `tree.shown`, or the node's `row`, `position`, and `shown`. The mod's `ui.mode: "single"` hides the main tree. For an embedded tree, check its `source`, `root`, `depth`, `include`, and `exclude` settings.
3. Availability: check the layer's saved `unlocked` state and the relevant visibility and deactivation conditions. Drawing a node doesn't unlock its layer.
4. Page layout: a custom `ui.page` replaces the default page. Include a section for each feature collection you want displayed.

For example, defining clickables doesn't make them appear in a custom page unless that page includes them:

```js
ui: {
    page: [
        { type: "section", feature: "main" },
        { type: "section", feature: "clickables" }
    ]
}
```

Use the same item IDs throughout your code. An item keyed as `doubleGain` is addressed as `"doubleGain"`. Numeric-looking IDs such as `"11"` are still strings when passed to context methods.

See [defineMod](01/00) for registration and tree/single-page mode, [defineLayer](01/01) for availability, tree settings, and page sections, and [defineNode](01/02) for nodes.

## An Upgrade Doesn't Change Production

An upgrade's description only displays text. An `effect` calculates a value, but the engine doesn't automatically apply that value to point gain or another formula.

For a simple doubling upgrade, your mod's point gain might be:

```js
pointGain(context) {
    let gain = context.stateOf(prestige).points.add(1);
    if (context.hasUpgrade("doubleGain", prestige)) {
        gain = gain.mul(2);
    }
    return gain;
}
```

This uses an imported `prestige` handle with an upgrade named `doubleGain`. If you declared an `effect` instead, read it with `context.getUpgradeEffect("doubleGain", prestige)` and apply it in the formula. That getter can return `undefined` while the upgrade isn't owned or its layer is deactivated, so handle the absent effect.

See [Context](01/06) for ownership checks and effect getters.

## A Callback Reports Read-Only or Expired State

Calculations such as `pointGain`, `cost`, and display callbacks read state. Change state in write hooks such as `update` or `onClick`, using the context passed to that hook.

Contexts and their state views only last for the current synchronous callback. Don't store them in a variable, reuse them inside `setTimeout`, or access them after `await`. Author callbacks can't be `async` either. For a delayed confirmation, use the engine's [modal callbacks](01/08) and the fresh context they receive.

A reset may replace a layer's state. After an action which can reset that layer, get its state again through `context.stateOf(handle)` before writing to it.

Fix the callback and reload after an error.

## Production Is Wrong or Stops

Decimal calculations return a result. Assign it back when changing a balance:

```js
update(context, delta) {
    const state = context.layerState;
    state.energy = state.energy.add(delta);
}
```

Calling `state.energy.add(delta)` without assigning the result leaves the balance unchanged. Use Decimal methods such as `.add`, `.mul`, and `.gte` instead of ordinary arithmetic and comparison operators.

`delta` is elapsed time in seconds. The example grants one energy per second. Adding a fixed amount per callback makes the rate depend on update frequency. The engine already multiplies `pointGain` and `passiveGeneration` by elapsed time, so those fields should return rates per second.

If production has stopped, check the first console error, `canGeneratePoints` for points, and `deactivated` for layer production. Reaching endgame pauses simulation until the player chooses to keep going. Merely locking a layer doesn't stop its update callback.

Offline progress runs one update with the offline time. Automation which buys one item runs once, not once per missed live tick. Check the player's offline progress option and `info.offlineLimitHours` too. See [Simulation](01/10) for update order and offline behavior.

## My Save Disappeared

Check the address before resetting anything. Saves belong to a browser profile, a domain, and the game's `info.id`.

The runtime uses `http://localhost:8080/`, so restarting it doesn't change the save location. Using `127.0.0.1` instead of `localhost`, moving online, or changing domains sets a different storage location. Changing `info.id` selects a different save within that location.

If the old address is still available, open the game there and export its save, then import it at the new address. Keep exported backups before changing where you play. Browser saves aren't automatically shared between computers or browser profiles.

## The Game Can't Load or Save

:::warning Keep the Original Save
Export the stored data offered by recovery before trying a reset. Clearing browser storage or using Hard Reset can remove the save you're trying to recover.
:::

A corrupt or incompatible automatic save opens recovery and blocks ordinary saving so the original text isn't overwritten. The fresh state shown during recovery doesn't mean the old data was deleted. Fix a migration or compatibility problem, then reload. Alternatively, import a known working save through recovery. See [Saves and Errors](01/09).

A gameplay fatal error is different. Fix the failing code and reload before trying to import or reset.

If the console says `Uint8Array.fromBase64` or `toBase64` is unavailable, update your browser. The engine uses those browser APIs.

When a code change breaks an older save, use `saveVersion` and `migrateSave` to convert its data. Changing `info.version` only changes the displayed version. See [defineMod](01/00) for an example.

## Asking for Help

If you're still stuck, note the first error and its property path, what you did to trigger it, and the smallest relevant piece of code. Note your browser and engine version, whether the problem happens locally or online, and whether it also happens with a fresh save.

For a problem tied to an existing save, keep an exported copy which reproduces it. A small example and clear steps are much easier to investigate than a screenshot of the final error alone.

Once you've gathered all this information, people in the [TMT Discord Server](https://discord.gg/F3xveHV) will be happy to help you.