# Pages and the Tree

Start with the default layer page while porting gameplay. Once the features work, replace the old `tabFormat` with layout objects under `ui.page`.

## Replace tabFormat

This 2.x layout:

```js
tabFormat: [
    "main-display",
    "prestige-button",
    ["display-text", () => "Spend your points wisely!"],
    "upgrades",
    "buyables"
]
```

becomes this setup field:

```js
ui: {
    page: [
        { type: "section", feature: "main" },
        { type: "text", text: "Spend your points wisely!" },
        { type: "section", feature: "upgrades" },
        { type: "section", feature: "buyables" }
    ]
}
```

The `main` section groups the layer's main currency, reset controls, records, and effect description. There aren't separate built-in layout entries for every old main-display subcomponent.

A supplied `page` replaces the default layout. Add every section you want shown. Put the contents of an old `midsection` directly into the new page at the desired position.

| 2.x component | 3.x layout |
| --- | --- |
| `display-text`, `raw-html` | `{ type: "text", text: ... }` |
| `display-image` | `{ type: "image", src: ..., alt: ... }` |
| `blank` | `{ type: "spacer", size: ... }` |
| `row`, `column` | Same type names, with nested nodes in `children` |
| `upgrades`, `buyables`, other collections | `section` with the matching `feature` |
| A single upgrade or buyable | A collection section with `ids: ["11"]` |
| `bar`, `infobox` | A `bars` or `infoboxes` section with selected `ids` |
| Upgrade/buyable/clickable trees | A section with `layout: "tree"` and explicit `rows` |
| `text-input`, `slider`, `drop-down` | Declared `forms`, displayed through a forms section |
| `toggle` | A toggle node with a `binding` |
| `microtabs` and named `tabFormat` tabs | A `tabs` node |
| `layer-proxy` and embedded layer content | A `peek` embed |

For an upgrade tree, assuming the three IDs are declared:

```js
ui: {
    page: [{
        type: "section",
        feature: "upgrades",
        layout: "tree",
        rows: [["11", "12"], ["21"]]
    }]
}
```

Only upgrade, buyable, and clickable sections support this tree layout. Other sections use their ordinary layouts and item selection rules.

## Tabs and Microtabs

Tabs are now infinitely nestable, and there is no longer any distinction between Tabs or Microtabs.

Use an ID for both the tab group and each tab:

```js
ui: {
    page: [{
        type: "tabs",
        id: "main-tabs",
        tabs: [
            {
                id: "main",
                title: "Main",
                page: [
                    { type: "section", feature: "main" },
                    { type: "section", feature: "upgrades" }
                ]
            },
            {
                id: "generators",
                title: "Generators",
                page: [{ type: "section", feature: "buyables" }]
            }
        ]
    }]
}
```

A tab's `shown` replaces its old visibility condition, and `page` replaces `content`. Use `resetNotify` where the old tab used `prestigeNotify`. Tab glow colors come from the layer's tree settings.

For embedded layers, `mode: "peek"` renders another layer inline using `layer: otherHandle`. `mode: "normal"` offers normal navigation and `mode: "deep"` opens a target alongside the origin with Back navigation. See [defineLayer](01/01) for more on embeds and tabs.

## Forms and Toggles

Declare form controls in setup instead of passing saved-field names to tuple components. A form can own its saved value through `defaultValue`, or bind to a field from `startState` through `value.get` and `value.set`.

For dropdowns, call `define.dropdown(options, configuration)` inside setup and put its result in `forms`. The choices go in the first argument and the label, storage or binding, and change hook go in the second. The helper supplies `type` and `options` and infers callback values from the choices. See [defineLayer](01/01) for an example.

For example, if the layer initializes `auto: false`, a page toggle can use:

```js
ui: {
    page: [{
        type: "toggle",
        label: "Auto Prestige",
        binding: {
            get: context => context.layerState.auto,
            set(context, value) { context.layerState.auto = value; }
        }
    }]
}
```

Don't expect a binding's setter to create its initial state. Initialize the backing field yourself. Engine-owned forms save under the layer's `inputs`.

## Move Tree Settings

Layer tree appearance lives in a `tree` object inside setup:

| 2.x layer field | 3.x |
| --- | --- |
| `displayRow` | `tree.row` |
| `position` | `tree.position` |
| `layerShown` | `tree.shown` |
| `branches` | `tree.connections`, using handles or connection objects |
| `nodeStyle` | `tree.style` |
| `image` | `tree.image` |
| `marked` | `tree.mark` |
| `tooltip`, `tooltipLocked` | One `tree.tooltip` callback which checks state |
| `glowColor` | `tree.actionGlowColor` |
| `prestigeNotify` | Setup `resetNotify` |

For a side position, use `tree.row: "left"` or `"right"`. Putting a layer on a side doesn't give it the old side-layer reset exemption, configure reset targets or retention explicitly to preserve that behavior.

Tree visibility defaults to the layer's unlocked state. Position defaults to definition order rather than alphabetical ID order. Add explicit positions where the old arrangement matters.

Old `treeLayout` arrays don't transfer directly. Arrange the main tree through rows, positions, and connections. Embedded trees use the new embed fields rather than a copied array of old node IDs.

`addNode` becomes [defineNode](01/02). It returns a handle which belongs in the mod's `nodes` list. Its appearance fields are on the node definition itself, and its callbacks use mod context because it has no layer state.

## Styling, Messages, and Engine Extensions

Layer `style` becomes `ui.style`, and `componentStyles` becomes `ui.componentStyles`. Review the component names too, old CSS selectors don't automatically match the new engine's styles. See [Styling](01/11) for supported classes and attributes.

Port popup calls to `context.popup({ message, ... })`. Port confirmation and prompt flows to `context.confirm` or `context.prompt`.

HTML-badged fields accept authored HTML, but they don't compile Vue templates or turn HTML event attributes into context actions. Use clickables and forms for interactive game controls.

Finally, plan the save transition in [Saves and Release Checks](04/00/05).