export function isNotNull(value) {
  return typeof value !== 'undefined' && value !== null;
}

export function isEmpty(value) {
  if (!isNotNull(value)) return true;
  if (typeof value === 'string' && value.length === 0) return true;
  return false;
}
