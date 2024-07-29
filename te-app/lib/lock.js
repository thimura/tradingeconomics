/**
 * A class that implements a simple locking mechanism to ensure that only one process
 * can access a critical section of code at a time.
 */
class Lock {
  /**
   * Creates an instance of the Lock class.
   * Initializes an empty queue and sets the lock status to false.
   */
  constructor() {
    this.queue = [];
    this.locked = false;
  }

  /**
   * Acquires the lock. If the lock is already acquired, it adds the process to the queue.
   * When the lock is released, the next process in the queue is resolved.
   *
   * @returns {Promise<void>} A promise that resolves when the lock is acquired.
   */
  acquire() {
  return new Promise((resolve) => {
    this.queue.push(resolve);
    if (!this.locked) {
      this.locked = true;
      this._next();
    }
  });
  }

  /**
   * Resolves the next process in the queue if available. If no processes are in the queue,
   * it sets the lock status to false.
   *
   * @private
   */
  _next() {
    if (this.queue.length > 0) {
      const resolve = this.queue.shift();
      resolve();
    } else {
      this.locked = false;
    }
  }

  /**
   * Releases the lock and resolves the next process in the queue.
   */
  release() {
    this._next();
  }
}

export { Lock };