import { TRACK_COLORS, TRACK_POINT_RADIUS, TRACK_POINT_BORDER_WIDTH } from 'constants/track.js';

const PI_TIMES_TWO = Math.PI * 2;

const TRACK_POINTS = {};
for (const color in TRACK_COLORS) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = (TRACK_POINT_RADIUS + 1) * 2;

  const ctx = canvas.getContext('2d');

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
  if (TRACK_POINTS[color]) return TRACK_POINTS[color];

  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = (TRACK_POINT_RADIUS + 1) * 2;

  const ctx = canvas.getContext('2d');

  ctx.strokeStyle = TRACK_COLORS.point_border;
  ctx.fillStyle = color;
  ctx.lineWidth = TRACK_POINT_BORDER_WIDTH;
  ctx.beginPath();
  ctx.arc(TRACK_POINT_RADIUS + 1, TRACK_POINT_RADIUS + 1, TRACK_POINT_RADIUS, 0, PI_TIMES_TWO, false);

  ctx.fill();
  ctx.stroke();

  return canvas;
}
