import { SMALL_ICON_RADIUS } from 'constants/CarIcons.js';
import { getStatusById } from 'constants/statuses';

const PI_TIMES_TWO = Math.PI * 2;
const IS_RETINA = window.devicePixelRatio >= 2;

const CACHE = {};

export default function getSmallIcon(statusId, zoom = 1) {
  let cached = true;

  if (typeof CACHE[statusId] === 'undefined') {
    CACHE[statusId] = [];
    cached = false;
  }

  if (typeof CACHE[statusId][zoom] === 'undefined') {
    cached = false;
  }

  if (!cached) {
    const radius = SMALL_ICON_RADIUS * zoom * (IS_RETINA ? 2 : 1);
    const color = getStatusById(statusId).color;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 2 * radius;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.strokeStyle = 'white';
    ctx.lineWidth = zoom < 2 ? 1 : 2;

    ctx.beginPath();
    ctx.arc(radius, radius, radius - (2 * zoom), 0, PI_TIMES_TWO);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    CACHE[statusId][zoom] = canvas;
    return canvas;
  }

  return CACHE[statusId][zoom];
}
