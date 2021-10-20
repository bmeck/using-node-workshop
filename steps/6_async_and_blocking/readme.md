# Async and Blocking

## Goal

Demonstrate doing asynchronous work during a forced synchronous event.

## Action 1

START AN EMPTY server.js FILE.

Add an `"exit"` handler to the node process that tries to set a timeout to log a
message.

```mjs
process.on('exit', () => {
  console.log('Got exit.');
  setTimeout(() => {
    console.log('Exit done.');
  }, 3_000);
  process.exit();
});
```

```console
node server.js
```

Notice that we only get 1 of the 2 messages in the code and it doesn't wait 3 seconds.

## Action 2

Create a `Int32Array` using a `SharedArrayBuffer` and force the process to wait
using that.

```mjs
process.on('exit', () => {
  console.log('Got exit.');
  const lock = new Int32Array(new SharedArrayBuffer(4));
  Atomics.wait(lock, 0, 0, 3_000);
  console.log('Exit done.');
  process.exit();
});
```

## Action 3

Create a file `server_worker.js` that can notify `workerData.lock` after a
`setTimeout`.

```mjs
// server_worker.js
import { workerData } from 'worker_threads';

setTimeout(() => {
  workerData.lock = 1;
  Atomics.notify(workerData.lock, 0, 1);
}, 3_000);
```

Invoke `server_worker.js` during the `"exit"` event to perform async work.

```mjs
import { Worker } from 'worker_threads';

process.on('exit', () => {
  console.log('Got exit.');
  const lock = new Int32Array(new SharedArrayBuffer(4));
  new Worker(
    new URL('./server_worker.js', import.meta.url), {
      workerData: { lock }
    });
  Atomics.wait(lock, 0, 0, Infinity);
  console.log('Exit done.');
  process.exit();
});
```
