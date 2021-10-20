# The Inspector

## Goal

Interact with the inspector.

## Action 1

```console
node --inspect-brk server.js
```

Connect to the process using a Chromium based browser (Edge / Chrome) by
navigating to `chrome://inspect`.

## Action 2

Add a npm `"start"` script that runs `node server.js`.

```console
npm start --inspect-brk
```

See that it fails to prompt for the inspector because it became:
- `node server.js --inspect-brk`

```console
npm start --node-options="--inspect-brk"
```

See it prompts for the inspector.
