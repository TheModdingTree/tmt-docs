# defineMod()

defineMod() is the entrypoint to making a game with TMT. It should be called once per game, and already exists in the template's main.js. It expects an object of the properties listed below.

All callbacks within defineMod() can be defined with a `context` argument to access relevant mod or layer context unless otherwise stated.

## Properties

### info {type: ModInfo} {required}

The info property accepts the following properties:

- `id` {type: string} {required}\
  Sets the location of your game's saved data in LocalStorage.
- `name` {type: string} {required}\
  Names your game.
- `author` {type: string} {required}\
  Names you!
- `version` {type: string} {required}\
  The **displayed** version of your game. Should not be used for save migration, see `saveVersion`.
- `pointsName` {type: string} {required}\
  Names the main currency of your game.
- `initialPoints` {type: DecimalSource} {required}\
  The starting main currency amount for a new player. Must be finite.
- `startLayer` {type: LayerHandle} {required}\
  The initially selected layer. Its initial `unlocked` state defaults to `true`, but all other layers default to `false`.
- `offlineLimitHours` {type: number} {optional}\
  Maximum allowed offline time, in hours. Must be finite. Defaults to `1`.

### layers {type: LayerHandle[]} {required}

All handles created by a `defineLayer` call should be included here. Handles not included here will not appear in-game or be loaded by the engine at all.

Order in this array determines the position of a layer within its row if the layer's `tree.position` if not defined.

### pointGain {type: DecimalSource} {required} {callback}

Main currency gained per second. Must be finite. Actual gain is calculated as `pointGain * delta`.

### nodes {type: NodeHandle[]} {optional}

All handles created by a `defineNode` call should be included here. Handles not included here will not appear in-game or be loaded by the engine at all. Defaults to `[]`.

### ui {type: ModUiDefinition} {optional}

The ui property configures how a game looks and accepts the following properties:

- `mode` {type: "tree" | "single"} {optional}\
  Defaults to `"tree"`, showing the tree beside the active page on wide screens. `"single"` hides the tree and displays only the active page. Deep embeds can display two pages in either mode.
- `backgroundStyle` {type: Record<string, string | number | undefined>} {optional} {callback}\
  CSS properties applied to the outer game wrapper. Defaults to nothing.
- `notifications` {type: NotificationDefinition} {optional}\
  Configures popup messages, including completion popups and messages requested with `context.popup`. Tree and tab glows have their own settings.
  - `enabled` {type: boolean} {optional}\
    Controls whether popups are visible. Defaults to `true`. `false` does not prevent popup hooks from running.
  - `maxVisible` {type: number} {optional}\
    Maximum popups visible. Must be a positive integer. Defaults to `3`. Adding popups above this amount removes the oldest one.
  - `durationMs` {type: number} {optional}\
    Default popup lifetime in milliseconds. Must be an integer from `1` through `2147483647`. Defaults to `3000`. An individual popup can override this.

### simulation {type: SimulationDefinition} {optional}

The ui property configures how a game's simulation runs and accepts the following properties:

- `intervalMs` {type: number} {optional}\
  "Tick speed", in milliseconds. Must be an integer from `1` through `2147483647`. Defaults to `50`.
- `maxTickSeconds` {type: number} {optional}\
  Maximum possible length of a single tick, in seconds. Must be finite and positive. Defaults to `3600`. This cap does not apply to offline progress.

### canGeneratePoints {type: boolean} {optional} {callback}

Defaults to `true`. When `false`, skips `pointGain` evaluation and the main currency addition, and displays zero point gain in the header.

### update {type: void} {optional} {callback-only}

Used to define arbitrary per-tick behavior. Can be defined with an additional argument of `delta`, used to measure elapsed time.

### endgame {type: boolean} {optional} {callback}

Defaults to `false`. A `true` value sets `context.player.won`, saves the game, shows the endgame panel, and pauses simulation and autosaving until the player chooses to "Keep Going!". 

Once "Keep Going!" has been selected, this condition is no longer evaluated.

### winText {type: string} {optional} {callback} {html}

Content displayed on the endgame panel. Defaults to `"You won!"`.

### saveVersion {type: number} {optional}

The actual save data version. Must be a positive safe integer. Defaults to `1`. Increment it **only** when you have made changes causing saved state needs migration. This is separate from the displayed `info.version`.

### migrateSave {type: any} {required when: saveVersion > 1} {callback-only}

Migrates saved state and returns that migrated state.

Its arguments are:

- `state` {type: any} {required}\
  Decoded saved state, containing the saved `player` and `layers` fields.
- `fromVersion` {type: number} {required}\
  The save’s original saveVersion. Use it to choose the migrations needed to reach your current `saveVersion`. One call must apply every needed migration.

Defaults are created after migration. Remove or rename obsolete layer and feature IDs, unknown IDs are rejected. Removing a custom field permanently also requires removing its initializer from `startState`.

## Examples

### Renaming Saved Custom State

Suppose version 1 stored `energy` on the `prestige` layer and version 2 calls it `charge`. Update that layer’s `startState` and gameplay code to use `charge`, then add these fields to the mod definition:

```js
saveVersion: 2,
migrateSave(state, fromVersion) {
    if (fromVersion < 2) {
        const layers = state.layers;
        const layer = layers.prestige;
        const { energy, ...remainingFields } = layer;

        return {
            ...state,
            layers: {
                ...layers,
                prestige: { ...remainingFields, charge: energy }
            }
        };
    }

    return state;
}
```