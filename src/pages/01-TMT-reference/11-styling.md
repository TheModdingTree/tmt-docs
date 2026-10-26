# Styling

See [defineMod](01/00) and [defineLayer](01/01) for properties which allow custom styling.

## Style and Class Values

- `StyleValue` {type: Record<string, string | number | undefined>}\
Maps CSS property names to values. Supports ordinary CSS and custom properties such as `"--tmt-layer-color"`.
- `ClassValue` {type: string | string[] | Record<string, boolean>}\
Supplies class names directly, as a list, or as a map which enables each class with `true` and disables it with `false`.

```js
style: context => ({
    borderColor: context.layerState.energy.gte(100) ? "gold" : "gray",
    padding: "12px"
}),
class: context => ({ charged: context.layerState.energy.gte(100) })
```

## Where Styles Apply

- `defineMod.ui.backgroundStyle` styles the outer game wrapper using a mod context.
- `layer.ui.style` styles the layer page using a layer context.
- `layer.ui.componentStyles` styles named components using a layer context.
- A feature's `style` and `class` use its own callback scope.
- Layout nodes and display subparts have the style fields documented in [defineLayer](01/01).

On an element with both component and local styles, local properties win. Container inheritance, inline styles, and external stylesheets still follow the ordinary CSS cascade.

### Component Names

| Key | Target |
| --- | --- |
| `main` | Main Layer Information |
| `reset-button` | Prestige Button |
| `tree-node` | The Layer's Tree Button(s) |
| `upgrade`, `buyable`, `clickable` | Corresponding Items |
| `challenge`, `milestone`, `achievement` | Corresponding Items |
| `bar`, `infobox`, `form` | Corresponding Items |
| `grid`, `grid-cell` | Grids and Grid Cells |
| `respec-button` | Buyable Respec Button |

## CSS Variables

The root `#tmt` defines:

| Variable | Default | Use |
| --- | --- | --- |
| `--tmt-background` | `#0f0f0f` | Main Background Color|
| `--tmt-foreground` | `#dfdfdf` | Main Foreground Color|
| `--tmt-panel` | `#202020` | Panel Color |
| `--tmt-locked` | `#bf8f8f` | Locked/Incomplete Color |
| `--tmt-complete` | `#77bf5f` | Completed Color |
| `--tmt-border` | `#ffffff30` | Light Border Color |
| `--tmt-border-dark` | `#00000020` | Dark Border Color |
| `--tmt-tree-border-width` | `4px` | Tree Node Border Width |
| `--tmt-tree-inset-shadow` | `-4px -4px 4px rgba(0, 0, 0, 0) inset` | Tree/Tab Inset Shadow |
| `--tmt-tree-text-shadow` | `none` | Tree Node Text Shadow |

Layer pages set `--tmt-layer-color`, and their displayed currency amount has a `0px 0px 10px` text shadow in that color. Notifications set `--tmt-notification-color`.

The saved [High-Quality Tree option](01/09?s=player-options), off by default, gives `tmt-game` the `tmt-high-quality-tree` class. It sets the border width to `2px`, the inset shadow to `-4px -4px 4px rgba(0, 0, 0, 0.25) inset`, and node text shadow to `2px 2px 4px rgba(0, 0, 0, 0.25)`. Nodes also get a `0px 0px 20px` background-colored glow. Layer-node hover keeps the bevel alongside its white glow; standalone-node hover uses the ordinary white glow, as in tmt-old. Tree/tab notification glows keep the bevel and their existing outer glow. Individual node styles can override these defaults.

```css
#tmt {
    --tmt-background: #101826;
    --tmt-foreground: #e8eef7;
    --tmt-panel: #19253a;
}
```

All engine styles are scoped beneath `#tmt`.

## Targeting Content

| Attribute | Elements and value |
| --- | --- |
| `data-tmt-layer` | Layer pages, peeks, and layer tree buttons. Based on Layer ID |
| `data-tmt-node` | Tree buttons. Based on Layer or Node ID |
| `data-tmt-shell` | Custom shell node containers|
| `data-tmt-shell-tab` | Shell tab buttons|
| `data-tmt-tab` | Tab buttons. Based on Tab ID|
| `data-tmt-item` | Feature buttons. Based on Item ID or Grid Key|
| `data-tmt-section` | Collection and item-tree sections. Based on item/feature name |
| `data-tmt-popup` | Popups. Based on popup type name|

These attributes can be used to control selected items only:

```css
#tmt .tmt-layer-page[data-tmt-layer="prestige"]
.tmt-upgrade[data-tmt-item="doubleGain"] {
    border: 3px solid gold;
}
```

### Class Index

| Area | Classes |
| --- | --- |
| Shell | `tmt-shell`, `tmt-panel-button`, `tmt-game`, `tmt-navigation`, `tmt-split`, `tmt-deep`, `tmt-header`, `tmt-panel-buttons`, `tmt-info-button`, `tmt-version`, `tmt-points`, `tmt-point-gain` |
| Custom shell | `tmt-shell-node`, `tmt-shell-row`, `tmt-shell-column`, `tmt-shell-text`, `tmt-shell-button`, `tmt-shell-tree`, `tmt-shell-tabs` |
| Layer | `tmt-layer-page`, `tmt-main`, `tmt-reset-button`, `tmt-back`, `tmt-feature-section`, `tmt-section-title` |
| Purchases and actions | `tmt-upgrade`, `tmt-buyable-group`, `tmt-buyable`, `tmt-buyable-actions`, `tmt-respec-button`, `tmt-clickable` |
| Progression | `tmt-challenge`, `tmt-milestone`, `tmt-achievement` |
| Grid and forms | `tmt-grid`, `tmt-grid-row`, `tmt-grid-cell`, `tmt-grid-empty`, `tmt-form` |
| Displays | `tmt-bar`, `tmt-bar-base`, `tmt-bar-fill`, `tmt-bar-text`, `tmt-infobox`, `tmt-infobox-title`, `tmt-infobox-body`, `tmt-marker` |
| Layout | `tmt-layout-node`, `tmt-layout-section`, `tmt-layout-text`, `tmt-layout-image`, `tmt-layout-spacer`, `tmt-layout-toggle`, `tmt-layout-row`, `tmt-layout-column`, `tmt-layout-tabs`, `tmt-layout-embed`, `tmt-tabs`, `tmt-tab-panel`, `tmt-peek`, `tmt-embed-blocked`, `tmt-spacer`, `tmt-toggle` |
| Trees | `tmt-tree-viewport`, `tmt-tree`, `tmt-compact-tree`, `tmt-tree-center`, `tmt-tree-row`, `tmt-tree-rail`, `tmt-tree-left`, `tmt-tree-right`, `tmt-tree-slot`, `tmt-tree-node`, `tmt-item-tree`, `tmt-item-tree-content`, `tmt-item-tree-row`, `tmt-branch-container`, `tmt-branches` |
| Feedback | `tmt-popup-stack`, `tmt-popup`, `tmt-modal`, `tmt-modal-actions`, `tmt-tooltip-anchor`, `tmt-tooltip`, `tmt-tooltip-layer` |
| Panels and recovery | `tmt-back`, `tmt-engine-panel`, `tmt-options-panel`, `tmt-info-panel`, `tmt-changelog-panel`, `tmt-save-controls`, `tmt-save-error`, `tmt-form-error`, `tmt-recovery`, `tmt-endgame`, `tmt-raw-export`, `tmt-hidden` |

### State Classes

| Class | Meaning |
| --- | --- |
| `tmt-is-available` | Eligible purchase, click, grid, tree, challenge entry or completion, or reset |
| `tmt-is-locked` | Unavailable action, or unearned milestone/achievement |
| `tmt-is-bought` | Purchased upgrade |
| `tmt-is-active` | Active challenge or selected tab |
| `tmt-is-complete` | Earned milestone/achievement or challenge with completions |
| `tmt-is-maxed` | Challenge at its completion limit |
| `tmt-is-ghost` | Invisible reserved tree slot |
| `tmt-is-instant` | Bar with fill transitions disabled |
| `tmt-notify-action`, `tmt-notify-reset` | Action or reset glow on tree/tab controls |