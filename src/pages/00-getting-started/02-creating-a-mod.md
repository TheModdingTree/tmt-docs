# Creating A Mod
Your mod must be created in your entrypoint, the default entrypoint being index.js.

Create a mod by using the `createMod()` function:
```javascript
const mod = createMod({
    layers: [ ],
    info: { },
})
```

This function accepts an object and the engine looks for specific properties of this object, some required and some not.
The exact properties are explained below.

After creating your mod, it **must** be exported like so:
```javascript
export default mod
```

:::warning
If your mod is not exported exactly as above the engine will be unable to locate your mod!
:::

## Required Mod Properties
The following two properties are necessary for your mod to function.

### layers
All mods must have a top-level `layers` property which accepts a simple array of layer objects. Layers should be created
in their own files following [Creating A Layer](TODO) and then imported here to be added to the array.

:::tip Modularization
It is recommended that you instead create `src/layers.js` and create and export your layers array there (or at least 
create the layers array as a constant in index.js rather than just writing the array inline here). This may seem like a 
random change, but it makes it much easier to keep track of all your layers should you ever need them elsewhere (such as 
in a custom system).
:::

### info
All mods must have a top-level `info` property which accepts the following subproperties:
- `id`: The ID used as the storage key for your mod, make sure you set it to something unique!
- `name`: *Optional* The name of your mod, displayed in the info tab. Defaults to "TMT Mod".
- `author`: *Optional* Your name, displayed in the info tab. Defaults to "Unknown".
- `version`: *Optional* The version of your mod (should be a string, not a number), displayed in the top right of the screen after a "v". Defaults to nothing.
- `pointsName`: *Optional* The name of your mod's main currency. Defaults to "points".
- `startPoints`: *Optional* The number of points the player starts with, defaults to `0`.
- `defaultHotkey`: *Optional* Accepts two optional subproperties:
  - `enabled`: Accepts a boolean value, controls if the default reset hotkey is usable. Defaults to `true`.
  - `key`: Accepts a letter for a hotkey, pressing this letter will cause the currently selected layer to reset. Defaults to `"r"`.

## Optional Mod Properties: Features
The following properties are optional, but provide valuable high-level features for you to use.

:::note Pardon Our Dust
The Nodes, Actions, and Systems sections will be expanded as their relevant pages are added.
:::

### nodes
Mods can have a top-level `nodes` property, which accepts a simple array of node objects. See [Creating A Node](TODO).

### actions
Mods can have a top-level `actions` property, which accepts an object of actions keyed by their names. See
[Creating An Action](TODO).

### systems
Mods can have a top-level `systems` property, which accepts a simple array of custom systems. See [Creating A System](TODO).


## Optional Mod Properties: Configuration
The following property is optional, but provides valuable visual configuration for your mod. Unfortunately, it really is
just a laundry list of properties.

### ui
Mods can have a top-level `ui` property, if one is not given all subproperties will use their defaults. The following
sub-properties are accepted:
- `mode`: Accepts `"tree"` or `"single"`, the latter causing the tree to disappear. Defaults to `"tree"`. 
- `display`: Accepts an array of strings, functions which return strings, or functions which return arrays of strings. These strings are then displayed under the points display at the top of your mod. Defaults to nothing.
- `startTab`: The layer the player sees when the mod is opened. Defaults to the id of the first layer in `mod.layers`.
- `links`: Controls what links appear in the info tab and what their label is, defaults to nothing. Accepts an array of objects, each object must contain the following properties:
  - `label`: The name of the link.
  - `href`: The actual link.
- `layer`: Accepts two optional subproperties:
  - `showLayerName`: Accepts a boolean value, controls if layers should show their names at the top of their pages. Defaults to `false`.
  - `showSectionNames`: Accepts a boolean value, controls if layers should show sections' titles above them. Defaults to `false`.
- `tabs`: Accepts one optional subproperty: 
  - `equalWidthByDepth`: Accepts a boolean value, controls if subtabs of a given depth should all have the width of the longest tab of that depth. Defaults to `true`.
- `particles`: Accepts two optional subproperties:
  - `enabled`: Accepts a boolean value, controls if particles can be spawned. Defaults to `true`.
  - `max`: Accepts a number, controls how many particles can appear at once. Defaults to `300`.
- `popups`: Accepts three optional subproperties:
  - `enabled`: Accepts a boolean value, controls if popups can appear. Defaults to `true`.
  - `max`: Accepts a number, controls how many popups can appear at once. Defaults to `3`.

## An Example
A mod using all of these properties would look like this:
```javascript
const mod = createMod({
    // Required Properties
    layers: [ prestigeLayer, superPrestigeLayer ],
    info: {
        id: "MyAwesomeMod", // This is technically the only required info property!
        name: "The Coolest Mod Ever",
        author: "FlamemasterNXF",
        version: "1.0",
        pointsName: "SUPER POINTS",
        startPoints: new Decimal(345),
        defaultHotkey: {
            enabled: false, // Disabled for demonstrative purposes, disabling it and also setting key makes no sense.
            key: "g"
        }
    },
  
    // Optional Properties
    nodes: [ myNode, myOtherNode ],
    actions: { // Very rudimentary action example
        "prestige/explodePoints"(state, action){
            if(action.shouldExplode) state.player.points = new Decimal(0);
        }
    },
    systems: [ coolSystem, boringSystem ],
    ui: {
        mode: "single",
        display: [ "Hello!", "This is beneath points." ],
        startTab: "p",
        links: [
            {
                label: "The Modding Tree Wiki",
                href: "wiki.tmt.land"
            }
        ],
        layer: {
            showLayerName: true,
            showSectionNames: true
        },
        tabs: {
            equalWidthByDepth: false
        },
        particles: {
            enabled: false,
            max: 1000 // Once again, it makes no sense to disable particles but then set this.
        },
        popups: {
            enabled: false,
            max: Infinity // As usual, setting this but disabling popups makes no sense.
        }
    }
})
```