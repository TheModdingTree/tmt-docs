# The createMod() Function

The `createMod()` function is used to create your mod object to expose to the engine. It is a core TMT function exposed
directly by the SDK.

It accepts an object of specific named properties. Unexpected properties will be ignored.

## Required Properties
The following two properties are necessary for your mod to function and must be included.

### layers
A top-level `layers` property which expects a simple array of layer objects is required.

:::tip Modularization
It is recommended that you create `src/layers.js` and create and export your layers array there (or at least
create the layers array as a constant in index.js rather than just writing the array inline here). This may seem like a
random change, but it makes it much easier to keep track of all your layers should you ever need them elsewhere (such as
in a custom system).
:::

### info
A top-level `info` property which expects an object with the following subproperties is required:
- `id`: The ID used as the storage key for your mod, make sure you set it to something unique!
- `name`: *Optional* The name of your mod, displayed in the info tab. Defaults to "TMT Mod".
- `author`: *Optional* Your name, displayed in the info tab. Defaults to "Unknown".
- `version`: *Optional* The version of your mod (should be a string, not a number), displayed in the top right of the screen after a "v". Defaults to nothing.
- `pointsName`: *Optional* The name of your mod's main currency. Defaults to "points".
- `startPoints`: *Optional* The number of points the player starts with, defaults to `0`.
- `defaultHotkey`: *Optional* Accepts two optional subproperties:
    - `enabled`: Accepts a boolean value, controls if the default reset hotkey is usable. Defaults to `true`.
    - `key`: Accepts a letter for a hotkey, pressing this letter will cause the currently selected layer to reset. Defaults to `"r"`.

## Optional Properties
The following properties are optional, but provide valuable high-level features for you to use.

:::note Pardon Our Dust
The Nodes, Actions, and Systems sections will be expanded as their relevant pages are added.
:::

### nodes
A top-level `nodes` property which expects a simple array of node objects is optional. See [Creating A Node](TODO).

### actions
A top-level `actions` property which expects an object of actions keyed by their names is optional. See
[Creating An Action](TODO).

### systems
A top-level `systems` property which expects a simple array of custom systems is optional. See
[Creating A System](TODO).

### ui
A top-level `ui` property which expects an object with the following subproperties is optional:

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

If any properties are not specified their defaults will be used. If the `ui` property as a whole is not specified all
defaults will be used.