export function roundCoordinates(coords, level = 4) {
	let round = coord => Math.round(coord * Math.pow(10, level)) / Math.pow(10, level);
  return coords.map(round);
}
