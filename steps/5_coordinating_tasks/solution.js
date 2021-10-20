////////////////////////////////
// This step is about learning:
// * timers/promises
// * Promise.race/Promise.all
// * AbortController
////////////////////////////////

//#region previous step - ignore
import http from 'http';
import { once } from 'events';
import { AsyncLocalStorage } from 'async_hooks';
const context = new AsyncLocalStorage();
const cleanup = new FinalizationRegistry(({ req, res }) => {
  try {
    res.writeHead(500);
    res.end();
  } catch {
    res.destroy();
  }
});

import { debuglog } from 'util';
let debug = debuglog('SERVER');
let debugging = debug.enabled;
//#endregion previous step - ignore


import { setTimeout } from 'timers/promises';


//#region previous step - ignore
const server = http.createServer((req, res) => {
  let GC = {};
  cleanup.register(GC, { req, res });
  context.run(GC, () => {
    if (debugging) {
      debug('Serving Request %s %s', req.method, req.url);
      res.on('close', () => {
        debug('Ended Request %s %s', req.method, req.url);
      });
    }
    if (req.url === '/drop') {
      return;
    }
    //#endregion previous step - ignore
    if (req.url === '/timer') {
      const controller = new AbortController();
      const { signal } = controller;


      setTimeout(5_000, null, { signal })
        .then(() => {
          if (!signal.aborted) {
            controller.abort();
            res.writeHead(500);
            res.end('TIMEOUT');
          }
        });
      once(res, 'close', { signal })
        .then(() => {
          if (!signal.aborted) {
            controller.abort();
            // closed normally
          }
        });
      return;
    }


    //#region previous step - ignore
    res.end();
  });
});

server.listen(8080);
await once(server, 'listening');

// @ts-expect-error - TS cannot figure out it listened on 8080
const { port } = server.address();
console.log('Server Listening on %s', port);
//#endregion previous step - ignore
