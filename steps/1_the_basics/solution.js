////////////////////////////////
// This step is about learning:
// * package.json#type
// * events.once/events.on
// * top level await
////////////////////////////////


import http from 'http';


/**
 * @see
    https://nodejs.org/api/events.html#events_events_once_emitter_name_options
 */
import { once } from 'events';


const server = http.createServer((req, res) => {
  res.end();
});


server.listen(8080);
/**
 * @see
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await#top_level_await
 */
await once(server, 'listening');


// @ts-expect-error - TS cannot figure out it listened on 8080
const { port } = server.address();
/**
 * @see
    https://nodejs.org/api/util.html#util_util_format_format_args
 */
console.log('Server Listening on %s', port);
