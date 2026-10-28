# defineLayer()

defineLayer is how you create a layer, the thing you'll be doing the most work with and creating all your game's content within.

Add the returned handle to the `layers` property of [defineMod](01/00).

Runtime callbacks within defineLayer() receive a [context](01/06) unless otherwise stated. `startState` and `setup` have their own signatures, described below.

The layer definition contains three parts: metadata, `startState`, and `setup`. `setup` is documented in pieces due to its sheer size.

Shared types used on this page:

- `StyleValue` {type: Record<string, string | number | undefined>}\
Maps CSS property names to their values. See [Styling](01/11) for supported values and overrides.
- `ClassValue` {type: string | string[] | Record<string, boolean>}\
Applies space-separated class names, a list of class names, or a map of names to whether they're applied. See [Styling](01/11) for examples.
- `DecimalSource` {type: Decimal | ReadonlyDecimal | number | string}\
Input accepted by Decimal-valued fields and operations. See [Decimal](01/04) for more information.
- `ReadonlyDecimal` {type: protected Decimal}\
Supports Decimal calculations without allowing changes to its representation. See [Decimal](01/04) for more information.
- `LayerHandle` {type: layer identity}\
Returned by [defineLayer](01/01). Exposes only the layer's `id` and `points` resource, with context used to access its state.
- `NodeHandle` {type: node identity}\
Returned by [defineNode](01/02). Exposes only the standalone tree node's `id`.
- `DecimalResource` {type: resource identity}\
Identifies a currency through the exported `points`, a layer's `points`, or [defineResource](01/03). Exposes its `name` and supplied `owner`.
- `LayerState` {type: object}\
Actual layer state, combining engine fields with custom fields from `startState`, described below.
- `FormValue` {type: string | number | boolean | null}\
Values accepted by form controls. Numbers must be finite. Each Form has its own rules, described below.
- `DropdownOption` {type: object}\
One choice with a display label and a saved value. Its fields are listed under Dropdown Form.
- `DropdownConfiguration` {type: object}\
Form settings passed to `define.dropdown`, including the label, storage or binding, and change callback. Excludes `type` and `options`, which the helper supplies.
- `PersistentValue` {type: null | boolean | string | number | Decimal | PersistentValue[] | Record<string, PersistentValue>}\
Documentation shorthand for values the engine can save.

## Metadata Properties

Metadata identifies the layer and creates its default appearance.

- `id` {type: string} {required}\
Identifies the layer. Must be unique across all layers and standalone nodes in the mod.
- `name` {type: string} {required}\
Names this layer.
- `symbol` {type: string} {required}\
Determines what letter or symbol this layer shows on its tree node.
- `color` {type: string} {required}\
A CSS color used throughout the layer’s styling.
- `row` {type: number} {required}\
Determines the layer’s logical row for resets. Must be finite. Also supplies the default tree row. Use `tree.row` to override the visual row or place the layer on the left or right side of the tree.
- `resource` {type: string} {required}\
Determines the name of the resource this layer provides. Regardless of this value, a layer's points are always accessible at `context.stateOf(handle).points`.

## startState {type: plain object} {optional} {callback-only}

Runs as `startState()` to initialize custom persistent state and engine state fields. Values must match PersistentValue. Other layers can access this state through `context.stateOf(handle).property`.

The following fields control the layer’s initial availability:

- `unlocked` {type: boolean} {optional}\
Controls whether the layer can be selected. Defaults to `true` for the layer selected by `defineMod`’s `info.startLayer` and `false` for other layers. Update, automation, and passive generation still run while the layer is locked.
- `deactivated` {type: boolean} {optional}\
Defaults to `false`. Deactivated layers cannot be selected, do not run update, automation, or passive generation, and suppress ownership, effects, and source-initiated resets. Incoming resets can still effect them. Change this state from another layer or the mod's update callback to reactivate it.

Other initial state fields are:

- `points` {type: DecimalSource} {optional}\
Initial layer currency. Must be finite. Defaults to `0`.
- `best` {type: DecimalSource} {optional}\
Highest recorded currency. Must be finite. Defaults to the initial `points` value.
- `total` {type: DecimalSource} {optional}\
Total recorded currency gained. Must be finite. Defaults to the initial `points` value.
- `resetTime` {type: number} {optional}\
Elapsed seconds since the layer’s reset. Must be finite and nonnegative. Defaults to `0`.
- `forceTooltip` {type: boolean} {optional}\
Keeps supported layer and item tooltips visible. Defaults to `false`. Shift-clicking a layer’s tree node changes it.
- `upgrades` {type: Record<string, true>} {optional}\
Initially purchased upgrades, keyed by ID. Other upgrades are omitted.
- `buyables` {type: Record<string, DecimalSource>} {optional}\
Starting amounts by buyable ID. Values must be finite and nonnegative. Other buyables start at their `initialAmount`.
- `clickables` {type: Record<string, PersistentValue>} {optional}\
Starting values by clickable ID. Other clickables use their `initialValue`.
- `challenges` {type: Record<string, number>} {optional}\
Starting completions by challenge ID. Counts must be nonnegative integers. Other challenge completions start at `0`.
- `activeChallenge` {type: string | null} {optional}\
Initially active challenge ID. Defaults to `null`.
- `milestones` {type: Record<string, true>} {optional}\
Initially earned milestone IDs. Defaults to nothing. Initialization here does not trigger completion hooks.
- `achievements` {type: Record<string, true>} {optional}\
Initially earned achievement IDs. Defaults to nothing. Initialization here does not trigger completion hooks.
- `grid` {type: Record<string, PersistentValue>} {optional}\
Stored cell payloads under `"row:column"` keys. Defaults to nothing. Keys must be valid for the layer’s grid.
- `infoboxes` {type: Record<string, boolean>} {optional}\
Starting collapse states by infobox ID. Other infoboxes use their `collapsed` setting.
- `inputs` {type: Record<string, FormValue>} {optional}\
Starting values for forms using engine-owned storage. Other forms use `defaultValue`. Bound forms have no entry here.

During a writable callback, these fields can be changed through `context.stateOf(handle)`. 

`startState` runs whenever new layer state is created, including initialization, loading defaults, incoming resets, and resets that reset their source. Ordinary prestige keeps its source state.

startState can be used for things like:

- Making an upgrade start as purchased
```js
startState: () => ({
    upgrades: { startWithThisUpgrade: true }
}),
```

- Creating an additional resource within a layer
```js
startState: () => ({
    additionalCurrency: new Decimal(96)
}),
```

## setup: introduction and visual properties {type: void} {optional} {callback-only}

Defines the layer’s gameplay content by calling `define` exactly once. The usual form is:
```js
setup: define => define({ /* properties go here */ })
```
The setup property accepts a multitude of properties, far more than you'll find anywhere else in TMT.

The following are `setup` properties relating to how a layer is displayed and behaves on the tree.

### unlock {type: boolean} {optional} {callback}

Sets `unlocked` to `true` when it evaluates to `true`. Once a layer is unlocked it does not automatically re-lock. Defaults to nothing.

### effect and effectDescription

- `effect` {type: any} {optional} {callback-only}\
Computes the effect accessed through `context.getLayerEffect(handle)`.
- `effectDescription` {type: string} {optional} {callback} {html}\
Displayed beneath the layer’s main reset information.

### showBest and showTotal

- `showBest` {type: boolean} {optional} {callback}\
Controls whether a layer's highest currency ever reached is displayed. Defaults to true.
- `showTotal` {type: boolean} {optional} {callback}\
Controls whether a layer's total currency gained is displayed. Defaults to true.

### tree {type: object} {optional}

Controls the layer’s appearance on the tree through the following properties:

- `row` {type: number | "left" | "right"} {optional}\
Overrides the visual tree row. Defaults to the layer’s metadata `row`. `"left"` and `"right"` place the node on the corresponding side of the tree.
- `shown` {type: boolean | "ghost"} {optional} {callback}\
Controls whether the layer appears on the tree. `"ghost"` takes up space without showing a node. Defaults to the layer’s `unlocked` state.
- `position` {type: number} {optional}\
Controls the layer’s position within its visual row. Must be finite. Defaults to its index in the `layers` property of `defineMod`.
- `connections` {type: (LayerHandle | NodeHandle | TreeConnection)[]} {optional}\
Visual connections to other layers or nodes in the mod. Numeric-row layers default to connections with visible layers in the preceding displayed numeric row. Side-row layers default to no connections. `[]` disables connections. These connections do not control resets. Customize a connection through these fields:
  - `target` {type: LayerHandle | NodeHandle} {required}\
  The destination layer or node.
  - `color` {type: string} {optional}\
  The connection’s color. Defaults to `"#ffffff"`.
  - `width` {type: number} {optional}\
  The connection’s width. Must be finite and positive. Defaults to `15`.
- `tooltip` {type: string} {optional} {callback} {html}\
Controls the tree-node tooltip, including for a locked node if it is shown. Defaults to `{currency} {currency name}` when unlocked and `""` when locked.
- `mark` {type: boolean | string} {optional} {callback}\
Shows a star when `true`, a custom image when given a URL, or no marker when `false`. Defaults to `false`.
- `image` {type: string} {optional} {callback}\
A URL controlling the image displayed on the layer’s tree button. Defaults to no image, instead displaying the layer's symbol.
- `actionGlowColor` {type: string} {optional} {callback}\
A CSS color for actionable item notifications. Defaults to `"red"`.
- `resetGlowColor` {type: string} {optional} {callback}\
A CSS color for reset notifications. Defaults to `"white"`.
- `style` {type: StyleValue} {optional} {callback}\
Styles the tree button. Its properties override matching values from `ui.componentStyles["tree-node"]`. Defaults to no additional styles.
- `class` {type: ClassValue} {optional} {callback}\
Applies CSS classes to the tree button. Defaults to no additional classes.

### shouldNotify and resetNotify

- `shouldNotify` {type: boolean} {optional} {callback: boolean | undefined}\
Overrides the layer’s actionable item notification check. Returning `undefined` uses the built-in check, which is also the default behavior.
- `resetNotify` {type: boolean} {optional} {callback: boolean | undefined}\
Overrides the layer’s reset notification check. Returning `undefined` uses the built-in check, which is also the default behavior.

Automatic action notifications check affordable upgrades and buyables, eligible clickable and grid actions, and completion of the active challenge. Automatic reset notifications use reset availability. Action glow takes priority over reset glow.

## setup: reset and retention

The following are `setup` properties relating to how a layer's reset works.

### reset {type: object} {optional}

Controls how the layer’s reset functions. Defaults to `{ type: "none" }`.

It accepts the following properties for determining how it functions:

- `type` {type: "normal" | "static" | "custom" | "none"} {required}\
A normal reset calculates layer currency gain based on a given currency. A static reset calculates layer currency gain based on a given currency, but scales the cost of the layer currency based on your current amount of it. A custom reset has no built-in cost or affordability behavior and is controlled through callbacks. A none reset disables reset behavior but still allows forced and challenge resets.
- `targets` {type: object} {optional}\
Controls which other layers are reset when a layer is reset. Defaults to resetting layers with a lower metadata `row`. `targets` is configured through three properties:
  - `include` {type: LayerHandle[]} {optional}\
  Adds layers to the default target set or the explicit `only` set.
  - `exclude` {type: LayerHandle[]} {optional}\
  Removes layers from the final target set, including layers listed in `include`.
  - `only` {type: LayerHandle[]} {optional}\
  Replaces the default row-based target set with this list. `include` and `exclude` are applied afterward.

Normal and static resets accept `resource`, `requires`, and the shared formula factors below. Softcap fields are only accepted for normal resets. `base` and `canMax` are only accepted for static resets. Custom resets accept `gain`, `canReset`, and `nextRequirement` instead of formula fields. A `"none"` reset accepts only `type` and `targets`.

- `resource` {type: DecimalResource} {required when: reset.type is "normal" or "static"}\
Controls what resource is used in reset gain calculation.
- `requires` {type: DecimalSource} {required when: reset.type is "normal" or "static"} {callback}\
Controls the base requirement for the first layer currency to be gained by a reset.
- `exponent` {type: DecimalSource} {optional} {callback}\
In a normal reset, it is applied to layer currency gain immediately after the division of resource by requires. In a static reset, it is applied to the effective layer currency amount. Defaults to 1.
- `gainMultiplier` {type: DecimalSource} {optional} {callback}\
In a normal reset, it is applied to layer currency gain immediately after the application of exponent. In a static reset, it multiplies the resource requirement, **serving as a way to make resets more costly rather than a gain multiplier.** Defaults to 1.
- `gainExponent` {type: DecimalSource} {optional} {callback}\
In a normal reset, it is applied to layer currency gain immediately after the application of gainMultiplier. In a static reset, it divides the cost exponent. Defaults to 1.
- `softcapStart` {type: DecimalSource} {required when: softcapPower is specified} {callback}\
Used only in normal resets. Applies a softcap above this amount, using `softcapPower` as its strength. Defaults to no softcap.
- `softcapPower` {type: DecimalSource} {optional} {callback}\
Used only in normal resets. Controls the strength of a layer's currency softcap. Defaults to `0.5` for an active softcap.
- `finalMultiplier` {type: DecimalSource} {optional} {callback}\
In a normal reset, it is applied to layer currency gain immediately after the application of a softcap if one is defined, and after the application of gainExponent if one is not. In a static reset, it divides the layer currency amount before exponent is applied. Defaults to 1.
- `base` {type: DecimalSource} {required when: reset.type is "static"} {callback}\
Used only in static resets. The exponential cost base, must be finite and greater than `1`.
- `canMax` {type: boolean} {optional} {callback}\
Used only in static resets. If true, a static reset can gain more than one point at a time. Effectively enabling a "buy-max" for static resets. Defaults to false.
- `gain` {type: DecimalSource} {required when: reset.type is "custom"} {callback-only}\
Returns the reset gain. Overrides the formula for normal and static resets and supplies the gain for custom resets. Must return a finite, nonnegative value.
- `canReset` {type: boolean} {required when: reset.type is "custom"} {callback-only}\
Available only for custom resets. Determines whether a reset can be triggered.
- `nextRequirement` {type: DecimalSource} {required when: reset.type is "custom"} {callback-only}\
Returns the displayed next requirement for a custom reset, or overrides its calculation for a normal or static reset. A static reset also uses this value for affordability. Must return a finite, positive value.

Without a `gain` override, a normal reset grants zero below `requires`. Otherwise, its final gain is determined by the following:
```text
1. base = (((resource / requires)^exponent) * gainMultiplier)^gainExponent
2. If a softcap is defined and base > softcapStart:
   base = base^softcapPower * softcapStart^(1 - softcapPower)
3. gain = max(0, floor(base * finalMultiplier))
```

The built-in normal `nextRequirement` reverses this calculation to find the next gain requirement:
```text
1. requirement = (gain + 1) / finalMultiplier
2. If a softcap is defined and requirement > softcapStart:
   requirement = (requirement / softcapStart^(1 - softcapPower))^(1 / softcapPower)
3. nextRequirement = max(requires, requires * ((requirement^(1 / gainExponent) / gainMultiplier)^(1 / exponent)))
```

This requirement is not rounded. A `gain` override changes the starting gain used by this inverse, a `nextRequirement` override replaces the inverse itself.

Without `gain` or `nextRequirement` overrides, static reset calculations use the following:
```text
1. nextRequirement = max(requires, requires * gainMultiplier * base^(((layerCurrency / finalMultiplier)^exponent) / gainExponent))
If `canMax` is false or resource < requires, the gain is one. Otherwise:
2. total = floor((log_base(max(1, resource / requires / gainMultiplier)) * gainExponent)^(1 / exponent) * finalMultiplier)
3. gain = max(1, total - layerCurrency + 1)
```

Normal resets require positive calculated gain, static resets require the resource to be greater than or equal to its nextRequirement, custom resets require canReset to return true.

### retention {type: boolean | RetentionSelection} {optional} {callback}

Controls which state is retained during an incoming reset or forced self-reset. `true` retains the entire previous state. `false` uses fresh state from `startState` and engine defaults. Availability flags `unlocked`, `deactivated`, and `forceTooltip` always survive resets. Defaults to `false`.

Retention accepts the following fields:

- `points` {type: boolean} {optional}\
Keeps the previous layer currency balance when `true`.
- `best` {type: boolean} {optional}\
Keeps the previous highest layer currency record when `true`.
- `total` {type: boolean} {optional}\
Keeps the previous total layer currency record when `true`.
- `resetTime` {type: boolean} {optional}\
Keeps the previous elapsed reset time when `true`. A source reset still clears its timer at the end of the reset.
- `activeChallenge` {type: boolean} {optional}\
Keeps the previous active challenge when `true`.
- `upgrades`, `milestones`, `achievements`, `challenges`, `buyables`, `clickables`, `grid`, `infoboxes`, and `inputs` {type: boolean | string[]} {optional}\
Retains specified state entries. List the IDs to retain, use `true` to retain all entries, or `false` to retain none. Form values use `inputs`. Grid selections use cell keys.
- `custom` {type: boolean | string[]} {optional}\
Retains custom state. List the state IDs to retain, use `true` to retain all custom state, or `false` to retain none.

For example:
```js
retention: context => ({
    best: true, // Keep best points on reset.
    milestones: true, // Keep all milestones on reset.
    upgrades: ["keepThisUpgrade"], // Keep an upgrade of ID "keepThisUpgrade" on reset
    custom: ["secondaryCurrency"], // Keep a custom state of ID "secondaryCurrency" on reset
    points: context.source === superPrestige // If the incoming reset is from a layer of the handle superPrestige, keep points on reset
})
```

### onReset {type: void} {optional} {callback-only}

Runs as `onReset(context)` for the source of a reset and for each incoming target after its state is reset. The context’s `layerState` belongs to that target. See [Reset Contexts](01/06?s=reset-contexts) for the reset metadata available here and while evaluating `retention`.

An ordinary prestige grants source currency, updates best and total, runs the source hook, awards milestones and achievements, resets targets in lower rows, resets the base resource, and resets the source’s timer. The source itself is not reset.

`context.forceReset({})` grants no currency and defaults to preserving source state. `context.forceReset({ resetSource: true })` resets the source after incoming targets and then calls its hook. Challenge entry and exit grant no currency.

## setup: the ui property {type: object} {optional}

`ui` is extremely powerful, letting you configure a layer's appearance with deep precision. Includes basic section placement, three kinds of layer embedding, custom styles for any component or component class, nestable tabs, nestable columns and rows, and more. By far the most complex `setup` property.

It accepts the following properties, plus the reset text fields described below:

- `page` {type: LayoutNode[]} {optional}\
Defines the layer’s layout. Defaults to the standard layer layout.
- `style` {type: StyleValue} {optional} {callback}\
Styles the layer page.
- `componentStyles` {type: object} {optional}\
Configures styles by component name:
  - `[componentName]` {type: StyleValue} {optional} {callback}\
  Styles the named component. For example, `"tree-node"` supplies shared tree-button styles.

### resetDescription and resetButtonText

- `resetDescription` {type: string} {optional} {callback} {html}\
Text displayed immediately before the calculated gain on the reset button. Defaults to `"Reset for "`.
- `resetButtonText` {type: string} {optional} {callback} {html}\
Completely replaces a layer's reset button's text with itself.

### Page layout

`ui.page` arranges built-in layout nodes. Its default order is infoboxes, main reset information, milestones, upgrades, buyables, clickables, challenges, achievements, grid, bars, and forms. `[]` displays no content.

Every layout node accepts these fields:

- `type` {type: "section" | "text" | "image" | "spacer" | "toggle" | "row" | "column" | "tabs" | "embed"} {required}\
Selects the node’s behavior and fields. Types elaborated on below.
- `shown` {type: boolean} {optional} {callback}\
Controls whether the node and its contents render. Defaults to `true`.
- `style` {type: StyleValue} {optional} {callback}\
Styles the node.
- `class` {type: ClassValue} {optional} {callback}\
Applies classes to the node.

#### Sections

Use `type: "section"` to render a built-in feature collection:

- `feature` {type: "main" | "upgrades" | "buyables" | "clickables" | "challenges" | "milestones" | "achievements" | "grid" | "bars" | "infoboxes" | "forms"} {required}\
Selects the content to be displayed. `"main"` displays currency, reset controls, best/total, passive rate, and the layer effect description.
- `title` {type: string} {optional} {callback} {html}\
Heading above the section. Overrides an automatically generated heading. `""` suppresses the visible heading.
- `layout` {type: "default" | "tree"} {optional}\
Defaults to `"default"`. Tree layout arranges upgrades, buyables, or clickables into their own trees.
- `ids` {type: string[]} {optional}\
Displayed item IDs and order for a default collection section. Defaults to all items. `[]` displays none. Not used with `main`, `grid`, or tree layout.
- `rows` {type: string[][]} {required when: layout is "tree"}\
Item IDs arranged into rows for tree layout. Empty rows take up space. Cannot be combined with `ids` or default layout.

Item branches draw between visible endpoints in the same tree section. They do not create purchase prerequisites. The same item can appear in multiple sections.

#### Text, images, and spacers

For `type: "text"`:

- `text` {type: string} {required} {callback} {html}\
Content displayed by the node.

For `type: "image"`:

- `src` {type: string} {required} {callback}\
Image URL.
- `alt` {type: string} {optional} {callback}\
Alternative text for the image. Defaults to `""`.

For `type: "spacer"`:

- `size` {type: number | string} {optional}\
Spacing in pixels or a CSS size such as `"2rem"`. Defaults to `"1rem"`. Applied to both width and height.

#### Toggles

Use `type: "toggle"` for a setting backed by layer state:

- `label` {type: string} {required} {callback} {html}\
Label beside the control.
- `value` {type: BooleanStateKey | ValueBinding<boolean>} {required}\
A top-level boolean field name from this layer's state, such as `"automation"`, or a value binding.
An explicit binding uses:
  - `get` {type: boolean} {required} {callback-only}\
  Runs as `get(context)` to read the current setting.
  - `set` {type: void} {required} {callback-only}\
  Runs as `set(context, value)` when the setting changes. Initialize backing state through `startState`, the engine does not call this setter to create defaults.

#### Rows and columns

Use `type: "row"` for a horizontal group or `type: "column"` for a vertical group:

- `children` {type: LayoutNode[]} {required}\
Nested nodes, displayed in the order they're written.

```js
ui: {
    page: [
        { type: "section", feature: "main" },
        {
            type: "row",
            children: [
                { type: "section", feature: "upgrades" },
                { type: "section", feature: "buyables" }
            ]
        }
    ]
}
```

### Tabs

Use `type: "tabs"` inside a page to display one child page at a time:

- `id` {type: string} {required}\
Tab group ID, unique within its page scope. Rows, columns, and nested groups share that scope.
- `tabs` {type: TabDefinition[]} {required}\
Tabs in displayed order. Include at least one entry.
  - `id` {type: string} {required}\
  Tab ID, unique within the group.
  - `title` {type: string} {required} {callback}\
  Tab button text.
  - `page` {type: LayoutNode[]} {required}\
  Content displayed when this tab is selected.
  - `shown` {type: boolean} {optional} {callback}\
  Controls whether the tab is available. Defaults to `true`.
  - `shouldNotify` {type: boolean} {optional} {callback: boolean | undefined}\
  Overrides action notifications. Returning `undefined` uses the automatic check, which is also the default.
  - `resetNotify` {type: boolean} {optional} {callback: boolean | undefined}\
  Overrides reset notifications. Returning `undefined` uses the automatic check, which is also the default.
- `defaultTab` {type: string} {optional}\
ID to use when the current selection is unavailable. Defaults to the first available tab.
- `equalWidth` {type: boolean} {optional}\
If `true`, equal button widths are applied to groups at the same nesting depth and scope. Defaults to `false`.

Selection stays on an available tab, otherwise falls back to `defaultTab`, then the first available tab. No page renders when all tabs are hidden. Tab selection survives ordinary navigation but is not saved and clears when player state is reset.

Automatic notifications inspect the feature categories in the tab’s page. A reset notification needs a `main` section. Embedded pages are excluded. Action notifications take priority over reset notifications. Colors come from the layer’s tree glow settings.

### Embeds

Use `type: "embed"` to display or navigate to other layers. These nodes also use the common `shown`, `style`, and `class` fields.

- `mode` {type: "normal" | "peek" | "deep"} {required}\
`"normal"` displays a compact layer tree that navigates normally. `"peek"` renders another layer inline. `"deep"` opens a selected target where a layer is typically displayed and moves its origin to where the tree is typically displayed.
- `source` {type: LayerHandle | EmbedSource} {required when: mode is "normal" or "deep"}\
Layers offered by a normal or deep tree. A direct handle selects one layer.
- `layer` {type: LayerHandle} {required when: mode is "peek"}\
Target rendered inline by a peek.
- `page` {type: LayoutNode[]} {optional}\
Peek-specific page display override. Defaults to the target’s page; `[]` displays no page content. Calculations run in the target’s scope, use `context.stateOf(targetHandle)` to access its state.
- `showLayerName` {type: boolean} {optional}\
Shows the target’s name in peek or deep mode. Defaults to `false`.
- `showSectionTitles` {type: boolean} {optional}\
Adds generated section headings in peek or deep mode. Explicit section titles take precedence. Defaults to `false`.

`EmbedSource` selects layers through these fields:

- `root` {type: LayerHandle} {optional}\
Starting layer for descendant traversal. Defaults to all layers.
- `depth` {type: number} {optional}\
Tree rows from the root displayed. `0` selects the root, `1` includes its children, and so on. Defaults to all descendants.
- `include` {type: LayerHandle[]} {optional}\
Adds layers outside the traversal. Defaults to `[]`.
- `exclude` {type: LayerHandle[]} {optional}\
Removes layers after traversal and inclusion. Defaults to `[]`.

A layer connected to another layer is its child for embed traversal. Embed trees show unlocked, non-deactivated layers independently of main-tree `shown` settings.

### Component styles

`ui.componentStyles` applies named style overrides. Local feature styles override matching properties. See [Component Names](01/11?s=component-names) for the supported names and the elements they style.

## setup: item collections

The item collection properties create upgrades, buyables, clickables, challenges, milestones, achievements, a grid, bars, infoboxes, and forms. These are the built-in "gameplay features" (referred to as items) TMT provides.

The `upgrades`, `buyables`, `clickables`, `challenges`, `milestones`, `achievements`, `bars`, `infoboxes`, and `forms` collections use item IDs as keys. Each entry defines the corresponding item. `grid` is a single grid definition, not a collection.

```js
upgrades: {
    doubleGain: {
        description: "Double point gain",
        cost: 10,
        effect: () => 2
    }
}
```

Collections default to no entries. Use item IDs in context commands.

Feature `unlocked` properties default to `true`. Ordinary interactions also require an unlocked, non-deactivated layer. Hiding an item differs from disabling an unaffordable action. Progression awards have their own rules described below.

Item display and eligibility calculations receive read-only item contexts with `context.id`. Action hooks receive writable contexts. Bars use layer contexts, and clickables and grids provide their local contexts. Styles and classes default to no overrides. Markers default to no marker except for the challenge completion indicator. Titles with a fallback display the item ID. Supplemental text and tooltips default to `""`.

Effects supply values for your formulas, they are not magically applied. Missing or inactive effects return `undefined`. Deactivation suppresses active effects while preserving state. Upgrade, challenge, milestone, and achievement effects also depend on earned ownership. Returned effect snapshots are read-only.

For display, each effect getter has a matching `preview[item]Effect` method which bypasses ownership, completion, visibility, and deactivation checks. See [Effect Previews](01/06?s=effect-previews) for the methods and their rules. Use normal getters in gameplay calculations.

The sections below describe each built-in collection and the layer’s grid.

Upgrades, buyables, and clickables share these appearance fields. Other item types support their own subsets:

- `style` {type: StyleValue} {optional} {callback}\
Styles the item.
- `class` {type: ClassValue} {optional} {callback}\
Applies CSS classes to the item.
- `mark` {type: boolean | string} {optional} {callback}\
Shows a star when `true`, a custom image when given a URL, or no marker when `false`.
- `tooltip` {type: string} {optional} {callback} {html}\
Text shown in the item’s tooltip.
- `branches` {type: ItemBranchDefinition[]} {optional}\
Visual connections to other items in the same collection. An item ID uses the default connection appearance. Customize a connection through these fields:
  - `target` {type: string} {required}\
  The destination item’s ID.
  - `color` {type: string} {optional}\
  The connection’s color. Defaults to `"#ffffff"`.
  - `width` {type: number} {optional}\
  The connection’s width. Defaults to `15`.

### upgrades {type: Record<string, UpgradeDefinition>} {optional}

Upgrades are the quintessential TMT game feature. Buy them once to gain some effect. Each upgrade has the following properties:

- `title` {type: string} {optional} {callback} {html}\
Controls the text displayed above an upgrade's description.
- `description` {type: string} {required when: fullDisplay is omitted} {callback} {html}\
Controls the main text displayed on an upgrade.
- `effectDisplay` {type: string} {optional} {callback} {html}\
Text describing the upgrade’s effect, shown below its description.
- `fullDisplay` {type: string} {required when: description is omitted} {callback} {html}\
Replaces the normal upgrade title, description, effect text, and cost display.
- `row` {type: number} {optional}\
A nonnegative integer, default `0`. Unused rows do not add blank space. Explicit section `ids` and item-tree `rows` take precedence.
- `cost` {type: DecimalSource} {required} {callback}\
Controls how much of a given currency a player must spend to purchase an upgrade.
- `currency` {type: DecimalResource} {optional}\
Defaults to the layer’s own currency. Controls what currency an upgrade uses to determine its affordability, and what currency is reduced by its cost.
- `unlocked` {type: boolean} {optional} {callback}\
Controls whether an upgrade is displayed.
- `canAfford` {type: boolean} {optional} {callback}\
Adds an affordability condition. The selected currency must still cover the cost, the default check is not overridden.
- `pay` {type: void} {optional} {callback-only}\
Runs as `pay(context, cost)` and overrides the default currency deduction. Ownership is still recorded normally. Use `onPurchase` for additional purchase effects.
- `onPurchase` {type: void} {optional} {callback-only}\
Runs when an upgrade is purchased.
- `effect` {type: any} {optional} {callback-only}\
Computes the effect read by `context.getUpgradeEffect(id)` for application or `context.previewUpgradeEffect(id)` for display.

### buyables {type: Record<string, BuyableDefinition>} {optional}

Buyables are upgrades which can be purchased more than once. Each buyable has the following properties:

- `title` {type: string} {optional} {callback} {html}\
Controls the text displayed at the top of a buyable.
- `display` {type: string} {required} {callback} {html}\
Controls the text displayed on the main body of a buyable.
- `effectDisplay` {type: string} {optional} {callback} {html}\
Text describing the buyable’s effect, shown below its display text.
- `cost` {type: DecimalSource} {required} {callback}\
Controls how much of a given currency a player must spend to purchase a buyable.
- `currency` {type: DecimalResource} {optional}\
Defaults to the layer’s own currency. Controls what currency a buyable uses to determine its affordability, and what currency is reduced by its cost.
- `unlocked` {type: boolean} {optional} {callback}\
Controls whether a buyable is displayed.
- `initialAmount` {type: DecimalSource} {optional}\
The initial number of buyable levels. Defaults to `0`.
- `showAmount` {type: boolean} {optional} {callback}\
Controls whether the default amount display is shown, Defaults to `true`.
- `purchaseLimit` {type: DecimalSource} {optional} {callback}\
Caps the amount that can be purchased. Must be finite. Defaults to no cap.
- `canAfford` {type: boolean} {optional} {callback}\
Adds an affordability condition. The selected currency must still cover the cost, the default check is not overridden.
- `buy` {type: void} {optional} {callback-only}\
Runs as `buy(context, cost)` and replaces both the default payment and amount increment. Affordability is still checked.
- `buyMax` {type: void} {optional} {callback-only}\
Grants the buyable's buymax button functionality.
- `canSellOne` {type: boolean} {optional} {callback}\
Controls whether sellOne can run. Defaults to `true`.
- `sellOne` {type: void} {optional} {callback-only}\
Grants the buyable's sell one button functionality.
- `canSellAll` {type: boolean} {optional} {callback}\
Controls whether sellAll can run. Defaults to `true`.
- `sellAll` {type: void} {optional} {callback-only}\
Grants the buyable's sell all button functionality.
- `onPurchase` {type: void} {optional} {callback-only}\
Runs as `onPurchase(context)` after a successful buy-one operation, including a custom `buy`. Buy Max does not invoke it.
- `effect` {type: any} {optional} {callback-only}\
Computes the effect returned by `context.getBuyableEffect(id)`.

Buying one checks availability, cost, and the purchase limit, then pays, increments the amount, and runs `onPurchase`. Custom `buy` controls the payment and increment. A resulting amount above the current limit is rejected rather than clamped.

Holding the main button repeatedly triggers normal `buy`.

### buyableRespec {type: BuyableRespecDefinition} {optional}

Adds a respec control to buyable sections. The UI asks for confirmation and then rechecks availability. Calling `context.respecBuyables()` directly runs the respec without opening a dialog.

- `label` {type: string} {optional} {callback}\
Button text. Defaults to `"Respec"`. The confirmation dialog also uses it as its title.
- `unlocked` {type: boolean} {optional} {callback}\
Controls whether the respec action is available. Defaults to `true`.
- `confirmation` {type: string} {optional} {callback} {html}\
Message displayed before the UI runs the respec. Defaults to `"Are you sure?"`.
- `onRespec` {type: void} {required} {callback-only}\
Runs as `onRespec(context)` after acceptance. The engine has no default respec behavior.

### clickables {type: Record<string, ClickableDefinition>} {optional}

Clickables perform actions when clicked or held. The default click toggles `true` and `false`. Use `onClick` to define their click behavior. Each clickable has the following properties:

- `title` {type: string} {optional} {callback} {html}\
Controls the text displayed at the top of a clickable.
- `display` {type: string} {required} {callback} {html}\
Controls the text displayed on the main body of a clickable.
- `initialValue` {type: any} {optional}\
The clickable’s initial value. Defaults to `false`.
- `unlocked` {type: boolean} {optional} {callback}\
Controls whether a clickable is displayed.
- `canClick` {type: boolean} {optional} {callback}\
Controls whether a clickable can be interacted with.
- `onClick` {type: void} {optional} {callback-only}\
Runs as `onClick(context)` when the clickable is activated.
- `onHold` {type: void} {optional} {callback-only}\
Runs as `onHold(context, interval)` while the clickable is held. `interval` is elapsed time in seconds.
- `effect` {type: any} {optional} {callback-only}\
Computes the effect returned by `context.getClickableEffect(id)`.

Within clickable callbacks, `context.value` exposes the current payload as read-only. Use `context.setValue(nextValue)` to replace it. Cross-item operations use `context.getClickableState(id)` and `context.setClickableState(id, nextValue)`.

Pointer holds wait 250ms, then repeat on a 50ms interval. A hold suppresses the trailing click. Release, cancellation, hidden UI, lost eligibility, modals, navigation that removes the control, and player-state replacement stop the hold. Direct `context.holdClickable(id, interval)` performs one invocation and creates no timer.

### challenges {type: Record<string, ChallengeDefinition>} {optional}

Challenges temporarily change gameplay while active and award completions. Only one challenge per layer can be entered at a time, but `countsAs` can make more active. Use `context.inChallenge(id)` in gameplay calculations and `context.getChallengeCompletions(id)` to read completions.

- `title` {type: string} {optional} {callback} {html}\
Controls the text displayed at the top of a challenge.
- `description` {type: string} {required when: fullDisplay is omitted} {callback} {html}\
Explains the challenge’s gameplay restrictions.
- `goalDescription` {type: string} {required when: fullDisplay is omitted} {callback} {html}\
Explains the completion goal.
- `rewardDescription` {type: string} {required when: fullDisplay is omitted} {callback} {html}\
Explains the reward.
- `rewardDisplay` {type: string} {optional} {callback} {html}\
Shows the current reward effect. Defaults to `""`.
- `fullDisplay` {type: string} {required when: description, goalDescription, or rewardDescription is omitted} {callback} {html}\
Replaces the normal title, descriptive content, and completion counter.
- `goal` {type: DecimalSource} {required when: canComplete is omitted} {callback}\
Completion threshold compared with `goalResource`. Must be finite and nonnegative.
- `goalResource` {type: DecimalResource} {optional}\
Resource checked against `goal`. Defaults to the layer’s own currency.
- `canComplete` {type: boolean} {required when: goal is omitted} {callback}\
Determines completion eligibility, replacing the resource-versus-goal check.
- `completionLimit` {type: number} {optional} {callback}\
Maximum completions. Defaults to `1`. Use a nonnegative integer or `Infinity` for no cap.
- `showCompletions` {type: boolean} {optional} {callback}\
Controls whether the default completion display is shown. Defaults to `true`. Has no effect when `fullDisplay` is supplied.
- `completionGain` {type: number} {optional} {callback}\
Completions awarded per successful completion. Defaults to `1`. Must be a nonnegative integer. Awards are capped by the remaining limit.
- `countsAs` {type: string[]} {optional}\
Other challenge IDs treated as active by `inChallenge` while this challenge runs. Defaults to `[]`. References stay within this layer and apply directly, without following further `countsAs` links. They do not grant rewards or completions.
- `unlocked` {type: boolean} {optional} {callback}\
Controls visibility and interaction. Defaults to `true`.
- `canEnter` {type: boolean} {optional} {callback}\
Additional entry condition. Defaults to `true`. Entry always checks that no challenge is active and that this challenge is below its completion limit.
- `canExit` {type: boolean} {optional} {callback}\
Controls whether the active challenge can be exited. Defaults to `true`.
- `effect` {type: any} {optional} {callback-only}\
Computes the reward read by `context.getChallengeEffect(id)`. Available after this challenge has earned a completion.
- `onEnter` {type: void} {optional} {callback-only}\
Runs as `onEnter(context)` after the challenge-enter reset and activation.
- `onComplete` {type: void} {optional} {callback-only}\
Runs as `onComplete(context, gained, total)` after completions are recorded. `gained` is the actual award and `total` the resulting completion count.
- `onExit` {type: void} {optional} {callback-only}\
Runs as `onExit(context)` after a final completion attempt and clearing the active challenge, before the challenge-exit reset.
- `style` {type: StyleValue} {optional} {callback}\
Styles the challenge.
- `class` {type: ClassValue} {optional} {callback}\
Applies classes to the challenge.
- `mark` {type: boolean | string} {optional} {callback}\
Overrides the completion marker. The default shows a star for a maxed challenge with a completion limit above `1`. Use `false` to hide it.

`context.completeChallenge(id)` awards progress while leaving the challenge active. The stock "Complete" button calls `exitChallenge`, so it also exits and resets.

```js
challenges: {
    lowPower: {
        description: "Point gain is reduced while this challenge is active.",
        goalDescription: "Reach 100 layer points.",
        rewardDescription: "Unlock a permanent multiplier.",
        goal: 100,
        effect: () => 2
    }
}
```

The challenge declaration supplies the goal and reward value. Apply the restriction and reward in your own gain calculations.

### milestones {type: Record<string, MilestoneDefinition>} {optional}

Milestones award persistent progress automatically. After automation, the engine checks milestones and then achievements in declaration order for each layer, ordered by row. Locked layers are still checked, deactivated layers are not.

- `requirementDescription` {type: string} {required} {callback} {html}\
Explains how to earn the milestone.
- `effectDescription` {type: string} {required} {callback} {html}\
Explains its reward.
- `done` {type: boolean} {required} {callback}\
Determines when an unearned milestone is awarded. Requires `unlocked` to evaluate to `true`.
- `unlocked` {type: boolean} {optional} {callback}\
Controls visibility and award eligibility. Defaults to `true`.
- `effect` {type: any} {optional} {callback-only}\
Computes the reward read by `context.getMilestoneEffect(id)` after the milestone is earned.
- `onComplete` {type: void} {optional} {callback-only}\
Runs as `onComplete(context)` after ownership is recorded, before its completion popup.
- `toggles` {type: MilestoneToggleDefinition[]} {optional}\
Controls displayed alongside an earned milestone. Defaults to `[]`. Each toggle uses these fields:
  - `label` {type: string} {required} {callback}\
  Text beside the toggle.
  - `value` {type: BooleanStateKey | ValueBinding<boolean>} {required}\
  A top-level boolean field name from this layer's state, such as `"automation"`, or an explicit binding.\
  An explicit binding uses:
    - `get` {type: boolean} {required} {callback-only}\
    Runs as `get(context)` to read the current setting.
    - `set` {type: void} {required} {callback-only}\
    Runs as `set(context, value)` with the new setting. Initialize its backing state in `startState`, creating the toggle does not call this setter.
- `style` {type: StyleValue} {optional} {callback}\
Styles the milestone.

Use `context.hasMilestone(id)` to check ownership. `context.toggleMilestone(id, index)` uses a zero-based toggle index, checks current eligibility and ownership, reverses the getter’s result, and calls the setter.

### achievements {type: Record<string, AchievementDefinition>} {optional}

Achievements follow the same progression checks as milestones.

- `title` {type: string} {required} {callback} {html}\
Heading on the achievement.
- `description` {type: string} {required} {callback} {html}\
Explains the achievement.
- `done` {type: boolean} {required} {callback}\
Determines whether an unearned achievement is awarded.
- `image` {type: string} {optional} {callback}\
Image URL displayed on the achievement. Defaults to no image.
- `unlocked` {type: boolean} {optional} {callback}\
Controls visibility and award eligibility. Defaults to `true`.
- `effect` {type: any} {optional} {callback-only}\
Computes the reward read by `context.getAchievementEffect(id)` after it is earned.
- `onComplete` {type: void} {optional} {callback-only}\
Runs as `onComplete(context)` after ownership is recorded, before its completion popup.
- `style` {type: StyleValue} {optional} {callback}\
Styles the achievement.
- `class` {type: ClassValue} {optional} {callback}\
Applies classes to the achievement.
- `mark` {type: boolean | string} {optional} {callback}\
Shows a star for `true`, a custom image for a URL, or no marker for `false`. Defaults to `false`.

Check ownership with `context.hasAchievement(id)`.

### grid {type: GridDefinition} {optional}

Defines the layer’s grid. Coordinates start at `1`. A cell’s key is `"row:column"`, such as `"2:3"`. Cell callbacks expose `context.row`, `context.column`, `context.key`, and `context.data`.

- `rows` {type: number} {required} {callback}\
Current row count. Must be an integer from `0` to `1000`.
- `columns` {type: number} {required} {callback}\
Current column count. Must be an integer from `0` to `1000`.
- `startData` {type: any} {required} {callback-only}\
Runs as `startData(context)` to initialize a cell payload. Its context provides coordinates.
- `title` {type: string} {optional} {callback} {html}\
Heading for the cell. Defaults to its key, such as `"2:3"`.
- `display` {type: string} {optional} {callback} {html}\
Content inside the cell. Defaults to `""`.
- `tooltip` {type: string} {optional} {callback} {html}\
Cell tooltip. Defaults to `""`.
- `unlocked` {type: boolean} {optional} {callback}\
Controls cell visibility and interaction. Defaults to `true`. Hidden cells still take up their space.
- `canClick` {type: boolean} {optional} {callback}\
Additional requirement for click and hold actions. Defaults to `true`.
- `onClick` {type: void} {optional} {callback-only}\
Runs as `onClick(context)` when the cell is clicked. The grid has no default click action.
- `onHold` {type: void} {optional} {callback-only}\
Runs as `onHold(context, interval)` while held. `interval` measures elapsed seconds. Timing and cancellation follow clickable holds.
- `effect` {type: any} {optional} {callback-only}\
Computes the value read through `context.getGridEffect(key)` or `context.getGridEffect(row, column)`.
- `style` {type: StyleValue} {optional} {callback}\
Styles the cell.

Read contexts protect `context.data` from mutation. In write hooks, nested cell data can be changed directly. Replace a whole payload with `context.setGridData(context.key, value)`. Reads and explicit setters also accept coordinates such as `context.getGridData(2, 3)`.

Shrinking dimensions hides cells without deleting stored data. Explicit setters can set cells outside the displayed dimensions, within the coordinate bounds `1` through `1000`. Saved entries and retention use cell keys.

```js
grid: {
    rows: 3,
    columns: 3,
    startData: () => ({ clicks: 0 }),
    display: context => String(context.data.clicks),
    onClick: context => { context.data.clicks += 1; }
}
```

### bars {type: Record<string, BarDefinition>} {optional}

Displays progress derived from your state. Bars have no separate saved progress value. These fields use the layer’s read context.

- `direction` {type: "left" | "right" | "up" | "down"} {optional}\
Fill direction. Defaults to `"right"`.
- `width` {type: number} {optional} {callback}\
Width in pixels. Must be finite and nonnegative. Defaults to `180`.
- `height` {type: number} {optional} {callback}\
Height in pixels. Must be finite and nonnegative. Defaults to `24`.
- `progress` {type: number} {required} {callback}\
Filled fraction. Must be finite, clamped between `0` and `1`.
- `display` {type: string} {optional} {callback} {html}\
Text displayed over the bar. Defaults to `""`.
- `unlocked` {type: boolean} {optional} {callback}\
Controls visibility. Defaults to `true`.
- `instant` {type: boolean} {optional}\
Disables the fill animation when `true`. Defaults to `false`.
- `style` {type: StyleValue} {optional} {callback}\
Styles the outer bar.
- `borderStyle` {type: StyleValue} {optional} {callback}\
Styles the border.
- `baseStyle` {type: StyleValue} {optional} {callback}\
Styles the unfilled background.
- `fillStyle` {type: StyleValue} {optional} {callback}\
Styles the filled region.
- `textStyle` {type: StyleValue} {optional} {callback}\
Styles the overlaid text.

### infoboxes {type: Record<string, InfoboxDefinition>} {optional}

Displays collapsible information. Clicking the header toggles the saved collapse state in `context.layerState.infoboxes[id]`.

- `title` {type: string} {required} {callback} {html}\
Heading on the collapse control.
- `body` {type: string} {required} {callback} {html}\
Content inside the box.
- `collapsed` {type: boolean} {optional}\
Initial collapse state. Defaults to `false`. `startState.infoboxes` can override it.
- `unlocked` {type: boolean} {optional} {callback}\
Controls visibility and interaction. Defaults to `true`.
- `style` {type: StyleValue} {optional} {callback}\
Styles the outer box.
- `titleStyle` {type: StyleValue} {optional} {callback}\
Styles the header.
- `bodyStyle` {type: StyleValue} {optional} {callback}\
Styles the body.

The current collapse state is retained during resets.

### forms {type: Record<string, FormDefinition>} {optional}

Adds editable controls. `defaultValue` is stored at `context.layerState.inputs[id]`. `value` connects a control to your own backing state. These two configurations cannot be combined.

- `type` {type: "text" | "slider" | "dropdown"} {required}\
Selects the form type. `define.dropdown` supplies this field for dropdowns. The sections below describe each form's settings.
- `label` {type: string} {required} {callback} {html}\
Label attached to the form.
- `placeholder` {type: string} {optional} {callback}\
Hint shown in an empty text form. Defaults to `""`.
- `unlocked` {type: boolean} {optional} {callback}\
Controls visibility and interaction. Defaults to `true`.
- `style` {type: StyleValue} {optional} {callback}\
Styles the form’s wrapper.
- `onChange` {type: void} {optional} {callback-only}\
Runs as `onChange(context, value)` after a successful write, using the normalized submitted value. Direct backing-state changes and reads do not invoke it.

#### Form values and bindings

The following badges describe values used by `defaultValue`, binding getters and setters, and `onChange`:

- Text values {type: string}
- Slider values {type: number}
- Dropdown values {type: string | number | boolean | null}

Numeric values must be finite. Define storage through these fields:

- `defaultValue` {type: FormValue} {required when: value is omitted}\
Initial value for storage. Cannot be combined with `value`.
- `value` {type: ValueBinding<FormValue>} {required when: defaultValue is omitted}\
Reads and writes backing state. Cannot be combined with `defaultValue`.
  - `get` {type: FormValue} {required} {callback-only}\
  Runs as `get(context)` to read the current control value.
  - `set` {type: void} {required} {callback-only}\
  Runs as `set(context, value)` to update backing state. Initialization and loading do not call this setter.

`context.getInput(id)` reads the current value. `context.setInput(id, value)` checks interaction eligibility, normalizes the input, writes storage or calls the setter, and then invokes `onChange`. Bound controls do not create entries in `inputs`.

#### Text Forms

Use `type: "text"` for text entry. `""` is a valid starting value. Text controls have no additional fields.

#### Slider Forms

Use `type: "slider"` for a range control:

- `min` {type: number} {optional} {callback}\
Lower bound. Must be finite and no greater than `max`. Defaults to `0`.
- `max` {type: number} {optional} {callback}\
Upper bound. Must be finite and no less than `min`. Defaults to `100`.
- `step` {type: number} {optional} {callback}\
Input step. Must be finite and nonnegative. Defaults to `1`.

Slider presentation and writes clamp to the current bounds. Command writes do not round to `step`, only the browser uses it for input stepping.

#### Dropdown Form

Create a choice selector with `define.dropdown(options, configuration)`. Put the returned definition under its ID in `forms`. The helper supplies `type: "dropdown"` and `options`, don't include either field in `configuration`.

- `options` {type: DropdownOption[]} {required} {callback}\
First argument. Choices in presentation order. A callback runs as `options(context)` with a read-only item context.
  - `label` {type: string} {required}\
  Text displayed for the choice.
  - `value` {type: FormValue} {required}\
  Value stored when the choice is selected.
- `configuration` {type: DropdownConfiguration} {required}\
Second argument. Supplies the common form fields above, including `label` and either `defaultValue` or `value`.

The choices determine the inferred value passed to `value.set` and `onChange`.

The current value must match a choice using `===`. Changing the choices does not select a fallback automatically. Keep the current value valid when updating a dynamic choice list.

```js
setup: define => define({
    forms: {
        nickname: {
            type: "text",
            label: "Nickname",
            defaultValue: ""
        },
        volume: {
            type: "slider",
            label: "Volume",
            defaultValue: 50,
            min: 0,
            max: 100
        },
        notation: define.dropdown([
            { label: "Standard", value: "standard" },
            { label: "Scientific", value: "scientific" }
        ], {
            label: "Notation",
            defaultValue: "standard"
        })
    }
})
```

## setup: miscellaneous

The following properties control keyboard input and the simulation.

### hotkeys {type: HotkeyDefinition[]} {optional}

Binds keys to actions game-wide. Defaults to `[]`. Each entry has the following properties:

- `key` {type: string} {required}\
Key which triggers the action, using the syntax below.
- `description` {type: string} {required} {callback}\
Displayed alongside the hotkey in the Info panel.
- `unlocked` {type: boolean} {optional} {callback}\
Controls whether a hotkey is displayed and functional. Defaults to `true`.
- `allowRepeat` {type: boolean} {optional}\
Controls whether a hotkey can be held and continually trigger. Defaults to `false`.
- `onPress` {type: void} {required} {callback-only}\
Controls what happens when a hotkey is pressed.

Hotkeys contain one main key and modifiers (`shift`, `ctrl`, `alt`, or `meta`) joined with `+`. Keys use the browser's `event.key`. Matching ignores case, whitespace, and modifier order. Use `space` and `plus` for those literal keys. `ctrl+s` is reserved for saving.

### passiveGeneration, update, and automate

- `passiveGeneration` {type: DecimalSource} {optional} {callback}\
Controls how much of a layer's primary currency you gain per second. Must be nonnegative. Actual granted currency is this rate multiplied by the internal `delta`.
- `automate` {type: void} {optional} {callback-only}\
Runs once per tick, intended for automatically performing certain layer actions. Behavior requiring awareness of delta-time should use `update`.
- `update` {type: void} {optional} {callback-only}\
Runs once per tick as `update(context, delta)`, with `delta` measured in seconds. Use it for per-tick operations that need elapsed time.

passiveGeneration, update, and automate all:

- Run regardless of if a layer is unlocked, but stop if it is deactivated.
- Run only once when an offline interval is calculated, passing the relevant (large) `delta` to update and multiplying passiveGeneration's rate by it.

See [Simulation](01/10) for tick order, offline timing, and error behavior.