# Migrating from 2.x to 3.x

Moving a 2.x game to 3.x is moving to a completely rewritten engine. Start with the current template and bring your game across a piece at a time. The formulas and ideas can stay, but the engine now uses modules, handles, and callback contexts to connect them.

This guide follows the usual 2.x `mod.js`, `addLayer`, `player`, and `tmp` APIs. If your mod changed the engine itself, you'll also need to check what those changes did and decide how to replace them.

## Before You Start

Keep a working copy of your 2.x project and export a few saves from different stages of the game. Work on the 3.x port separately, with a different `info.id` while testing.

Write down the results you expect at a few useful checkpoints: point gain, prestige gain, the next static cost, upgrade prices, and what survives each reset. These make it much easier to catch a port which runs but plays differently.

:::warning Keep the Old Game and Saves
3.x doesn't directly import 2.x save exports. Updating the engine files or reusing the old mod ID won't convert them. Keep the original exports until you've tested your own conversion or decided to start players fresh.
:::

## Work Through the Port

1. [Project and Mod Setup](04/00/00) moves global configuration into the new template.
2. [Context and State](04/00/01) replaces `player`, `tmp`, `this`, and global helpers.
3. [Layers and Resets](04/00/02) moves a layer into `defineLayer` and checks the reset behavior.
4. [Gameplay Features](04/00/03) covers upgrades, buyables, clickables, challenges, milestones, and grids.
5. [Pages and the Tree](04/00/04) rebuilds `tabFormat`, tabs, nodes, forms, and styling.
6. [Saves and Release Checks](04/00/05) covers legacy conversion and testing before players switch.

Get one layer working on a fresh save before bringing over the rest. Add one collection at a time, then reconnect its effects to your formulas. Save conversion is much easier once the new state layout has stopped moving around.

## The Largest Changes

| In 2.x | In 3.x |
| --- | --- |
| Files loaded through `modFiles` | JavaScript imports |
| Global `modInfo` and functions | One `defineMod` call |
| `addLayer("p", definition)` | Export a `defineLayer` handle and include it in `layers` |
| `player.p`, `this.layer`, and `tmp.p` | State and helpers on the current callback's `context` |
| Functions anywhere in a definition | Declared callback fields only. Helpers live outside the definition |
| `doReset` and `layerDataReset` | Reset targets, retention, and reset hooks |
| `tabFormat` component names and tuples | Layout objects under `ui.page` |
| Old player JSON | Versioned save data containing `state.player`, `state.layers`, and options |

The property tables in this guide help you find the new home for something, but you'll likely have to read this guide completely and some of [the reference](01) to fully understand how to port your game. If this scares you, try building a simple game with 3.x first to get a feel for it. 

In the end, 3.x was designed and built by a 2.x developer and creator with the goal of being more creator-friendly and significantly more powerful. Learning the new engine will take time, but it gives you significantly more freedom in what you can create and makes complex games much easier to maintain.