# Creating A Project

This page will walk you through how to create and download a brand-new TMT project.

## Prerequisites

TMT's Engine and Template Project are publicly stored in GitHub Repositories, meaning all users must have 
[Git](https://git-scm.com/install) installed for TMT's update scripts to work (you will also need to use it to initially 
download your project).

:::warning
If you've used GitHub in the past, you may have installed GitHub Desktop. While you can technically download your
project using GitHub Desktop, we still recommend installing Git Bash to ensure TMT's update scripts that run Git
commands work properly. 
:::

:::tip For MacOS or Linux Users
If you run MacOS or Linux, Git is likely pre-installed on your machine. To check, open up a terminal (we'll be needing 
one later anyway) and run `which git`. If it returns a file path and not "git not found" you already have Git!
:::

## Creating a New TMT Project

1. Navigate to the [TMT Template](https://github.com/TheModdingTree/tmt-template).
2. Click the green `Use Template` button, click `Create a new repository`, and then follow GitHub's prompts (note that the name you choose here will be used for your project's public link).
3. Copy your new repository's URL.

### Finishing Up: Windows

1. In the Start Menu, search and open `Git Bash`. If you don't commonly use a terminal don't be intimidated, we're only running two simple commands here.
2. Use `cd` (Change Directory) to move into the folder you want your TMT Project to be stored in. If you want it to be in your Documents, `cd Documents`.
3. Run `git clone <paste your repository link here>`. The angle brackets are purely to show you where to paste the link, don't include them in the real command.

### Finishing Up: MacOS and Linux

1. Open up your terminal of choice. If you don't commonly use a terminal don't be intimidated, we're only running two simple commands here.
2. Use `cd` (Change Directory) to move into the folder you want your TMT Project to be stored in. If you want it to be in your Documents, `cd Documents`.
3. Run `git clone <paste your repository link here>`. The angle brackets are purely to show you where to paste the link, don't include them in the real command.

Congratulations! You have now created and downloaded your project! Head over to the [Project Tour](00/01) if this is 
your first time, otherwise you can begin coding following [Creating A Mod](00/02)!