import { workerData } from 'worker_threads';

setTimeout(() => {
  workerData.lock[0] = 1;
  Atomics.notify(workerData.lock, 0);
}, 3_000);
