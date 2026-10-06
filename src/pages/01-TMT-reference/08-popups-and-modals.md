# Popups and Modals

Use popups for temporary messages and modals when you need the player's response.

## popup(request) {type: void}

Queues a popup with the following fields:

- `message` {type: string} {required} {html}\
Main content of the popup.
- `title` {type: string} {optional} {html}\
Heading above the message. Defaults to `""`.
- `type` {type: "info" | "milestone" | "achievement" | "challenge"} {optional}\
Selects the default popup appearance. Defaults to `"info"`.
- `color` {type: string} {optional}\
Overrides the popup background color. Defaults to the type's stock appearance. Automatic completion popups use the layer's color.
- `durationMs` {type: number} {optional}\
Visible lifetime in milliseconds. Must be an integer from `1` through `2147483647`. Defaults to `defineMod`'s `ui.notifications.durationMs`, which defaults to `3000`.

Milestone, achievement, and challenge completion popups are queued automatically after successful completion hooks.

Click a popup, or focus it and press Enter or Space, to dismiss it.

```js
onClick(context) {
    context.popup({
        title: "Energy Collected",
        message: "You gained <strong>10 Energy</strong>!",
        color: "#009696",
        durationMs: 2000
    });
}
```

## Shared Modal Options

Alerts, confirmations, and prompts use these fields:

- `message` {type: string} {required} {html}\
Main modal content.
- `title` {type: string} {optional} {html}\
Modal heading. Defaults to `"Alert"`, `"Confirm"`, or `"Prompt"` for the corresponding method.

## alert(options, onClose) {type: void}

Displays a message with a dismissal action.

- `onClose` {type: void} {optional} {callback-only}\
Runs as `onClose(context)` when the player closes the alert. Defaults to no action.

## confirm(options, onResult) {type: void}

Asks the player to accept or cancel an action.

- `onResult` {type: void} {required} {callback-only}\
Runs as `onResult(context, confirmed)`. `confirmed` is `true` for acceptance and `false` for cancellation.

```js
onClick(context) {
    context.confirm({
        title: "Reset This Layer?",
        message: "This will reset the layer! (wow)"
    }, (current, confirmed) => {
        if (confirmed) current.forceReset({ resetSource: true });
    });
}
```

Use `current` inside the result callback. The original `context` has already expired by the time the player responds.

## prompt(options, onResult) {type: void}

Requests text input using the shared modal options plus these fields:

- `initialValue` {type: string} {optional}\
Starting text. Defaults to `""`.
- `multiline` {type: boolean} {optional}\
Uses a textarea instead of a single-line input. Defaults to `false`.
- `readonly` {type: boolean} {optional}\
Prevents editing, useful for copying generated text. Defaults to `false`.
- `validate` {type: true | string} {optional} {callback-only}\
Runs as `validate(context, text)` when text is submitted. Return `true` to accept it, or an error message to keep the same prompt open. Defaults to accepting any text.

The result callback is the second argument:

- `onResult` {type: void} {required} {callback-only}\
The second argument to `prompt`, not a field inside `options`. Runs as `onResult(context, text)` with accepted text, or `null` on cancellation.

```js
onClick(context) {
    context.prompt({
        title: "Name Your Pet",
        message: "Choose a name!",
        initialValue: context.layerState.petName,
        validate: (current, text) => text.trim() !== "" || "Please choose a name!"
    }, (current, text) => {
        if (text !== null) current.layerState.petName = text.trim();
    });
}
```