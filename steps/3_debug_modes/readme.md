# Debug Modes

## Goal

Allow a module to progressively enhance itself to a debug mode
of operation.

## Action 1

Add a `debuglog` for the `"SERVER"` section that reacts to the `NODE_DEBUG` environment variable.

```mjs
import { debuglog } from 'util';
let debug = debuglog('SERVER');
let debugging = debug.enabled;
debug('Debugging!');
```

```console
NODE_DEBUG=server node server.js

set NODE_DEBUG=server
node server.js
```

```console
curl -v http://localhost:8080
```

See the "Debugging!" message in the console.

### Action 2

Log your HTTP connections and when they start/end.

```mjs
if (debugging) {
    debug('Serving Request %s %s', req.method, req.url);
    res.on('close', () => {
        debug('Ended Request %s %s', req.method, req.url);
    });
}
```