# Using The Console

After the game starts, the browser console exposes a `tmt` API and the `Decimal` constructor.

`tmt.layers` contains registered layer handles.
`tmt.snapshot()` returns a detached, readonly `{ player, layers }` object containing a full copy of the current state.

### tmt.edit

`tmt.edit` can used to directly modify state values. It functions the same as any other engine callback and receives a writable [mod context](01/06).

```js
tmt.edit(context => context.stateOf(tmt.layers.p).points = new Decimal(1));

tmt.edit(context => {
    context.player.points = new Decimal("1e100");
    context.grantLayerPoints(tmt.layers.b, 1000);
    context.reset(tmt.layers.b);
});
```

Thrown errors, invalid arguments, or invalid state enter the normal [fatal state](01/09). The API does not work while in this state.