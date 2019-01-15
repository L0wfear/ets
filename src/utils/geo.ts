export function swapCoords(props) {
  try {
    const [x, y] = props;

    return [y, x];
  } catch (e) {
    // tslint:disable-next-line
    console.warn('cant swap coords', props);
    return [0, 0];
  }
}

export function unwrapCoords({ x, y }) {
  return [x, y];
}

export function roundCoordinates(coords, level = 4) {
  let result = coords;
  if (!coords.length) {
    result = unwrapCoords(coords);
  }
  const round = (coord) => Math.round(coord * Math.pow(10, level)) / Math.pow(10, level);
  return result.map(round);
}
