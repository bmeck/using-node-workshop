////////////////////////////////
// This step is about learning:
// * Atomics.wait/Atomics.notify
// * Worker
////////////////////////////////

import { Worker } from 'worker_threads';

process.on('exit', () => {
  console.log('Got exit.');
  const lock = new Int32Array(new SharedArrayBuffer(4));
  new Worker(
    new URL('./solution_worker.js', import.meta.url), {
    workerData: { lock }
  });
  Atomics.wait(lock, 0, 0, Infinity);
  console.log('Exit done.');
  process.exit();
});
