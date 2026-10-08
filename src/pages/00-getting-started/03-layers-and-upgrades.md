# Layers and Upgrades

The template's prestige layer already works. We'll keep its reset and add an upgrade which doubles main point gain.

## The Parts of a Layer

Open `src/prestige.js`. A layer has three main parts:

- Its metadata identifies it and sets its name, color, tree symbol, and reset row.
- `startState` creates the starting values for its saved state.
- `setup` creates its gameplay content, including resets and upgrades.

`defineLayer` returns a handle. Exporting it as `prestige` lets `main.js` include it and read its state.

The metadata's `resource` names the layer's currency. The `points` imported from `"tmt"` is the main currency resource. They refer to different things: Prestige Points belong to this layer, while points are the currency it spends to reset.

## The Prestige Reset

The template uses this reset inside `setup`:

```js
reset: {
    type: "normal",
    resource: points,
    requires: 10,
    exponent: 0.5
}
```

These settings divide points by 10, take the square root of that result, and round down to get the gain. That gives one Prestige Point at 10 points, two at 40, and three at 90.

A prestige reset adds the gain to your existing Prestige Points and clears the resource used for it. This layer is on row `0`, so there are no lower-row layers to reset yet.

`setup: define => define({ ... })` creates the layer's content once while the game starts. Put changing calculations inside callbacks in that content, rather than expecting setup itself to run every tick.

## Add an Upgrade

Add this to `prestige`'s `setup`:

```js
upgrades: {     
    doubleGain: {
        title: "Doubler",
        description: "Double Point gain",
        cost: 1     
    }
}
```

`doubleGain` is the upgrade's ID. The engine uses it to track ownership, and we'll use it to check whether the upgrade has been purchased.

The upgrade costs one Prestige Point. Upgrade costs use their own layer's currency unless you choose another resource with `currency`. The engine handles affordability, payment, and recording ownership for this ordinary purchase.

The default page layout displays the upgrade automatically. You don't need to build a page just to show it.

## Make the Upgrade Do Something

The description tells players what the upgrade does, but we still need to implement that effect.

In `main.js`, replace the existing `pointGain` property with:

```js
pointGain(context) {
    let gain = context.stateOf(prestige).points.add(1);

    if (context.hasUpgrade("doubleGain", prestige)) {
        gain = gain.mul(2);
    }

    return gain;
}
```

`hasUpgrade` checks ownership of `doubleGain` on the prestige layer. We pass the handle because this callback belongs to the mod, rather than to a particular layer.

The calculation starts with the template's Prestige Point bonus, then doubles it when the upgrade is owned.

## Try It

Save both files and refresh. Earn two Prestige Points, then buy the Doubler.

Before the purchase, two Prestige Points give three points per second. After spending one, the remaining Prestige Point gives a base rate of two, and the Doubler doubles that to four.

Prestiging on this same layer keeps the upgrade. Later, a higher layer's reset will clear it unless we configure retention.

For more upgrade fields, see [defineLayer](01/01). Next, we'll add [Custom State and Clickables](00/04).