# Custom State and Clickables

Let's add Energy to the prestige layer. It will increase by one per second, and a clickable will trade five Energy for ten points.

Energy will be our own saved field, separate from the layer's built-in Prestige Points.

## Create Saved State

Add `Decimal` to the import from `"tmt"`. Then add `energy` to the object returned by `startState`:

```js
startState: () => ({
    unlocked: true,
    energy: new Decimal(0)
})
```

Fields returned here become part of the layer's saved state. Inside this layer's callbacks, `context.layerState.energy` reaches the current energy balance. From a mod callback or another layer, use `context.stateOf(prestige).energy`.

## Generate Energy

Add an `update` callback inside `setup`:

```js
update(context, delta) {
    const state = context.layerState;
    state.energy = state.energy.add(delta);
}
```

`delta` is elapsed time in seconds. Adding it gives one energy per second, regardless of how frequently the engine updates. A rate of five per second would add `new Decimal(5).mul(delta)` instead.

Unlike `pointGain`, this is a write hook. We assign the result back to `state.energy` to change the saved balance.

:::tip Use Elapsed/Delta Time
Always multiply per-second gains by `delta`. A fixed amount on every update makes production depend on the tick frequency. It also gives the wrong result offline, where the engine advances the elapsed time in one update.
:::

## Spend It with a Clickable

Our clickable, like most, will have a `canClick` calculation and an `onClick` action:

```js
clickables: {
    releaseEnergy: {
        title: "Release Energy",
        display: "Spend 5 Energy to gain 10 Points",
        canClick: context => context.layerState.energy.gte(5),
        onClick(context) {
            const state = context.layerState;
            state.energy = state.energy.sub(5);
            context.addResource(points, 10);
        }
    }
}
```

Add it beneath the `upgrades` collection.

`.gte(5)` checks whether energy is greater than or equal to five. Once the button is usable, clicking it subtracts the energy and adds points through the imported `points` resource.

Clickables don't have built-in costs, so the action performs the payment. Here, `canClick` keeps the player from using it before they have enough energy.

## Display the Balance

We'll give the prestige page a simple layout: its main information, an energy display, upgrades, and clickables.

A custom `ui.page` (also inside `setup`) replaces the default layout. Include each section you want the player to see.

A simple custom page could look like this:

```js
ui: {
    page: [
        {type: "section", feature: "main"},
        {
            type: "text",
            text: context => `You have ${format(context.layerState.energy)} Energy!`
        },
        {type: "section", feature: "upgrades"},
        {type: "section", feature: "clickables"}
    ]
}
```

`format` turns a Decimal into display text.

## Try It

Refresh, wait for at least five energy, and click Release Energy. Energy should drop by five and Points should increase by ten, alongside their normal generation.

Save through Settings and refresh again. Your Energy and upgrade ownership should still be there. Energy also survives an ordinary prestige on its own layer.

For a custom resource which upgrades or buyables can spend through their standard cost fields, see [defineResource](01/03). Our clickable can work directly with saved state because it handles its own payment.

Next, we'll use what you've learned in [Adding Another Layer](00/05).