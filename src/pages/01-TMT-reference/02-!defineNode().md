# defineNode()

`defineNode` creates a tree node which isn't a layer. They can be used for navigation or running a function. Add the returned handle to the `nodes` property of [defineMod](01/00).

Nodes don't have their own saved state. Display callbacks receive a mod read context, and `onClick` receives a mod write context.

Shared types used on this page:

- `StyleValue` {type: Record<string, string | number | undefined>}\
Maps CSS property names to their values. See [Styling](01/11) for supported values and overrides.
- `ClassValue` {type: string | string[] | Record<string, boolean>}\
Applies space-separated class names, a list of class names, or a map of names to whether they're applied. See [Styling](01/11) for examples.
- `LayerHandle` {type: layer identity}\
Returned by [defineLayer](01/01). Exposes only the layer's `id` and `points` resource, with context used to access its state.
- `NodeHandle` {type: node identity}\
Returned by `defineNode`. Exposes only the standalone tree node's `id`.

## Properties

### Identity and Position

- `id` {type: string} {required}\
Identifies the node. Must be unique across all layers and nodes in the mod.
- `title` {type: string} {required} {callback}\
Names the node.
- `symbol` {type: string} {optional} {callback}\
Determines what letter or symbol this node shows on its tree node.
- `color` {type: string} {required}\
A CSS color used throughout the node’s styling.
- `row` {type: number | "left" | "right"} {required}\
  Determines the node's displayed row . Must be finite. Also supports `"left"` and `"right"` (see the first property of [layer.setup.tree](01/01?s=3.4))
- `position` {type: number} {optional}\
The position of the node within its row. Must be finite. Defaults to its index in `defineMod`'s `nodes`.

### Appearance

- `shown` {type: boolean | "ghost"} {optional} {callback}\
Controls whether the node appears. `"ghost"` takes up space without showing a node.
- `image` {type: string} {optional} {callback}\
A URL controlling the image displayed on the node’s tree button. Defaults to no image, instead displaying the node's symbol.
- `tooltip` {type: string} {optional} {callback} {html}\
Controls the node's tooltip. Defaults to `""`.
- `mark` {type: boolean | string} {optional} {callback}\
Shows a star when `true`, a custom image when given a URL, or nothing when `false`. Defaults to `false`.
- `style` {type: StyleValue} {optional} {callback}\
Styles the node. Defaults to nothing.
- `class` {type: ClassValue} {optional} {callback}\
Applies CSS classes to the node. Defaults to no additional classes.

### Connections

- `connections` {type: TreeConnectionDefinition[]} {optional}\
Draws branches to other layer or node handles. Defaults to `[]`. Customize a branch through these fields:
  - `target` {type: LayerHandle | NodeHandle} {required}\
  The layer or node to be connected.
  - `color` {type: string} {optional}\
  Connection color. Defaults to `"#ffffff"`.
  - `width` {type: number} {optional}\
  Connection width. Must be finite and positive. Defaults to `15`.

Connections only appear when both points are visible and nonghost. Unlike layers, nodes never add automatic connections to the preceding row.

### Actions

- `canClick` {type: boolean} {optional} {callback}\
Controls whether the node can be interacted with. Defaults to `true`.
- `onClick` {type: void} {optional} {callback-only}\
Runs as `onClick(context)` when interacted with.
- `layer` {type: LayerHandle} {optional}\
Layer to navigate to after the click hook finishes. Defaults to no navigation target.

### Notifications

- `shouldNotify` {type: boolean} {optional} {callback: boolean | undefined}\
Controls action glow. Defaults to no glow.
- `resetNotify` {type: boolean} {optional} {callback: boolean | undefined}\
Controls reset glow. Defaults to no glow.
- `actionGlowColor` {type: string} {optional} {callback}\
Action glow color. Defaults to `"white"`.
- `resetGlowColor` {type: string} {optional} {callback}\
Reset glow color. Defaults to `"red"`.

Action glow takes priority.

## Example

This node opens a message when clicked. Include `help` in the mod's `nodes` collection.

```js
const help = defineNode({
    id: "help",
    title: "Help",
    symbol: "?",
    color: "#ffffff",
    row: "left",
    tooltip: "How to Play",
    onClick(context) {
        context.alert({
            title: "Getting Started",
            message: "Gain points, then reset for prestige points."
        });
    }
});
```