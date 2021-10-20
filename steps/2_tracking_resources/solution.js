////////////////////////////////
// This step is about learning:
// * AsyncLocalStorage
// * FinalizationRegistry
////////////////////////////////

//#region previous step - ignore
import http from 'http';
import { once } from 'events';
//#endregion previous step - ignore

/**
 * @see
    https://nodejs.org/api/async_hooks.html#async_hooks_class_asynclocalstorage
 */
import { AsyncLocalStorage } from 'async_hooks';
const context = new AsyncLocalStorage();


/**
 * @see
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/FinalizationRegistry
 */
const cleanup = new FinalizationRegistry(([req, res]) => {
  console.log('closing dropped connection to ', req.url);
  try {
    res.writeHead(500);
    res.end();
  } catch {
  }
});


////////////////////////////////////////////
// Garbage maker for demonstrative purposes.
// Causes GC to occur periodically.
// * Can be removed for other steps.
////////////////////////////////////////////
setInterval(() => {
  [].concat(1);
}, 0);


const server = http.createServer((req, res) => {
  let GC = {};
  cleanup.register(GC, [req, res]);
  context.run(GC, () => {
    if (req.url === '/drop') {
      return;
    }
    res.end();
  });
});

//#region previous step - ignore
server.listen(8080);
await once(server, 'listening');

// @ts-expect-error - TS cannot figure out it listened on 8080
const { port } = server.address();
console.log('Server Listening on %s', port);
//#endregion previous step - ignore
