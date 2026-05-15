# Creating A Mod
Your mod must be created in your entrypoint, the default entrypoint being index.js.

Create a mod by using the `createMod()` function:
```javascript
const mod = createMod({
    layers: [ ],
    info: { },
})
```

## Configuring A Mod
The `createMod()` function accepts an object of specific properties. 

For beginners, it is recommended you set a few basic properties before diving into everything the function has to offer.
If you have done this before, the full reference for this function can be found on [its reference page](01/00).

### `layers`
As seen above, the object you pass into `createMod()` must have a `layers` property. This property expects an array of
your layer objects:
```javascript
const mod = createMod({
    layers: [ prestigeLayer, otherLayerYouCreate ],
    info: { },
})
```
See [Creating A Layer](TODO) for a guide on how to create your first layer.

### `info`
As also seen above, the object you pass into `createMod()` must have an `info` property. This property expects an object
of more specific properties.

Out of all of these "sub-properties" only `info.id` is technically required. This is the storage key for your mod and 
should be set to a unique string, otherwise your mod might end up sharing its place in 
[LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) with someone else's. 

It is also not technically required but strongly recommended that you set the following properties:
- `info.name`, the name of your mod!
- `info.author`, your name!
- `info.version`, the version of your mod. This must be written as a string, not a number. The "v" prefix is autofilled (you don't have to write it yourself).

Other properties that are commonly interesting are:
- `info.pointsName`, if you don't want your main currency to be called "Points".
- `info.startPoints`, this can be a number or a Decimal and is, as the name suggests, the amount of points a player starts with. If you don't set this players will start with zero points.

```javascript
const mod = createMod({
    layers: [ seeThePreviousSection ],
    info: {
        id: "VERY_UNIQUE_STRING_3826378268",
        name: "The Tree Tree",
        author: "FlamemasterNXF",
        version: "1.2.3",
        pointsName: "Pointy Points",
        startPoints: new Decimal(345)
    }
})
```

## The Optional Properties
The object passed into `createMod()` accepts a few other top-level properties which are important to understand but not 
relevant to or required for beginners. The upcoming [Advanced Features](00/04) section of this guide to delves into 
these properties and their associated features.

## Finishing Up

After creating your mod, it **must** be exported at the bottom of `index.js` like so:
```javascript
export default mod
```

:::warning
If your mod is not exported exactly as above the engine will be unable to locate your mod!
:::