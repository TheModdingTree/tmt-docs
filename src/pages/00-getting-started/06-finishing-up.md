# Finishing Up

You now have point generation, two reset layers, an upgrade, and a custom resource with a clickable. Let's give the game an ending and cover a few things you'll need as you keep working.

## Add a Goal

In `main.js`, add these properties to the `defineMod` object after `pointGain`.

```js
endgame: context => context.stateOf(crystals).points.gte(3),
winText: "You collected three Crystals and completed your first tree!"
```

At three crystals, the engine records the win and shows the endgame panel. Simulation pauses until the player chooses to `Keep Going!`. That choice resumes the game while keeping the win.

Refresh and play toward the goal. If your save already has three crystals, you should reach the ending on the next tick.

## Commit Your Work

When you're happy with your code, review and commit it:

```sh
git add -A
git commit -m "Build the first version of my tree"
```

That records the changes locally. Push through Git or GitHub Desktop when you're ready to add those commits to your repository.

## Changing a Game Which Already Has Saves

Keep the game's `info.id`, layer IDs, and feature IDs stable once you want saves to keep working. Renaming an upgrade's title is different from renaming the key which identifies it.

Adding the top-level `energy` field earlier worked because loading filled in a missing default. Renaming that saved field later needs a migration if you want to preserve its value.

`info.version` is for display. Use `saveVersion` and `migrateSave` when your saved layout changes in a way that needs conversion. Don't increase `saveVersion` just because you changed a cost or description.

The [defineMod reference](01/00) has a field-renaming example, and [Saves and Errors](01/09) explains loading and recovery. For early experiments you don't need to preserve, exporting and then using Hard Reset is another way to test fresh state.

## Updating TMT

Save your work and stop the runtime before updating. Use the same [update launcher](00/00?s=update-tmt) you ran when creating your game.

The updater shows the installed engine version and offers to update the current release branch, switch between stable and beta, or install a specific version. Most users should only ever need the first option.

The updater also updates the runtime and fetches its own update script.

After updating, start the game again and check that it still works. Commit the changed submodules so your repository records the version you're using.

## Where to Go Next

When you're ready to share your game, follow [Publishing](02) to put it online. If something isn't working, [Troubleshooting](03) covers common problems and how to investigate them.

Pick a feature which adds something to your game, then use its reference while you build it:

- [defineLayer](01/01) covers buyables, milestones, challenges, automation, tabs, and the rest of a layer's content.
- [defineResource](01/03) lets ordinary costs use a custom balance such as Energy.
- [Context](01/06) lists the actions and state available inside callbacks.
- [Decimal](01/04) and [Formatting](01/05) cover calculations and displaying large numbers.
- [Popups and Modals](01/08) lets you send messages or ask the player for a response.
- [Styling](01/11) explains how to give the game its own appearance.

A useful next exercise is a milestone on the crystal layer which lets the player keep the Doubler through a crystal reset. You'll need a milestone condition and a retention rule on prestige. Or try a buyable which increases energy generation, then show its production rate beside the balance.

You don't need to add every feature to make a game. Start with the loop you've built, play it, and decide what would make the next reset more interesting.

Good luck and have fun!