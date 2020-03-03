import { isArray } from 'util';

export function swapCoords(props: Array<number>) {
  try {
    const [x, y] = props;

    return [y, x];
  } catch (e) {
    // tslint:disable-next-line
    console.warn('cant swap coords', props);
    return [0, 0];
  }
}

export function unwrapCoords({ x, y }: { x: number; y: number; }) {
  return [x, y];
}

export function roundCoordinates(coords: Array<number> | { x: number; y: number; }, level = 4) {
  let result: Array<number> = null;
  if (!isArray(coords)) {
    result = unwrapCoords(coords);
  } else {
    result = coords;
  }
  return result.map((coord) => Math.round(coord * Math.pow(10, level)) / Math.pow(10, level));
}
