# Adding Another Layer

Our next layer will turn Prestige Points into Crystals. Crystals will multiply main point gain, but earning them will
reset the prestige layer's progress.

## Create the Layer

Create `src/crystals.js`. Before you read onwards, try to create a layer with the following properties:

- Call it `crystals`, and make the `id`, `name`, `symbol`, `color`, and `resource` fields match that concept.
- Place it on the row above `prestige`.
- Make it unlock if the player has five or more Prestige Points. You can use an `unlock` callback in `setup` for this.
- Give it a simple reset using Prestige Points as the resource. The formula factors can be the same as `prestige` if you
  so choose.
- Give it an `effectDescription` explaining the Crystals' effect. This can be anything, but the hidden example and the
  rest of the tutorial treat them as a multiplier to Point gain.

<details>
<summary><b>Click here to view the Crystals layer. Try to make it yourself first!</b></summary>

```js
import {defineLayer, format} from "tmt";
import {prestige} from "./prestige.js";

export const crystals = defineLayer({
    id: "crystals",
    name: "Crystals",
    symbol: "C",
    color: "#70b7ff",
    row: 1,
    resource: "crystals",

    setup: define => define({
        unlock: context => context.stateOf(prestige).points.gte(5),

        reset: {
            type: "normal",
            resource: prestige.points,
            requires: 10,
            exponent: 0.5
        },

        effectDescription: context => `Your Crystals multiply Point gain by ${format(context.layerState.points.add(1))}.`
    })
});
```

</details>

## Include It in the Game

Import the new handle in `main.js` and add it to `layers`. We'll also extend `pointGain` to use its multiplier:

```js
pointGain(context) {
    let gain = context.stateOf(prestige).points.add(1);

    if (context.hasUpgrade("doubleGain", prestige)) {
        gain = gain.mul(2);
    }

    return gain.mul(context.stateOf(crystals).points.add(1));
}
,
```

At zero crystals, the multiplier is one, so adding this layer doesn't reduce the existing rate. One crystal doubles it,
two triple it, and so on.

The effect description in `crystals.js` displays the multiplier. The calculation in `main.js` is what actually applies
it.

## What Gets Reset?

By default, a layer resets other layers with a lower logical row. Crystals are on row `1`, so a crystal reset resets
prestige on row `0`. That clears Prestige Points, the Doubler, and the custom Energy. Prestige remains unlocked.

You can choose what survives with `retention` on the layer being reset. We haven't added retention here, so the loss of
prestige progress is part of the crystal reset's cost. See [defineLayer](01/01) when you're ready to change those rules.

## Try It

1. Refresh the game and earn at least ten Prestige Points, or whatever amount you chose as the requirement.
2. Select the new `crystals` node and reset for a crystal.
3. Return to `prestige`. The upgrade should be unowned again, and energy should have restarted from zero.
4. Earn Prestige Points again and buy the Doubler. The crystal multiplier will help you rebuild faster.

You now have two connected layers with a reason to reset and work back up. Continue to [Finishing Up](00/06) to give the
game a goal.