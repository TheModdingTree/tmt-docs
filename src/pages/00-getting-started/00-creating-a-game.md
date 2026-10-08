# Creating a Game

This page will walk you through creating, downloading, and running a new TMT game!

## What You'll Need

The only external dependency of TMT is Git. Open a terminal (PowerShell or Command Prompt on Windows) and run:

```sh
git --version
```

If that prints a version, you're ready. Otherwise, install [Git](https://git-scm.com/install) first. Git for Windows also installs Git Bash, which you can use for the commands below.

:::warning Use the Terminal for Setup
GitHub Desktop is a common solution for using basic Git and GitHub features on Windows. Unfortunately, TMT uses Git submodules, which GitHub Desktop has limited support for. Using Git in the terminal may seem scary at first, but this tutorial walks you through it step-by-step.

Who knows, maybe you'll realize Git isn't scary after all and stay in the terminal. You can still use GitHub Desktop to commit and push your game changes afterward if that isn't the case.
:::

## Create Your Repository

1. Open the [TMT Template](https://github.com/TheModdingTree/tmt-template) on GitHub.
2. Click `Use this template` to create your own repository!
3. Give it a name, then click `Code` and copy its HTTPS link.

Open a terminal in the folder where you want to keep your game. On Windows, you can use Git Bash. Run the following command, replacing the example URL with the one you copied:

```sh
git clone --recurse-submodules https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
```

The `--recurse-submodules` part downloads the engine, runtime, and updater along with your own files. Those live in separate repositories, but Git puts them in the template's `tmt` folder for you.

If you already cloned the game without that option, open a terminal inside the downloaded game folder and run:

```sh
git submodule update --init --recursive
```

Open the entire game folder in your editor. You should see `main.js`, `index.html`, `src`, `scripts`, and `tmt`.

## Update TMT

Before running your game for the first time, run the updater. Cloning downloads the engine and runtime versions recorded by the template, which may be behind the latest release.

Open the update launcher for your platform. For the terminal command, run it from your game folder:

| Platform | Launcher |
| --- | --- |
| Windows | `scripts/update/update-windows.bat` |
| macOS | `scripts/update/update-macos.command` |
| macOS or Linux terminal | `bash scripts/update/update-unix.sh` |

Choose `1` to update the current release branch, then follow the prompts. Wait for the updater to finish before continuing. If it reports that everything is already up to date, you're ready to go!

## Run Your Game

### Windows

Open `scripts/run/run-windows.bat`. Keep its terminal window open while you're working.

### macOS

Open `scripts/run/run-macos.command`. Keep its terminal window open while you're working.

:::note Those Familiar With the Terminal
If you're a user who already knows how a terminal works, or at least understands how to run commands in your IDE's built-in terminal, you can absolutely run the relevant script inside a terminal instead. For macOS, use `run-unix.sh` for direct terminal execution.
:::

### Linux

Open a terminal in the project folder and run:

```sh
bash scripts/run/run-unix.sh
```

## Try the Template

Your browser should open at `http://localhost:8080/`. If it doesn't, head there yourself. You should see points increasing and a green `P` node. 

Keep the runtime running while you edit. Save your file in the editor, then refresh the browser to see the change. The runtime serves the files but doesn't automatically refresh the page for you. To stop it, press Ctrl+C in its terminal.

## If Something Goes Wrong

- If the launcher says to clone submodules: run `git submodule update --init --recursive` from the project folder.
- If you opened `index.html` and the game doesn't start: use the launcher. Running the HTML file directly will not work.
- If the browser can't connect: check that the runtime is still running and that you're on the correct URL.
- If the launcher reports that the address is already in use: stop another running copy of the runtime, or the other program using port 8080, then launch again.
- If the game shows an error after an edit: check the reported file or property, correct the code, and refresh.

For more help with loading errors, saves, or gameplay problems, see [Troubleshooting](03).

Next, take a [brief tour of the project](00/01).