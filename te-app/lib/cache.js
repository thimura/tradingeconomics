import NodeCache from 'node-cache';

/**
 * Instance of NodeCache used for caching data.
 * @type {NodeCache}
 */
const myCache = new NodeCache({ stdTTL: 500, checkperiod: 200 });

/**
 * Retrieves a cached value by its key.
 *
 * @param {string} key - The key of the cached item to retrieve.
 * @returns {*} The cached value if found, otherwise `undefined`.
 */
export const getCache = (key) => {
  return myCache.get(key);
};

/**
 * Sets a value in the cache with a specific key.
 *
 * @param {string} key - The key to associate with the value.
 * @param {*} value - The value to cache.
 */
export const setCache = (key, value) => {
  myCache.set(key, value);
};

/**
 * Deletes a cached item by its key.
 *
 * @param {string} key - The key of the cached item to delete.
 */
export const delCache = (key) => {
  myCache.del(key);
};
