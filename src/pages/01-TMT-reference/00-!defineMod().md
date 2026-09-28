# defineMod()

defineMod() is the entrypoint to making a game with TMT. It should be called once per game, and already exists in the template's main.js.

All callbacks within defineMod() can be declared with a `context` argument to access relevant mod or layer context unless otherwise stated.

## Properties
defineMod() expects an object with certain properties:
- info
- layers
- pointGain
it may also contain certain optional properties: 
- nodes
- ui
- simulation
- canGeneratePoints
- update
- endgame
- winText
- saveVersion
- migrateSave
### info
The info property should be an object with certain properties:
- id: A string ID given to your game. It should be unique and is used in determining the location of your game's save data in LocalStorage.
- name: A string used to name your game.
- author: A string used to attribute your game to you, displayed in a few places.
- version: A string used to determine the **displayed** version fo your game. It should not be used for determining if or when saved data needs a migration.
- pointsName: A string used to determine what the main currency is called in your game.
- initialPoints: A DecimalSource value used to determine how much of your main currency a new player starts with.
- startLayer: A LayerHandle value used to determine which of your layers are displayed initially.
it may also contain an optional property:
- offlineLimitHours: A number used to determine how long players may be offline for before progress stops accumulating. Defaults to 1
### layers
The layers property should be an array of LayerHandle values. Layers created with defineLayer() but excluded from this array will not be used in any way at runtime, which will likely lead to issues.
### pointGain
The pointGain property should be a DecimalSource value or a DecimalSource-returning callback. It is used to determine how much of the main currency is gained per second.
### nodes 
The nodes property should be an array of NodeHandle values. Nodes created with defineNode() but excluded from this array will not be used in any way at runtime, which will likely lead to issues.
### ui
The ui property should be an object with any of these optional properties:
- mode: "tree" or "single", this controls whether the typical layer tree is shown in your game. Defaults to "tree".
- backgroundStyle: A style object or style object-returning callback that controls the style of the background of a page. Defaults to nothing.
- notifications: The notifications property should be an object with any of these optional properties:
    - enabled: A boolean value that controls whether notifications show up at all. Defaults to true.
    - maxVisible: A number value that controls how many notifications can be on screen at once. Defaults to 3.
    - durationMs: A number that controls how long a notification remains visible for, in milliseconds. Defaults to 3000.
### simulation
The simulation property should be an object with any of these optional properties:
- intervalMs: A number that controls how long a single "tick" is. Defaults to 50. Must be between 0 and 2147483647.
- maxTickSeconds: A number that controls how long a single online tick can take. Defaults to 3600. Must be positive.
### canGeneratePoints
The canGeneratePoints property should be a boolean value or a boolean-returning callback. When false, all main currency gain is skipped.
### update
The update property should be a void callback. It is run every tick immediately after main currency gain. Optionally, it can be declared with a `delta` argument which can be used as a delta-time multiplier. 
### endgame
The endgame property should be a boolean or boolean-returning callback. When endgame is evaluated to true and a user has not already seen the endgame panel, the endgame panel is shown. Defaults to false.
### winText
The winText property should be a string or string-returning callback. Its content is displayed on the endgame panel. It can contain arbitrary HTML strings. Defaults to "You won!".
### saveVersion
The saveVersion property should be a positive integer. It is used for determining if a loaded save requires migration. It should not be confused with `ui.version`, the displayed mod version. If it defined and greater than 1, migrateSave is a required property of defineMod; if migrateSave is not needed, saveVersion should not be incremented. Defaults to 1.
### migrateSave
The migrateSave property should be a void callback. It must be defined with arguments of `state` and `fromVersion`; `state` is used to access player state immediately after load, `fromVersion` is used to access the saveVersion of the save that has been loaded. migrateSave may not be defined with a `context` argument. migrateSave should be used when an update has required old save data to be updated to remain compatible with your game. After a successful migrateSave call, a save's stored saveVersion is updated to your defined saveVersion. 