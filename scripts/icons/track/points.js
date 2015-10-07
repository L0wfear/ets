import { TRACK_COLORS, TRACK_POINT_RADIUS, TRACK_POINT_BORDER_WIDTH } from '../../constants/track.js';

const PI_TIMES_TWO = Math.PI * 2;

let TRACK_POINTS = {};
for (let color in TRACK_COLORS) {

  let canvas = document.createElement('canvas');
  canvas.width = canvas.height = (TRACK_POINT_RADIUS + 1) * 2;

  let ctx = canvas.getContext('2d');

  ctx.strokeStyle = TRACK_COLORS.point_border;
  ctx.fillStyle = TRACK_COLORS[color];
  ctx.lineWidth = TRACK_POINT_BORDER_WIDTH;
  ctx.beginPath();
  ctx.arc(TRACK_POINT_RADIUS + 1, TRACK_POINT_RADIUS + 1, TRACK_POINT_RADIUS, 0, PI_TIMES_TWO, false);

  ctx.fill();
  ctx.stroke();
  TRACK_POINTS[TRACK_COLORS[color]] = canvas;
}

export function getTrackPointByColor(color) {
  return TRACK_POINTS[color];
}