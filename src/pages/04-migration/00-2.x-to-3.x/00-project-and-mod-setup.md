# Project and Mod Setup

Create a separate project from the current template. [Creating a Game](00/00) covers cloning its submodules and running it locally.

Keep the new template's `index.html`, launchers, and `tmt` folders. Bring across your game code and assets as you convert them.

## Replace mod.js Globals

3.x starts from `main.js`. It imports layer handles and calls `defineMod` once:

```js
import { defineMod } from "tmt";
import { prestige } from "./src/prestige.js";

defineMod({
    info: {
        id: "my-tree-v3",
        name: "My Tree",
        author: "Your Name",
        version: "3.0.0",
        pointsName: "points",
        initialPoints: 10,
        startLayer: prestige,
        offlineLimitHours: 1
    },

    layers: [prestige],

    pointGain(context) {
        let gain = context.stateOf(prestige).points.add(1);
        if (context.hasUpgrade("11", prestige)) gain = gain.mul(2);
        return gain;
    }
});
```

This example assumes `prestige.js` exports a layer with upgrade `"11"`. You can use the layer in [Layers and Resets](04/00/02) while working through the guide.

Import engine helpers from "tmt", and import your other files by path. You don't need to export the result of `defineMod`.

## Configuration Names

| 2.x | 3.x |
| --- | --- |
| `modInfo.id`, `name`, `author`, `pointsName` | Corresponding fields in `info` |
| `VERSION.num` | `info.version` for display |
| `modInfo.initialStartPoints` | `info.initialPoints` for fresh points |
| `modInfo.offlineLimit` | `info.offlineLimitHours` |
| `modInfo.modFiles` | Imports in `main.js` and your layer files |
| `layoutInfo.startTab` | `info.startLayer`, using a layer handle |
| `layoutInfo.showTree` | `ui.mode: "tree"` or `"single"` |
| `getPointGen()` | `pointGain(context)` |
| `canGenPoints()` | `canGeneratePoints(context)` |
| `isEndgame()` | `endgame(context)` |
| Global `winText` | `winText` on the mod definition |
| Global `backgroundStyle` | `ui.backgroundStyle` |
| `maxTickLength()` | `simulation.maxTickSeconds` |
| `addedPlayerData()` | Custom fields in a layer's `startState` |
| `fixOldSave(oldVersion)` | `migrateSave(state, fromVersion)` for compatible 3.x save data |

Supply every required `info` field shown in the example. Include each layer handle once in `layers` and include standalone node handles in `nodes`.

`simulation.maxTickSeconds` uses seconds. Stock 2.x code also applies its limit to a seconds-based `diff`, despite some old documentation calling the value milliseconds. Check your old implementation before changing units. The new tick interval, `simulation.intervalMs`, is a separate setting in milliseconds.

There are no matching mod fields for `VERSION.name`, `changelog`, Discord links, or `displayThings`. Put that content into authored page text, an infobox, or a suitable extra layer. Don't leave the old keys in the new definition.

## Move Your Helper Functions

3.x doesn't accept arbitrary extra functions inside layer or feature definitions. Move shared calculations into ordinary module functions, then call them from the supported callbacks.

The `doNotCallTheseFunctionsEveryTick` list goes away completely. A helper runs when your code calls it, the engine evaluates only its declared fields and callbacks.

Definitions are compiled during startup. Changing a definition object afterward doesn't reconfigure the game. Use callbacks for values which depend on current state, and reload after editing the project.

:::note Check the Callback Badge
Not every property accepts a callback. The reference gives callback support its own badge, separate from the value's type. A function which was accepted in a 2.x field may need to move elsewhere.
:::

## First Startup

Start with one layer and a fresh save. Fix definition errors before adding more systems. Unknown fields and explicit `undefined` values are rejected, omit unused properties instead.

Next, replace the old state access patterns in [Context and State](04/00/01).