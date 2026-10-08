# A Brief Tour of the Template

The template should contain the following: 

```text
main.js
index.html
tsconfig.json
src/
    prestige.js
assets/
    tmt.png
scripts/
    run/
    update/
tmt/
    engine/
    runtime/
    updater/
```

You'll spend most of your time in `main.js` and `src`. The other files help load, run, or edit your game.

## main.js

This is your game's entrypoint. It imports `defineMod` from `"tmt"`, imports the prestige layer, and calls `defineMod` to start the game.

The object passed to `defineMod` configures your game.

## src/prestige.js

This file defines the template's prestige layer and exports it as `prestige`.

As your game grows, put more layer files in `src`. Each file can export its own handle, which `main.js` imports and includes in the game.

## index.html

This is the page your browser loads. It creates the `#tmt` element, loads `main.js`, and links the engine's stylesheet.

Its import map makes `"tmt"` refer to `/tmt/engine/dist/tmt.js`, that's why your JavaScript can use a short import instead of a path to the engine folder!

## tsconfig.json

This configures your editor's JavaScript checking and tells it where to find TMT's declarations. Even though the files end in `.js`, your editor can suggest properties and point out mistakes using this configuration.

You can leave it as it is. The tsconfig is specifically designed to give JS users the advantages of TS at no cost.

## assets

This is a convenient place for your own images. The template includes `tmt.png`, which `index.html` uses as the browser tab's icon.

You can replace the icon later if you so choose.

## scripts

The `run` scripts start the local server. The `update` scripts fetch engine and runtime updates through Git.

You already used both in [Creating a Game](00/00). We'll cover later updates in [Finishing Up](00/06).

## tmt

:::danger Here Be Dragons
You should not, under any circumstances, modify these files or add files to this folder or its subfolders. These are the local copies of the TMT submodules you've read about previously. The updater manages them and will refuse to update submodules with local changes!
:::

These folders are Git submodules:

- `engine` contains the engine, including `dist/tmt.js`, its stylesheet, and declarations.
- `runtime` contains the programs used to serve the project.
- `updater` contains the update script.

Ready to make the template yours? Continue to [Configuring Your Game](00/02).