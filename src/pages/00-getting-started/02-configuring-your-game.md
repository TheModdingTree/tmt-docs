# Configuring Your Game

Let's give the game its own identity and look at how it earns points.

## Giving Your Game an Identity

The `info` object holds the game's basic information:

- `id` selects the game's save location. Choose a unique ID for your project and keep it stable.
- `name` and `author` tell players what they're playing and who made it.
- `version` is the displayed version.
- `pointsName` names the main currency.
- `initialPoints` sets the main currency for a new game.
- `startLayer` selects the initial layer using its handle.

Changing the template's `id` starts using a different save location, so seeing a fresh game after this edit is expected. Changing `initialPoints` later won't replace the balance in an existing save.

## Including Layers

`layers: [prestige]` includes the imported prestige layer in the game. Defining a layer in a file isn't enough, it needs to be imported and included here.

Each handle should appear only once. Later, we'll add a second handle to this list.

## Generating Points

`pointGain` supplies a rate per second. The engine applies elapsed time for you.

This function reads the prestige layer's points, adds one, and returns the result:

```js
pointGain: context => context.stateOf(prestige).points.add(1)
```

At zero Prestige Points, the rate is one point per second. At three Prestige Points, it's four points per second.

The arrow function is a callback, a function the engine calls when it needs the information. `context` gives that callback access to current game state, and `stateOf(prestige)` selects the prestige layer's state.

Currency values use [Decimal](01/04), so we write `.add(1)` instead of `+ 1`.

## Check Your Game

On a fresh save, wait until you reach 10 points and prestige once. You should gain one Prestige Point and begin earning two points per second.

If you need to start over while following the guide, use the game's Hard Reset in Settings. That clears your progress for this game, so export a save first if you want to keep it.

You can find the rest of the mod settings in [defineMod](01/00). Next, we'll add an upgrade in [Layers and Upgrades](00/03).