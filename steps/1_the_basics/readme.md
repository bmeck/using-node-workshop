# The Basics

## Goal

Create a server that runs as ESM and use `await` to wait for it to start
accepting connections.

## Action 1

Install Node >= 14.18.1 , preferably 16.11.1 :
- https://nodejs.org/en/download/current/

Create a new directory for our server project.

Run `npm init -y`.

Edit `package.json` to have `"type": "module"`.

## Action 2

Create a file `server.js`.

Add a simple HTTP server that closes all connections with a valid HTTP response.

```mjs
import http from 'http';
let server = http.createServer((req, res) => {
    res.end();
});
server.listen(8080);
server.on('listening', () => {
    // @ts-expect-error - TS cannot figure out it listened on 8080
    const { port } = server.address();
    /**
     * @see
        https://nodejs.org/api/util.html#util_util_format_format_args
    */
    console.log('Server Listening on %s', port);
});
```

## Action 3

Refactor from a callback to top level `await` using `events.once`.

```mjs
// ...
import { once } from 'events';
// ...
await on(server, 'listening');
// @ts-expect-error - TS cannot figure out it listened on 8080
const { port } = server.address();
/**
 * @see
    https://nodejs.org/api/util.html#util_util_format_format_args
 */
console.log('Server Listening on %s', port);
```
