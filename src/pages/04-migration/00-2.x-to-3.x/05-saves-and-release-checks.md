# Saves and Release Checks

Get the port working on a fresh save before testing converted progress. That separates mistakes in gameplay code from mistakes in the converter.

Save migration from 2.x saves is difficult and tedious. It is not required or expected by any means. Regardless, this page lays out how something like that could work.

## What migrateSave Can('t) Do

`migrateSave(state, fromVersion)` upgrades the state of accepted 3.x save data. The engine checks the data's format and mod identity before calling it.

A stock 2.x export contains the old player object. It doesn't have the new format, so setting `saveVersion: 2` won't make the old export reach your callback.

:::note Engine version vs formatVersion vs info.version vs saveVersion
There are four versions at play here: the engine version, formatVersion, info.version, and saveVersion. The engine version is the public TMT version, 3.x; formatVersion is the engine's save format version, which is new in 3.x and therefore detached from the public version; info.version is a game's public/display version; and saveVersion is a game's save format version (only to be incremented when migration is needed).
:::

Convert legacy exports outside the normal migration callback, then import the resulting 3.x save through the game's save controls. Subsequent changes to that 3.x state can use `migrateSave` normally.

## Map the State

| 2.x state | 3.x destination or treatment |
| --- | --- |
| Root `points`, `timePlayed` | `state.player.points`, `state.player.timePlayed` |
| `player.p` | `state.layers.p`, if you kept the layer ID `"p"` |
| Upgrade, milestone, and achievement ID arrays | Records such as `{ "11": true }` |
| Buyable amounts | Decimal amounts under declared string IDs |
| Challenge completions | Integer counts under declared string IDs |
| `activeChallenge` | A declared string ID or `null` |
| Grid keys such as `101` | Keys such as `"1:1"` |
| Global `player.infoboxes.p` | The layer's `infoboxes` record |
| Fields from `addedPlayerData()` | Chosen custom fields on a layer |
| Old bound input values | Their new backing fields, or declared entries in `inputs` |
| `tab` | Choose a valid included layer for `state.player.activeLayer` |
| `subtabs`, `navTab`, cached notifications, navigation history | Leave out, the new UI initializes its own state |
| Old version, time, and offline info | Map deliberately to the new format or omit |
| Old engine options | Map supported settings into a complete 3.x `options` record |

Don't spread the entire old player object into `state.player`, it is immutable. Don't spread entire old layer objects either, old engine state can become accidental custom saved state.

Preserve only IDs which still exist, and provide explicit mappings for renamed layers and features. Check challenge limits, buyable limits, dropdown choices, and grid coordinates against the new definitions.

Decimals need conversion too. The new encoded representation is `{ "__tmt_decimal__": "1e1000" }`. A custom field initialized with a Decimal must receive the intended Decimal value, not an ordinary string which merely looks like one.

## A Small Converter Example

This example is only for the small prestige mod used earlier in this guide. It keeps points, play time, the `"p"` layer's currency records, and upgrade `"11"`. It intentionally leaves out every other old layer and feature, resets endgame flags, and uses default engine options.

Expand those mappings before using it for a larger game. The target mod has `info.id: "my-tree-v3"`, `saveVersion: 1`, and the layer from [Layers and Resets](04/00/02).

Put this in a separate converter module which can import the new SDK. It receives an already decoded 2.x player object and returns an importable save string. It doesn't write to LocalStorage or change either running game.

```js
import {Decimal} from "tmt";

function createDecimalTag(value) {
    if (typeof value !== "number" && typeof value !== "string") {
        throw new Error("Expected a legacy Decimal string or number");
    }
    if (typeof value === "string" && value.trim() === "") {
        throw new Error("A quantity cannot be blank");
    }
    const amount = new Decimal(value);
    if (!amount.isFinite()) throw new Error("A quantity must be finite");
    return {__tmt_decimal__: amount.toString()};
}

export function convertLegacyPlayer(legacy) {
    const old = legacy.p;
    if (!old) throw new Error("The legacy save has no prestige layer!");

    const owned = old.upgrades ?? [];
    if (!Array.isArray(owned)) throw new Error("Expected an upgrade ID list");

    const save = {
        formatVersion: 1,
        modId: "my-tree-v3",
        saveVersion: 1,
        savedAt: Date.now(),
        state: {
            player: {
                points: createDecimalTag(legacy.points),
                timePlayed: legacy.timePlayed ?? 0,
                won: false,
                keepGoing: false,
                activeLayer: "p"
            },
            layers: {
                p: {
                    unlocked: old.unlocked ?? true,
                    points: createDecimalTag(old.points),
                    best: createDecimalTag(old.best ?? old.points),
                    total: createDecimalTag(old.total ?? old.points),
                    resetTime: old.resetTime ?? 0,
                    upgrades: owned.some(id => String(id) === "11")
                        ? {"11": true}
                        : {}
                }
            }
        },
        options: {
            autosaveEnabled: true,
            autosaveInterval: 5000,
            offlineProgressEnabled: true,
            hotkeysEnabled: true,
            hideCompletedChallenges: false,
            confirmHardReset: true
        }
    };

    const bytes = new TextEncoder().encode(JSON.stringify(save));
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary);
}
```

Use `JSON.parse(atob(exportText))` in a 2.x engine to obtain `legacy`.

## Test Converted Saves

Use at least an early save, a late save, and one from an unusual state such as an active challenge. For each one:

1. Convert a copy and import it into the port.
2. Check balances, ownership, completions, custom fields, and automation settings.
3. Buy something and perform every reset which affects that state.
4. Save, reload, and check the state again.
5. Export from 3.x and confirm that the exported save can be imported back.

Import doesn't trigger offline progress from the imported timestamp, only loading does. Test offline behavior separately, particularly if old automation depended on many small updates.

Keep the original legacy exports after a successful test. The example converter only produces a new string, so there is no reason to replace the originals while developing it.

## Gameplay Checks Before Release

Compare the checkpoints you recorded from the old game:

- Main gain, prestige gain, static costs, and softcaps.
- Each currency used for costs and each challenge goal.
- Default purchases versus custom payment, Buy Max, selling, and respec.
- Incoming resets, retained state, base-resource clearing, and challenge entry/exit.
- Locked and deactivated layers, automation order, and offline progress.
- Tabs, hotkeys, amd forms.
- Endgame, Keep Going, and a save made after winning.

Once the port and conversion are ready, explain to players where to export from the old game and how to import into the new one. Keep the old release available long enough for them to retrieve their saves.