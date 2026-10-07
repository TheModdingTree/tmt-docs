# The TMT Reference

This section of the documentation contains everything about using TMT, described in detail.

If you're new to TMT, start with the [Getting Started Guide](00).

## Defining Your Game

- [defineMod()](01/00) creates the game and configures metadata, point generation, simulation, and save migration.
- [defineLayer()](01/01) defines layers, gameplay features, resets, and page layouts.
- [defineNode()](01/02) creates non-layer tree buttons.
- [defineResource()](01/03) connects saved quantities to engine operations.

## Calculations and Actions

- [Decimal](01/04) covers large quantities and their arithmetic.
- [Formatting](01/05) explains the five display helpers.
- [Context](01/06) lists callback properties, state access, and gameplay commands.
- [Popups and Modals](01/08) covers popups, confirmations, and prompts.

## Engine Behavior

- [Saves and Errors](01/09) covers saving, loading, migration, recovery, and errors.
- [Simulation](01/10) explains tick order and offline time.
- [Styling](01/11) lists CSS properties and UI behavior.
- [SDK and Types](01/12) covers the SDK imports, inference, and exported types. Primarily for advanced users.

## Reading the Badges

- {type: type} shows a property's value or a method's return value. For callback-only fields, it shows the callback's return value.
- {required} and {optional} show whether a field must be supplied.
- {required when: a condition applies} shows a conditional requirement.
- {callback} shows the property allows a callback returning the displayed value.
- {callback: type} shows a callback's return type when it differs from the direct value's type.
- {callback-only} shows the property requires callback rather than a direct value.
- {html} shows the property allows custom HTML.