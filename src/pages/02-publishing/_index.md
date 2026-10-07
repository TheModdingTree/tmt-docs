# Publishing

This page prepares your project for hosting, then walks through publishing it with GitHub Pages. You can, of course, use a different host for your game, but GH Pages is very easy since TMT is already built on Git and hosted on GitHub,

## Publish with GitHub Pages

Since you created a repository from the template, you can use GitHub Pages to host it very easily.

### Enable Pages

1. Open your game's repository on GitHub. Make sure your most recent changes are pushed.
2. Go to `Settings`, then `Pages`.
3. Under `Build and deployment`, make sure `Deploy from a branch` is selected.
4. Under `Branch`, select `main`.
5. Press `Save`. GitHub should begin deploying your site to its page!

## Check the Published Game

Open the public address and try the game there before sharing it:

- Check for errors and make sure images and styles load.
- Start fresh and play through the first few minutes.
- Save, refresh, and check that progress returns.
- Export a save and check that importing it works.
- If this updates an existing release, import a copy of an older save and check its progression and custom state.

If something works locally but fails online, start with [Troubleshooting](03).

:::note Saves Belong to the Browser and Domain
Publishing your project doesn't publish your local save. To continue your test game online, export it locally and import it on the public site.
:::

## Release Updates

Update `info.version` to show the new release, and use `saveVersion` with `migrateSave` when existing saved state needs conversion. Changing the displayed version alone doesn't migrate a save.

Keep an exported save from the previous release so you can test the next update against it. See [defineMod](01/00) for a migration example and [Saves and Errors](01/09) for save loading information.