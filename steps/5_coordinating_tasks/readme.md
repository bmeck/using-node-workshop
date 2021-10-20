# Coordinating Resources

## Goal

Show how to do work in parallel while also being able to stop excess work or
leaking memory.

## Action 1

Add a if statement that if `req.url` is `'/timer'` the server returns waits
5 seconds before closing the connection using `timers/promises`.

```mjs
import { setTimeout } from 'timers/promises';
// ...
    if (req.url === '/timer') {
      const timeout = setTimeout(5_000, new Error('timeout'))
        .then(() => {
          res.writeHead(500);
          res.end('TIMEOUT');
        });
      return;
    }
// ...
```

Check that the route does exit:

```console
node server.js
```

```console
curl -v http://localhost:8080
```

## Action 2

Add an event handler for `'close'` on the response.

## Action 3

Use an abort controller to ensure when the timeout or the close event occurs
that the other doesn't fire a callback.
