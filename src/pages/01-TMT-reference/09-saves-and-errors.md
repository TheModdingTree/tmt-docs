# Saves and Errors

The engine saves player state and player options together, with exact save behavior described below.

The engine also provides built-in error detection for both corrupted save data and errors you run into as you're playing, described below.

## Save Actions

### Save

The Save button and Ctrl+S write current state and options to LocalStorage with the current timestamp. Manual saving still works when periodic autosave is disabled. Ctrl+S is ignored while typing in editable controls, while a modal is open, or after a fatal error.

### Autosave

Defaults to once every `5000` milliseconds. Autosave stops when disabled, when a bad automatic load blocks writes, after a fatal error, or while a won game is paused before Keep Going.

The engine also attempts a save on `pagehide` under the same autosave conditions.

Startup, winning, Keep Going, successful import, hard reset, and option changes have their own immediate save attempts. Turning off periodic autosave doesn't disable these.

### Export

Opens a read-only multiline prompt containing encoded save data.

Recovery export includes corrupted save data.

### Import

Validates the encoding, mod identity, versions, options, migration result, and state before actually importing. An invalid import leaves the existing game and options as-is and displays a recoverable error in the prompt.

A successful import replaces state and options, clears temporary tabs, deep frames, panels, popups, and dialogs, then attempts to save. It doesn't grant offline progress from the imported timestamp.

### Hard Reset

Starts from fresh player and layer defaults, clears temporary UI state, preserves player options, and attempts to save immediately. The engine asks for confirmation when `confirmHardReset` is enabled.

This doesn't call `defineMod` again, rerun layer setup, or create another simulation. Layer `startState` hooks do run to create fresh state.

### Reset Options

Restores the engine options to their defaults and immediately attempts to save.

## Player Options

These options allow a player to control how a game functions. They aren't effected by a hard reset but are effected by an import.

- `autosaveEnabled` {type: boolean} {required}\
Allows interval and pagehide autosaves. Defaults to `true`.
- `autosaveInterval` {type: number} {required}\
Time between autosaves, in milliseconds. Must be an integer from `1` through `2147483647`. Defaults to `5000`. Invalid input in Settings displays an error.
- `offlineProgressEnabled` {type: boolean} {required}\
Allows offline progress. Defaults to `true`.
- `hotkeysEnabled` {type: boolean} {required}\
Allows gameplay hotkeys. Defaults to `true`. Engine Ctrl+S remains available regardless.
- `hideCompletedChallenges` {type: boolean} {required}\
Hides maxed challenges unless they are active. Defaults to `false`.
- `confirmHardReset` {type: boolean} {required}\
Requests confirmation before the UI hard-resets the game. Defaults to `true`.

An option change validates and updates the option, then attempts an immediate save.

`EngineOptions` isn't a named SDK export and options are not intended to be part of gameplay. Use layer state and form bindings for your own gameplay settings.

## Save Format

Automatic saves use the LocalStorage key `tmt::<mod ID>::save`. Saves are encoded using UTF-8 JSON represented as base64.

The decoded save data contains:

- `formatVersion` {type: number} {required}\
Engine save-format version. Currently exactly `1`.
- `modId` {type: string} {required}\
Must exactly match `info.id`.
- `saveVersion` {type: number} {required}\
Mod save version. Older versions trigger save migration.
- `savedAt` {type: number} {required}\
Save timestamp, in milliseconds. Used for offline progression calculation.
- `state` {type: object} {required}\
Saved player fields under `player` and saved layer fields under `layers`, keyed by layer ID.
- `options` {type: object} {required}\
All engine option values listed above.

### Decimal Encoding

In save data, a Decimal is represented by the following form to allow easy detection and reconstruction:

```json
{ "__tmt_decimal__": "1e1000" }
```

## Loading and Migration

Loading reads storage and decodes the save data. Then, if needed, `migrateSave(state, fromVersion)` runs once.

Missing layers, fields, and items receive their game defaults. Missing custom state, however, is not automatically added.

For example, loading saved `settings: { speed: 9 }` over default `settings: { speed: 1, autoBuy: false }` keeps the saved settings without adding `autoBuy`. A migration must add that nested default explicitly.

Layer or feature IDs present in the save data but not in the current game are rejected. Migration must remove or rename outdated IDs.

The saved active layer is kept when it is unlocked and non-deactivated. Otherwise, loading chooses the first available layer in mod order, with `info.startLayer` as the last fallback.

Finally, a successful load applies offline progress once and attempts a save with the current timestamp. New games and failed-load fallback state receive no offline progress. See [Simulation](01/10) for more information.

## Save Recovery

A corrupt, unsupported, or unmigratable save leaves the original stored save data untouched. The engine instead creates fallback state, displays recovery, and blocks ordinary saving from overwriting the unreadable save. 

:::tip Be a Helpful Player
If you ever run into save recovery, it likely means an issue has occurred with the game itself. Please export the original save and contact the game's creator, they will appreciate the bug report.
:::

## Fatal Errors

A thrown gameplay hook, invalid state, or any other fatal issue pauses the game and displays an error message. The fatal screen displays the failing path and error and offers  a save export.

:::tip Be a Helpful Player, II
Running into an error as a player is, unless you've been messing with the console, 100% a sign of an issue with the game itself. Just like save recovery, please export your save and contact the game's creator. Make sure you pass along the error message too!
:::
