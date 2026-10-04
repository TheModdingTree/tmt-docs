# defineResource()

`defineResource` connects a custom quantity to the engine's currency operations. The returned handle can be used for upgrade and buyable costs, challenge goals, reset resources, and context resource methods.

A resource doesn't create saved state, it relies on your backing state.

Shared types used on this page:

- `DecimalSource` {type: Decimal | ReadonlyDecimal | number | string}\
Input accepted by Decimal-valued fields and operations. See [Decimal](01/04) for more information.
- `Decimal` {type: object}\
A quantity with custom arithmetic and comparison methods. See [Decimal](01/04) for more information .
- `LayerHandle` {type: layer identity}\
Returned by [defineLayer](01/01). Exposes only the layer's `id` and `points` resource, with context used to access its state.

## Properties

- `name` {type: string} {required}\
The name of the resource.
- `owner` {type: LayerHandle} {optional}\
The layer which owns the resource.
- `get` {type: DecimalSource} {required} {callback-only}\
Runs as `get(context)` to read the balance.
- `set` {type: void} {required} {callback-only}\
Runs as `set(context, value)` to replace the balance.

The resource handle exposes only `name` and its `owner`. Keep and use the original handle.

The owner doesn't choose where values are stored or prevent access while its layer is locked. A getter or setter must use `context.stateOf(handle)` to reach layer state. 

## Built-in Resources

### points {type: DecimalResource}

The main currency resource exported by TMT. Reads and writes `context.player.points`. It has no owner, and its handle name is always `"points"`.

### layer.points {type: DecimalResource}

Each layer handle exposes its currency resource. Its owner is that layer and its name comes from the layer's `resource`. Reads and writes the layer's `points` state.

Item costs and challenge goals default to the current layer's currency. Normal and static resets select their base currency through `reset.resource`.

## Resource Operations

Use `context.getResource(handle)` to read a balance, and a writable context's `setResource`, `addResource`, and `spendResource` methods to change it. See [Reading State and Resources](01/06?s=reading-state-and-resources) and [Changing Resources](01/06?s=changing-resources) for signatures and behavior.

:::tip Tracking Currency
Direct resource writes to `layer.points` don't update `best` or `total`. Use `grantLayerPoints` when the gain should count toward those records.
:::

## Example

```js
const prestige = defineLayer({
    id: "prestige",
    name: "Prestige",
    symbol: "P",
    color: "#22f54c",
    row: 0,
    resource: "Prestige Points",
    startState: () => ({ energy: new Decimal(0) })
});

const energy = defineResource({
    name: "Energy",
    owner: prestige,
    get: context => context.stateOf(prestige).energy,
    set(context, value) {
        context.stateOf(prestige).energy = value;
    }
});
```