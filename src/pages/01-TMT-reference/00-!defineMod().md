# defineMod()

defineMod() is the entrypoint to making a game with TMT. It should be called once per game, and already exists in the template's main.js. It expects an object of the properties listed below.

Runtime callbacks within defineMod() receive a mod [context](01/06) unless otherwise stated.

Shared types used on this page:

- `StyleValue` {type: Record<string, string | number | undefined>}\
Maps CSS property names to their values. See [Styling](01/11) for supported values and overrides.
- `ClassValue` {type: string | string[] | Record<string, boolean>}\
Class names, a list of class names, or a map enabling classes with `true` and disabling them with `false`. See [Styling](01/11).
- `DecimalSource` {type: Decimal | ReadonlyDecimal | number | string}\
Input accepted by Decimal-valued fields and operations. See [Decimal](01/04) for more information.
- `LayerHandle` {type: layer identity}\
Returned by [defineLayer](01/01). Exposes only the layer's `id` and `points` resource, with context used to access its state.
- `NodeHandle` {type: node identity}\
Returned by [defineNode](01/02). Exposes only the standalone tree node's `id`.

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
Maximum allowed offline time, in hours. Must be finite and nonnegative. Defaults to `1`. See [Simulation](01/10).

### layers {type: LayerHandle[]} {required}

Include all layer handles here. Handles not included here will not appear in-game or be loaded by the engine at all.

Order in this array determines the position of a layer within its row if the layer's `tree.position` is not defined.

### pointGain {type: DecimalSource} {required} {callback}

Main currency gained per second. Must be finite. Actual gain is calculated as `pointGain * delta`.

### nodes {type: NodeHandle[]} {optional}

Include all node handles here. Handles not included here will not appear in-game or be loaded by the engine at all. Defaults to `[]`.

### ui {type: ModUiDefinition} {optional}

The ui property configures how a game looks and accepts the following properties:

- `mode` {type: "tree" | "single"} {optional}\
Defaults to `"tree"`, showing the tree beside the active page on wide screens. `"single"` hides the tree and displays only the active page. Deep embeds can display two pages in either mode.
- `backgroundStyle` {type: StyleValue} {optional} {callback}\
Styles the game wrapper. Defaults to nothing.
- `layout` {type: ShellLayoutNode[]} {optional}\
  Defines the game's outer layout, including its header, navigation, and content. Omit it to use the default UI. See [ui.layout](01/00?s=ui.layout) for its complete documentation.
- `notifications` {type: NotificationDefinition} {optional}\
Configures popup messages, including completion popups and messages requested with `context.popup`. See [Popups and Modals](01/08). Tree and tab glows have their own settings.
  - `enabled` {type: boolean} {optional}\
  Controls whether popups are visible. Defaults to `true`. `false` does not prevent completion hooks from running.
  - `maxVisible` {type: number} {optional}\
  Maximum popups visible. Must be a positive integer. Defaults to `3`. Adding popups above this amount removes the oldest one.
  - `durationMs` {type: number} {optional}\
  Default popup lifetime in milliseconds. Must be an integer from `1` through `2147483647`. Defaults to `3000`. An individual popup can override this.
- `changelog` {type: string} {optional} {html}\
  An HTML string displayed when the player clicks the version. Omit it to keep the version as plain text.

### simulation {type: SimulationDefinition} {optional}

The simulation property configures how a game's simulation runs and accepts the following properties. See [Simulation](01/10).

- `intervalMs` {type: number} {optional}\
Delay between ticks, in milliseconds. Must be an integer from `1` through `2147483647`. Defaults to `50`.
- `maxTickSeconds` {type: number} {optional}\
Maximum possible length of a single tick, in seconds. Must be finite and positive. Defaults to `3600`. This cap does not apply to offline progress.

### canGeneratePoints {type: boolean} {optional} {callback}

Defaults to `true`. When `false`, skips `pointGain` evaluation and the main currency addition, and displays zero point gain in the header.

### update {type: void} {optional} {callback-only}

Runs as `update(context, delta)` after main point generation and before layer updates. `delta` measures elapsed seconds. See [Simulation](01/10) for tick order and timing.

### endgame {type: boolean} {optional} {callback}

Defaults to `false`. A `true` value sets `context.player.won`, saves the game, shows the endgame panel, and pauses simulation and autosaving until the player chooses to "Keep Going!".

This condition is no longer evaluated while `context.player.won` is `true`, typically "Keep Going!" has been selected.

### winText {type: string} {optional} {callback} {html}

Content displayed on the endgame panel. Defaults to `"You won!"`.

### saveVersion {type: number} {optional}

The actual save data version. Must be a positive safe integer. Defaults to `1`. Increment it **only** when your changes require saved state to be migrated. This is separate from the displayed `info.version`. See [Saves and Errors](01/09).

### migrateSave {type: any} {required when: saveVersion > 1} {callback-only}

Migrates saved state and returns that migrated state. Does not receive `context`.

Its arguments are:

- `state` {type: any} {required}\
Decoded saved state, containing the saved `player` and `layers` fields.
- `fromVersion` {type: number} {required}\
The save’s original saveVersion. Use it to choose the migrations needed to reach your current `saveVersion`. One call must apply every needed migration.

Defaults are created after migration. Remove or rename obsolete layer and feature IDs, unknown IDs are rejected. Removing a custom field permanently also requires removing its initializer from `startState`. See [Loading and Migration](01/09?s=loading-and-migration).

## ui.layout

`ui.layout` is an array of `ShellLayoutNode` objects, rendered in the order of definition. It replaces the game's outer ("shell") layout. The layout within each layer is still defined by that layer's [ui.page](01/01?s=page-layout).

When `layout` is defined, supplying it renders only the nodes you declare. 

The entire layout must contain exactly one `content` node.

Options, Info, and Changelog render in the `content` block. Opening a panel temporarily reveals that branch, including its hidden containers and tabs. The panel's back arrow restores the previous view and focuses its launcher when available. Temporary selections are not saved; author CSS remains authoritative.

### Common Fields

Nodes of type `"row"`, `"column"`, `"text"`, `"button"`, `"tree"`, and `"tabs"` accept these fields in addition to their unique fields:

- `shown` {type: boolean} {optional} {callback}\
Controls whether the node and its contents render. Defaults to `true`.
- `style` {type: StyleValue} {optional} {callback}\
Controls the node's wrapper styles. Defaults to nothing.
- `class` {type: ClassValue} {optional} {callback}\
Controls the classes of the node's wrapper. Defaults to no additional classes.

### Layout Blocks

These nodes are pieces of the shell UI and accept only `type`. You can still wrap a block in a row or column to apply `shown`, `style`, or `class`.

| `type` | Content |
| --- | --- |
| `"header"` | The complete default header, combining the `version`, `points`, and `panels` blocks. You can also define these blocks indepdently.|
| `"points"` | The main currency, its name, and its gain. |
| `"version"` | The version display, and the button used to access the Changelog (if defined).|
| `"panels"` | The combined `options` and `info` blocks. You also can define these blocks indepdently.|
| `"options"` | The button that opens or closes Options. |
| `"info"` | The button that opens or closes Info. |
| `"navigation"` | The standard tree when `ui.mode` is `"tree"` or the origin page instead within Deep Embeds; "the default left-pane display". Renders nothing in `"single"` mode without deep navigation. |
| `"origin"` | The origin page a Deep Embed is accessed from, when applicable. |
| `"content"` | The selected layer page or the current Deep Emebed. Required exactly once in the entire layout. |

### Rows and Columns

Use `type: "row"` for a horizontal group or `type: "column"` for a vertical group. Both accept the common fields and:

- `children` {type: ShellLayoutNode[]} {required}\
Nested nodes, rendered in array order. May contain further rows, columns, or tab groups.

### Text

Use `type: "text"` to display arbitrary texts. Accepts the common fields and:

- `text` {type: string} {required} {callback} {html}\
Content displayed within the node.

### Buttons

Use `type: "button"` to create a custom button. Accepts the common fields and:

- `label` {type: string} {required} {callback} {html}\
Button text content.
- `canClick` {type: boolean} {optional} {callback}\
Controls whether the button can be clicked. Defaults to `true`.
- `onClick` {type: void} {required} {callback-only}\
Runs as `onClick(context)` when a button is clicked, if `canClick` evaluates to `true`. Receives a writable mod context.

### Trees

Use `type: "tree"` for a custom tree placed anywhere in the shell. Accepts the common fields and:

- `source` {type: LayerHandle | EmbedSource} {optional}\
Selects the layers displayed. A direct layer handle selects that layer alone. Omit it to show the main tree. Shows only unlocked, non-deactivated layers from its selection, independently of their `tree.shown` settings.

An `EmbedSource` object accepts:

- `root` {type: LayerHandle} {optional}\
Starting layer for descendant traversal. Defaults to all layers.
- `depth` {type: number} {optional}\
Tree rows from the root displayed. `0` selects the root, `1` includes its children, and so on. Defaults to all descendants.
- `include` {type: LayerHandle[]} {optional}\
Adds layers outside the traversal. Defaults to `[]`.
- `exclude` {type: LayerHandle[]} {optional}\
Removes layers after traversal and inclusion. Defaults to `[]`.

Shell trees render independently of `ui.mode`.

### Tabs

Use `type: "tabs"` to put part of the shell in a specific shell tab. Accepts the common fields and:

- `id` {type: string} {required}\
Tab group ID, unique across the entire shell, including nested groups and groups in other tab pages.
- `tabs` {type: ShellTab[]} {required}\
Tabs in displayed order. Must contain at least one entry. Each entry accepts:
  - `id` {type: string} {required}\
  Non-empty tab ID, unique within this group.
  - `title` {type: string} {required} {callback}\
  Tab button text.
  - `shown` {type: boolean} {optional} {callback}\
  Controls whether this tab is visible. Defaults to `true`.
  - `page` {type: ShellLayoutNode[]} {required}\
  Shell nodes displayed when this tab is selected. May be empty or contain nested groups. The entire shell must still contain exactly one `content` node across all pages.
- `defaultTab` {type: string} {optional}\
ID of a certain tab to select initially. Defaults to the first shown tab.

Shell and layer tabs share keyboard navigation, ARIA links, the `tmt-is-active` state class, and the `tmt-tab-panel` wrapper. Arrow keys/Home/End select and focus available tabs. Layer-specific notifications and equal-width sizing remain in the layer layout.

## Examples

### Renaming Saved Custom State

Suppose version 1 stored `energy` on the `prestige` layer and version 2 calls it `charge`. Update that layer’s `startState` and gameplay code to use `charge`, then add these fields to the mod definition:

```js
saveVersion: 2,
migrateSave(state, fromVersion) {
    if (fromVersion < 2) {
        const layers = state.layers;
        const { energy, ...remainingFields } = layers.prestige;

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