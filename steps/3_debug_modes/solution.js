////////////////////////////////
// This step is about learning:
// * util.debuglog
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
//#endregion previous step - ignore

/**
 * @see
    https://nodejs.org/api/util.html#util_util_debuglog_section_callback
 */
import { debuglog } from 'util';
let debug = debuglog('SERVER');
let debugging = debug.enabled;

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
