export function filterValidPoints(array: Array<any>) {
  return array.filter((point) => point.is_valid === true);
}
