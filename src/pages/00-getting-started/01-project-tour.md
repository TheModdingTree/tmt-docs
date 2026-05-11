# A Brief Tour of The TMT Template

## index.js
index.js is your Mod's entrypoint and where your actual Mod definition goes.

Every index.js does the same thing (from top to bottom):
1. Imports necessary items from the SDK (more on the SDK in [TODO])
2. Imports your Layer files (more on Layer files in [TODO])
3. Creates your actual Mod using `createMod` (more on Mod setup in [Mod Setup](getting-started/mod-setup))
4. Creates and exports your Startup Options (more on Startup Options in [Mod Setup])
5. Exports your Mod!

## /src
/src is where you put your Layer files, each of which should define its own layer (more on Layer files in [TODO]).

### /src/prestige.js
/src/prestige.js is an extremely minimal example of a Layer, it does nothing except create a node on the tree.

See [TODO] for how to create your own Layer.

## /scripts
/scripts contains two sub-folders which contain important scripts for running your Mod and using TMT.

:::note Windows
Windows Users may be prompted to grant the scripts elevated permissions when running them. If you do not trust the scripts, feel free to read the source code to confirm they're safe.
:::
### /scripts/run
/scripts/run contains the scripts to run your Mod locally:
- Run `run-unix.sh` if you're on MacOS or Linux.
- Run `run-windows.bat` if you're on Windows 10 or 11.

Running your applicable script should automatically open your Mod in your browser! You only need to run your script once (until you close the page, of course), the page should automatically reload whenever you make changes.

### /scripts/update
/scripts/update contains the scripts to update the TMT Engine and the Runtime binaries which the `/run` scripts use to run your Mod:
- Run `run-unix.sh` if you're on MacOS or Linux.
- Run `run-windows.bat` if you're on Windows 10 or 11.

It is generally recommended to run these scripts often to ensure you're on the current version of TMT.

:::tip
You can join the TMT Discord Server to be notified as soon as updates release!
:::

## index.html
index.html is the file that tells your browser what to load.

Aside from modifying the location of your Mod's entrypoint (see [Tips And Tricks/Modifying The Entrypoint Location]) there is little to no value to be found in modifying this file unless you know what you're doing.

## /tmt
/tmt contains the TMT Engine and Runtimes, this folder can be safely ignored.

:::danger Here Be Dragons
It is recommended that you **do not modify these files under any circumstances**, doing so can easily break your copy of the Engine and will prevent the update scripts from working. If you wish to contribute to TMT, see [TODO].
:::

## Non-TMT Config Files
.gitignore, .gitmodules, and jsconfig.json are all project configuration files which are completely irrelevant to you and can safely be ignored.