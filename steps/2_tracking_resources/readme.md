# Tracking Resources

## Goal

Ensure that connections are closed when all work associated with them are
dropped.

## Action 1

Add a if statement that if `req.url` is `'/drop'` the server returns early
without closing the connection.

Check that the route doesn't exit:

```console
node server.js
```

```console
curl -v http://localhost:8080
```

See how the `curl` never ends until TCP timeout (180s)!

### Action 2

Create a simple function that generates garbage to ensure the GC runs.

```mjs
// server.js

// ...
setInterval(() => [].concat(1), 0);
```

See it cause extra garbage collection using:

```console
node --trace-gc server.js
```

### Action 3

Use FinalizationRegistry to perform an action when `res` is being garbage
collected:

```mjs
const reaction = new FinalizationRegistry(([req, res]) => {
    console.log('closing dropped connection to ', req.url);
    res.end();
});

http.createServer((req, res) => {
    reaction.register(res, [req, res]);
});
```

Run again:

```console
node --trace-gc server.js
```

Notice that we never get a console message!

### Action 4

Use `AsyncLocalStorage` to track the async operations that may use `res` instead
of `res` directly.

```mjs
const reaction = new FinalizationRegistry(([req, res]) => {
    console.log('closing dropped connection to ', req.url);
    try {
        res.writeHead(500);
        res.end();
    } catch {
        res.end();
    }
});
const serverTaskTracker = new AsyncLocalStorage();

http.createServer((req, res) => {
    let GC = {};
    reaction.register(GC, [req, res]);
    serverTaskTracker.run(GC, () => {
        // ... all HTTP routing here
    });
});
```

Run again:

```console
node --trace-gc server.js
```

Notice that we do get a console message!