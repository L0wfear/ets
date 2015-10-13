export function roundCoordinates(coords, level = 4) {
	if (!coords.length) {
		coords = unwrapCoords(coords)
	}

	let round = coord => Math.round(coord * Math.pow(10, level)) / Math.pow(10, level);
  return coords.map(round);
}

export function swapCoords([x, y]) {
	return [y, x]
}

export function unwrapCoords({x, y}) {
	return [x, y]
}

export function wrapCoords ([x, y]) {
  return {
    x: x,
    y: y
  }
}
