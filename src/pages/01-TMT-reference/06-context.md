# Context

`context` is how callbacks read saved state and perform gameplay actions.

Shared types used on this page:

- `DecimalSource` {type: Decimal | ReadonlyDecimal | number | string}\
Input accepted by Decimal-valued fields and operations. See [Decimal](01/04) for more information.
- `Decimal` {type: object}\
A quantity with arithmetic and comparison methods. See [Decimal](01/04) for more information.
- `ReadonlyDecimal` {type: protected Decimal}\
Supports Decimal calculations without allowing changes to its value. See [Decimal](01/04) for more information.
- `LayerHandle` {type: layer identity}\
Returned by [defineLayer](01/01). Exposes only the layer's `id` and `points` resource, with context used to access its state.
- `DecimalResource` {type: resource identity}\
Identifies a currency through the exported `points`, a layer's `points`, or [defineResource](01/03). Exposes its `name` and `owner`.
- `PlayerState` {type: object}\
Main saved state. See [Main Player Context](01/06?s=main-player-context) for its fields.
- `LayerState` {type: object}\
Actual layer state, combining engine fields with custom fields from `startState`. See [defineLayer’s startState](01/01?s=2) for the fields and their defaults.

## Contexts

### Main Player Context

The following fields are available directly through `context.player`:

- `points` {type: Decimal} {required}\
Main currency balance. Starts at `info.initialPoints`.
- `timePlayed` {type: number} {required}\
Play time in seconds, including offline time.
- `won` {type: boolean} {required}\
Whether the endgame condition has been reached.
- `keepGoing` {type: boolean} {required}\
Whether the player has made the choice to continue after winning. A won game is paused until this is `true`.
- `activeLayer` {type: string} {required}\
ID of the persistent selected layer. Deep navigation has its own temporary stack and doesn't set this field.

### Mod Contexts

`ModReadContext` is used by mod calculations, resource getters, and node display callbacks. `ModWriteContext` is used by mod update hooks, resource setters, and node click hooks.

- `player` {type: PlayerState} {required}\
Read contexts protect this state from mutation, write contexts allow changes to its existing fields.

### Layer Contexts

`LayerReadContext` and `LayerWriteContext` add the current layer and default local operations to it.

- `layer` {type: LayerHandle} {required}\
Current layer handle.
- `layerState` {type: LayerState} {required}\
Current layer state. Has the same access rules as `stateOf(context.layer)`.

Layer callbacks, bars, page layout calculations, and hotkeys use these contexts.

### Item Contexts

`ItemReadContext` and `ItemWriteContext` add the current item to the layer context. Upgrades, buyables, challenges, milestones, achievements, infoboxes, and forms use item contexts for their callbacks.

- `id` {type: string} {required}\
Current item ID. It belongs to the collection whose callback is running.

### Clickable Contexts

`ClickableReadContext` and `ClickableWriteContext` also provide:

- `value` {type: inferred clickable value} {required}\
Current clickable value, protected from direct mutation even in write hooks. Initialize it with `initialValue`.

`setValue(value)` replaces the whole value from a clickable write hook. See its entry below.

### Grid Contexts

`GridCellReadContext` and `GridCellWriteContext` provide:

- `row` {type: number} {required}\
Cell row, starting at `1`.
- `column` {type: number} {required}\
Cell column, starting at `1`.
- `key` {type: string} {required}\
Cell address such as `"2:3"`.
- `data` {type: inferred grid payload} {required}\
Current cell value. Nested data can be changed in grid write hooks. Use `setGridData` to replace the whole value, since the context property itself cannot be mutated.

Grid dimensions use layer contexts. Cell calculations and interactions use grid contexts.

### Reset Contexts

`retention` uses `ResetReadContext`, `onReset` uses `ResetContext`. Their current layer is the reset target.

- `kind` {type: "self" | "incoming"} {required}\
The type of reset occurring.
- `cause` {type: "prestige" | "challenge-enter" | "challenge-exit" | "forced"} {required}\
Operation which started the reset.
- `source` {type: LayerHandle} {required}\
Layer which initiated the reset.
- `target` {type: LayerHandle} {required}\
Layer whose state is being handled.
- `gain` {type: ReadonlyDecimal} {required}\
Awarded prestige currency. Forced and challenge resets use `0`.
- `previousTargetState` {type: LayerState} {required when: the target state was reset}\
Read-only view of the old target state.

See [defineLayer](01/01?s=4) for more information on resets and retention.

## Method Arguments

The following arguments are shared by all method entries below:

- `layer` {type: LayerHandle} {required when: called from a mod context}\
Target layer. Defaults to the current layer in layer, item, clickable, grid, and reset contexts. `stateOf` and `grantLayerPoints` always expect a handle.
- `id` {type: string} {required}\
Item ID in the selected layer.
- `resource` {type: DecimalResource} {required}\
Currency to read or change.
- `key` {type: string} {required when: using a grid key overload}\
A cell's `"row:column"` address.
- `row`, `column` {type: number} {required when: using a grid coordinate overload}\
Integer coordinates from `1` through `1000`.
- `interval` {type: number} {required when: calling a hold method}\
Elapsed seconds for one hold invocation. Direct calls can use `0`.

A method returning `false` means a non-erroring action wasn't performed, such as trying to buy an unaffordable upgrade.

## Reading State and Resources

### stateOf(layer) {type: LayerState}

Returns the current state of the layer handle. Read contexts return protected views, write contexts return writable views. The handle argument must be supplied.

### getResource(resource) {type: Decimal}

Runs the resource getter and returns a copy. Changing that result doesn't update the resource.

### getResetGain(layer) {type: Decimal}

Calculates the current prestige gain without performing a reset. A reset can report a gain of `1` before it is affordable but may not be actually obtainable, use `canReset` to check availability. No-reset layers report zero. Locking or deactivation doesn't suppress this calculation.

### getNextRequirement(layer) {type: Decimal}

Calculates the next reset requirement. No-reset layers report zero. Custom resets use their callback. Locking or deactivation doesn't suppress this calculation.

### canReset(layer) {type: boolean}

Checks the reset definition's current conditions. Locking alone doesn't make this return `false`, deactivation does.

## Reading Features

### hasUpgrade(id, layer) {type: boolean}

Checks purchased ownership while the layer is active. Deactivation makes it return `false` without effecting the actual purchase state.

### getBuyableAmount(id, layer) {type: Decimal}

Returns a copy of the saved amount, including while the layer is deactivated.

### getClickableState(id, layer) {type: any}

Reads the current clickable value.

### hasChallenge(id, layer) {type: boolean}

Checks whether the challenge has at least one completion and its layer is not deactivated. Doesn't indicate whether the challenge is currently running.

### getChallengeCompletions(id, layer) {type: number}

Returns the saved completion count, including while the layer is deactivated.

### inChallenge(id, layer) {type: boolean}

Checks whether the challenge is active, or the active challenge directly lists this ID in `countsAs`. Deactivated layers return `false`.

### hasMilestone(id, layer) {type: boolean}

Checks milestone completion while the layer is not deactivated.

### hasAchievement(id, layer) {type: boolean}

Checks achievement completion while the layer is not deactivated.

### getGridData(key, layer) {type: any}

Also accepts `getGridData(row, column, layer)`. Reads grid data.

### getInput(id, layer) {type: any}

Reads the form's saved value or calls its binding getter. Sliders return a value clamped to their current bounds without changing saved state.

### Effect Getters {type: any}

- `getLayerEffect(layer)` evaluates the layer effect.
- `getUpgradeEffect(id, layer)` evaluates an owned upgrade's effect.
- `getBuyableEffect(id, layer)` evaluates a buyable's effect, including at amount zero.
- `getClickableEffect(id, layer)` evaluates a clickable's effect.
- `getChallengeEffect(id, layer)` evaluates a challenge's reward after at least one completion.
- `getMilestoneEffect(id, layer)` evaluates an earned milestone's effect.
- `getAchievementEffect(id, layer)` evaluates an earned achievement's effect.
- `getGridEffect(key, layer)` evaluates a grid cell's effect. Also accepts `getGridEffect(row, column, layer)`.

Missing effects and effects suppressed by deactivation return `undefined`. Feature visibility doesn't automatically gate an effect either.

Dynamic getters expose `any` in the current SDK so ordinary JavaScript code can consume authored values without annotations.

## Changing Resources

These operations use a writable context.

- `value` {type: DecimalSource} {required}\
Amount to write, add, spend, or grant. Must be finite.

### setResource(resource, value) {type: void}

Replaces the resource balance through its setter.

### addResource(resource, value) {type: void}

Adds a signed amount through the getter and setter.

### spendResource(resource, value) {type: boolean}

Returns `false` if the current balance is below the requested amount. Otherwise subtracts it and returns `true`. Negative spending can increase the balance.

### grantLayerPoints(layer, value) {type: void}

Adds a signed amount to points and total, then raises best if the resulting points exceed it.

## Resets

### reset(layer) {type: boolean}

Attempts a prestige reset. Checks availability, grants currency, and runs the reset sequence. Returns `false` when unavailable.

### forceReset(options) {type: boolean}

The options argument can include:
- `layer` {type: LayerHandle} {required when: called from a mod context}\
Source layer. Defaults to the current layer in a layer-scoped context.
- `resetSource` {type: boolean} {optional}\
When `true`, resets the triggering layer.

The options argument must be supplied, even when using `context.forceReset({})` locally.

Runs forced reset effects without granting currency or checking prestige currency affordability. Rejects a deactivated source, but can act on a locked one.

## Purchases

### buyUpgrade(id, layer) {type: boolean}

Buys an upgrade. Checks cost and affordability, pays, records ownership, and calls `onPurchase`.

### buyBuyable(id, layer) {type: boolean}

Buys one level of a buyable. Checks visibility, affordability, and purchase limit, then performs payment and increment before `onPurchase`.

### buyMaxBuyable(id, layer) {type: boolean}

Runs a buyable `buyMax` hook after normal purchase eligibility checks. Returns `false` without that hook. It doesn't repeatedly buy-one or automatically spend, increment, or invoke `onPurchase`.

### sellOneBuyable(id, layer) {type: boolean}

Runs a buyable `sellOne` hook after availability and `canSellOne` checks. Returns `false` without the hook.

### sellAllBuyable(id, layer) {type: boolean}

Runs a buyable `sellAll` hook after availability and `canSellAll` checks.

### respecBuyables(layer) {type: boolean}

Runs a `buyableRespec.onRespec` hook. Doesn't open the UI confirmation dialog.

## Clickables

### setClickableState(id, value, layer) {type: boolean}

Replaces the saved value. Can update locked, hidden, or deactivated features. Returns `true` after write.

### setValue(value) {type: boolean}

Available in clickable write contexts. Replaces that clickable's value using the same rules as `setClickableState`.

### clickClickable(id, layer) {type: boolean}

Checks interaction eligibility and runs `onClick`. Without a hook, toggles a boolean value.

### holdClickable(id, interval, layer) {type: boolean}

Runs a clickable `onHold` hook. Returns `false` without that hook. Doesn't start a timer or repeat automatically.

## Grids

### setGridData(key, value, layer) {type: boolean}

Also accepts `setGridData(row, column, value, layer)`. Replaces a grid cell value. Returns `true` after a valid write.

### clickGrid(key, layer) {type: boolean}

Also accepts `clickGrid(row, column, layer)`. Runs a grid cell `onClick` hook.

### holdGrid(key, interval, layer) {type: boolean}

Also accepts `holdGrid(row, column, interval, layer)`. Runs a grid cell hold hook. Doesn't start a hold timer.

## Challenges

### enterChallenge(id, layer) {type: boolean}

Enters a challenge when no challenge is active and this one isn't maxed. Runs its challenge-enter reset, then calls `onEnter`.

### completeChallenge(id, layer) {type: boolean}

Attempts to reward completions to the active challenge ID. Caps the reward at the completion limit. If successful, calls `onComplete` and leaves the challenge active. A failed reward returns `false`.

### exitChallenge(id, layer) {type: boolean}

Checks the active challenge ID's exit conditions, attempts a completion, clears the active ID, calls `onExit`, then runs the challenge-exit reset. The stock Complete button uses this exit operation.

## Milestones

### toggleMilestone(id, toggleIndex, layer) {type: boolean}

- `toggleIndex` {type: number} {required}\
The index of a toggle to toggle. An index outside the defined list returns `false`.

Reverses a milestone toggle's state.

## Forms

### setInput(id, value, layer) {type: boolean}

Checks layer and form availability, normalizes the submitted value, writes the value or calls the binding setter, then invokes `onChange`. Sliders clamp to their bounds but aren't rounded to `step`. An unavailable dropdown choice returns `false`.

## Popups and Modals

The following write methods are described in [Popups and Modals](01/08):

- `popup(request)` {type: void}\
Queues a popup.
- `alert(options, onClose)` {type: void}\
Opens an informational modal.
- `confirm(options, onResult)` {type: void}\
Opens a confirmation modal.
- `prompt(options, onResult)` {type: void}\
Opens a modal which requires player input.