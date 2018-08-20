import { isEqual, isEmpty } from 'lodash';

export function swapCoords(props) {
  try {
    const [x, y] = props;

    return [y, x];
  } catch (e) {
    console.warn('cant swap coords', props);
    return [0, 0];
  }
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

export function hasTrackPointsChanged(currentPoints, nextPoints) {
  if (isEmpty(currentPoints) || isEmpty(nextPoints)) {
    return true;
  }

  const firstTrackPointTs = currentPoints[0].timestamp;
  const lastTrackPointTs = currentPoints[currentPoints.length - 1].timestamp;

  const newFirstTrackPointTs = nextPoints[0].timestamp;
  const newLastTrackPointTs = nextPoints[nextPoints.length - 1].timestamp;

  if (
    !isEqual(firstTrackPointTs, newFirstTrackPointTs) ||
    !isEqual(lastTrackPointTs, newLastTrackPointTs)
  ) {
    return true;
  }

  return false;
}
