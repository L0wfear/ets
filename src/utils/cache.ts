let cache = {};

export function getValueFromCache(key) {
  return cache[key] || null;
}

export function put(key, value) {
  cache[key] = value;
}

export function clear() {
  cache = {};
}
