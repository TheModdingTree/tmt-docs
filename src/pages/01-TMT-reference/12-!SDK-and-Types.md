# SDK and Types

TMT's SDK provides the functions, handles, and declarations used to author a game. JavaScript, checked JavaScript, and TypeScript all use the same runtime. 

Using the template, everything you need can be imported through the alias `"tmt"`.

Most of the documentation here is not relevant to the majority of creators.

## Runtime Exports

| Export | Purpose | Reference |
| --- | --- | --- |
| `defineMod` | Define and start the game | [defineMod](01/00) |
| `defineLayer` | Create a layer | [defineLayer](01/01) |
| `defineNode` | Create a node | [defineNode](01/02) |
| `defineResource` | Connect state to engine resources | [defineResource](01/03) |
| `points` | Main currency resource handle | [defineResource](01/03) |
| `Decimal` | Construct and calculate large quantities | [Decimal](01/04) |
| `format`, `timeFormat`, `exponentialFormat`, `commaFormat`, `simpleFormat` | Display quantities and time | [Formatting](01/05) |

## Shared Types

- `Computable<Value, Context>` {type: Value | ((context: Context) => Value)}\
The value-or-callback indicated by a callback badge.
- `DeepReadonly<Value>` {type: protected view of Value}\
Recursively protects state, including Decimal mutators. Runtime contexts enforce the same access restrictions.
- `LayerHandle<State>` {type: layer identity}\
Carries `id`, `points`, and the custom-state relationship for editor inference. `State` describes the layer's custom saved fields.
- `AnyLayerHandle` {type: LayerHandle<object>}\
A layer handle without knowledge of its custom fields, useful for generic target lists.
- `NodeHandle` {type: node identity}\
Exposes the node's `id`.
- `TreeNodeHandle` {type: AnyLayerHandle | NodeHandle}\
Either kind of tree endpoint.
- `DecimalResource` {type: resource identity}\
Exposes `name` and `owner`. Getter/setter behavior belongs to the resource created by `defineResource`.
- `LayerState<State>` {type: LayerCoreState combined with custom State}\
Actual layer state. Engine fields keep their own rules when names overlap.
- `LayerInitialState` {type: initial engine fields}\
Engine field overrides accepted by `startState`.
- `Shown` {type: boolean | "ghost"}\
Tree visibility behavior.
- `TreeRow` {type: number | "left" | "right"}\
Visual tree placement.
- `BooleanStateKey<State>` {type: boolean field names}\
Top-level boolean keys in a layer's state, accepted by milestone and layout toggle `value` shorthands.
- `ValueBinding<Value, ReadContext, WriteContext>` {type: object}\
Connects an input to backing state through the following callbacks:
  - `get` {type: Value} {required} {callback-only}\
  Runs as `get(context)` to read the current value.
  - `set` {type: void} {required} {callback-only}\
  Runs as `set(context, value)` to write a value. Initialization doesn't invoke it to create state.

## Type Export Index

These names can be imported with `import type` in TypeScript. Generic `State` parameters describe the custom layer state.

| Exported types | Reference |
| --- | --- |
| `Decimal`, `DecimalSource`, `ReadonlyDecimal` | [Decimal](01/04) |
| `ConsoleApi`, `ConsoleSnapshot` | [Read and Edit State from the Console](03?s=read-and-edit-state-from-the-console) |
| `PlayerState` | [Main Player Context](01/06?s=main-player-context) |
| `LayerCoreState`, `LayerInitialState`, `LayerState` | [defineLayer’s startState](01/01?s=2) |
| `StyleValue`, `ClassValue` | [Styling](01/11) |
| `Computable`, `DeepReadonly`, `LayerHandle`, `AnyLayerHandle`, `NodeHandle`, `TreeNodeHandle`, `DecimalResource`, `Shown`, `TreeRow`, `BooleanStateKey`, `ValueBinding` | Shared Types above |
| `ModDefinition`, `ModInfo`, `ModUiDefinition`, `SimulationDefinition` | [defineMod](01/00) |
| `ShellLayoutNode`, `ShellTab` | [Custom Shell Layout](01/00?s=custom-shell-layout) |
| `ResourceDefinition` | [defineResource](01/03) |
| `NodeDefinition` | [defineNode](01/02) |
| `TreeNodeOptions<Context>`, `TreeConnection`, `TreeConnectionDefinition`, `HotkeyDefinition<State>`, `LayerUiDefinition<State>` | [defineLayer](01/01) |
| `ModReadContext`, `ModWriteContext`, `LayerReadContext<State>`, `LayerWriteContext<State>`, `ItemReadContext<State>`, `ItemWriteContext<State>` | [Context](01/06) |
| `ClickableReadContext<State, Value>`, `ClickableWriteContext<State, Value>`, `GridCellReadContext<State, Data>`, `GridCellWriteContext<State, Data>` | [Context](01/06) |
| `ResetCause`, `ResetReadContext<State>`, `ResetContext<State>` | [Context](01/06) |
| `UpgradeDefinition<State>`, `BuyableDefinition<State>`, `BuyableRespecDefinition<State>`, `ClickableDefinition<State, Value>`, `ItemBranchDefinition` | [defineLayer](01/01) |
| `ChallengeDefinition<State>`, `MilestoneDefinition<State>`, `MilestoneToggleDefinition<State>`, `AchievementDefinition<State>` | [defineLayer](01/01) |
| `GridDefinition<State, Data>`, `BarDefinition<State>`, `InfoboxDefinition<State>` | [defineLayer](01/01) |
| `FormValue`, `DropdownOption<Value>`, `DropdownConfiguration<State, Value>`, `FormDefinition<State, Value>`, `TextFormDefinition<State>`, `SliderFormDefinition<State>`, `DropdownFormDefinition<State, Value>` | [defineLayer](01/01) |
| `ResetDefinition<State>`, `NoResetDefinition`, `NormalResetDefinition<State>`, `StaticResetDefinition<State>`, `CustomResetDefinition<State>`, `ResetTargetRules`, `RetentionDefinition<State>`, `RetentionSelection` | [defineLayer](01/01) |
| `FeatureSection`, `LayoutNode<State>`, `SectionLayoutNode<State>`, `TextLayoutNode<State>`, `ImageLayoutNode<State>`, `SpacerLayoutNode<State>`, `ToggleLayoutNode<State>`, `RowLayoutNode<State>`, `ColumnLayoutNode<State>`, `TabsLayoutNode<State>`, `TabDefinition<State>`, `EmbedLayoutNode<State>`, `EmbedSource` | [defineLayer](01/01) |
| `PopupType`, `PopupRequest`, `NotificationDefinition`, `ModalOptions`, `PromptOptions<ReadContext>` | [Popups and Modals](01/08) |