export function swapCoords([x, y]) {
  return [y, x];
}

export function unwrapCoords({ x, y }) {
  return [x, y];
}

export function wrapCoords([x, y]) {
  return {
    x,
    y,
  };
}

export function roundCoordinates(coords, level = 4) {
  let result = coords;
  if (!coords.length) {
    result = unwrapCoords(coords);
  }
  const round = coord => Math.round(coord * Math.pow(10, level)) / Math.pow(10, level);
  return result.map(round);
}
