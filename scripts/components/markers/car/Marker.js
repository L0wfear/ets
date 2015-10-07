import { getStatusById } from '../../../statuses.js';
import { getTypeById } from '../../../types.js';
import { getTrackColor, getTrackPointByColor } from '../../../helpers/track.js';
import CoordsAnimation from './CoordsAnimation.js';
import { getSmallIcon, getBigIcon } from '../../../icons/car.js';
import {projectToPixel} from '../../map/MskAdapter.js';
import Marker from '../BaseMarker.js';

import {
  SMALL_ICON_RADIUS,
  LARGE_ICON_RADIUS
} from '../../../constants/CarIcons.js';

import {
  TRACK_LINE_OPACITY,
  TRACK_POINT_RADIUS,
  SHOW_ONLY_POINTS_WITH_SPEED_CHANGES
} from '../../../constants/track.js';

// @todo убрать прозрачность на больших зум левелах
const ZOOM_LARGE_ICONS = 8;

const PI_TIMES_TWO = Math.PI * 2;

function normalizeAngle(angle) {

  while (angle < 0) {
    angle += PI_TIMES_TWO
  }
  while (angle > PI_TIMES_TWO) {
    angle -= PI_TIMES_TWO
  }

  return angle;
}

export default class CarMarker extends Marker {

  constructor(point, map, store, context) {
    super(point, map, store, context);

    this.coords = {
      x: point.coords_msk[1],
      y: point.coords_msk[0]
    }
  }


  renderImage() {
    let map = this.map;
    let zoom = map.getView().getZoom();
    let selected = this.store.getSelectedPoint();

    return zoom < ZOOM_LARGE_ICONS && !selected ? this.renderSmall() : this.renderLarge();
  }


  getZoomRatio() {
    let map = this.map;
    let zoom = map.getView().getZoom();
    let coef = 8 - (ZOOM_LARGE_ICONS - zoom);
    return coef > 0 ? coef * .4 : 1;
  }

  renderSmall() {

    let point = this.point;
    let zoomRatio = this.getZoomRatio();
    this.radius = SMALL_ICON_RADIUS * zoomRatio;

    let image = getSmallIcon(point.status, zoomRatio);

    return image;
  }

  /**
   * todo showPlates via map options
   * @return {[type]} [description]
   */
  renderLarge() {

    let options = {};

    let point = this.point;
    let color = getStatusById(point.status).color;
    let direction = point.direction;
    let type = getTypeById(point.car ? point.car.type_id : 5);
    let icon = type && type.icon;
    let radius = this.radius = LARGE_ICON_RADIUS + 7 ;

    let angle = Math.PI * direction / 180;
    let tipAngle = normalizeAngle(angle - Math.PI / 2);
    let drawCoords = projectToPixel(this.coords);
    let context = this.ctx;

    const title = point.car.gov_number;

    if (options.showPlates && title) {

      context.fillStyle = 'white';

      var text = title;
      var width = context.measureText(text).width;
      var padding = 3;

      var rectWidth = width + 2 * padding + radius;
      var rectHeight = 2 * radius - 2;
      var rectOffsetY = drawCoords.y - radius + 1;

      if (tipAngle >= 0.5 * Math.PI && tipAngle <= 1.5 * Math.PI) {
        context.fillRect(drawCoords.x, rectOffsetY, rectWidth, rectHeight);
        context.fillStyle = 'black';
        context.textBaseline = 'middle';
        context.fillText(text, drawCoords.x + padding + radius, drawCoords.y);
      } else {
        context.fillRect(drawCoords.x - rectWidth, rectOffsetY, rectWidth, rectHeight);
        context.fillStyle = 'black';
        context.textBaseline = 'middle';
        context.fillText(text, drawCoords.x - rectWidth + padding, drawCoords.y);
      }
    }


    context.fillStyle = color;
    context.beginPath();
    context.save();
    context.translate(drawCoords.x, drawCoords.y);
    context.rotate(tipAngle);
    context.arc(0, 0, radius, Math.PI / 4, -Math.PI / 4);
    context.lineTo(Math.sqrt(2) * radius, 0);
    context.restore();
    context.closePath();
    context.fill();

    /*if (selected) {
      context.strokeStyle = 'white';
      context.lineWidth = 3;
      context.stroke();
    }*/

    return getBigIcon(icon);
 }

  renderTrack(ctx) {
    let point = this.point;
    let track = point.track;

    let map = this.map;

    if (!track || track.length < 2) {
      return
    }

    ctx.strokeStyle = '#3C68FA';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    let first = map.latLngToLayerPoint(track[0]);

    ctx.beginPath();
    ctx.moveTo(first.x, first.y);

    for (let i = 1, till = track.length - 1; i < till; i++) {
      let coords = map.latLngToLayerPoint(track[i]);
      ctx.lineTo(coords.x, coords.y);
    }

    // если машина в движении - дорисовываем еще одну точку, чтобы трэк не обрывался
    // получается некрасиво в том случае, если обновление происходит редко
    // и машина резко перемещается на другую точку
    if (point.status === 1 && point.TRACK_NEEDS_UPDATE) {
      let coords = map.latLngToLayerPoint(point.coords);
      ctx.lineTo(coords.x, coords.y);
    }

    ctx.stroke();
  }


  /**
   * TODO http://jsperf.com/changing-canvas-state/3
   * @param ctx
   * @param DRAW_POINTS
   */
  renderTrackInColors(ctx, DRAW_POINTS) {

    let point = this.point;
    let track = point.track;
    let TRACK_LINE_WIDTH = DRAW_POINTS ? 4 : TRACK_LINE_WIDTH;

    if (!track || track.length < 2) {
      return
    }

    let map = this.map;
    let type_id = point.car.type_id;

    const RENDER_GRADIENT = this.store.state.showTrackingGradient;


    // TODO убрать эту функцию, ибо она порождена багой на бэкэнде
    function getSpeed(trackPoint) {
      return 'speed_avg' in trackPoint ? trackPoint.speed_avg : trackPoint.speed
    }

    /**
     * рисует точку трэка
     * @param coords
     * @param color
     */
    function drawTrackPoint(coords, color) {
      if (DRAW_POINTS) {
        let cachedPoint = getTrackPointByColor(color);
        ctx.drawImage(
          cachedPoint,
          coords.x - TRACK_POINT_RADIUS - 1,
          coords.y - TRACK_POINT_RADIUS - 1,
          (TRACK_POINT_RADIUS + 1) * 2,
          (TRACK_POINT_RADIUS + 1) * 2);
      }
    }

    let firstPoint = map.latLngToLayerPoint(track[0].coords);
    let prevCoords = firstPoint;

    ctx.lineWidth = TRACK_LINE_WIDTH;
    ctx.lineCap = 'butt';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(firstPoint.x, firstPoint.y);

    let prevRgbaColor = ctx.strokeStyle = getTrackColor(getSpeed(track[0]), type_id, TRACK_LINE_OPACITY);

    for (let i = 1, till = track.length - 1; i < till; i++) {
      let coords = map.latLngToLayerPoint(track[i].coords);
      let speed = getSpeed(track[i]);
      let rgbaColor = getTrackColor(speed, type_id, TRACK_LINE_OPACITY);
      let hexColor = getTrackColor(speed, type_id);

      // если предыдущий цвет не соответствует новому
      // нужно закрыть предыдущую линию
      // и нарисовать новую
      if (prevRgbaColor !== rgbaColor) {
        if (RENDER_GRADIENT) {

          // stroke path before
          ctx.stroke();

          // make gradient fill
          let gradient = ctx.createLinearGradient(prevCoords.x, prevCoords.y, coords.x, coords.y);
          gradient.addColorStop('0', prevRgbaColor);
          gradient.addColorStop('1', rgbaColor);

          // make new path and stroke that
          ctx.strokeStyle = gradient;
          ctx.beginPath();
          ctx.moveTo(prevCoords.x, prevCoords.y);
          ctx.lineTo(coords.x, coords.y);
          ctx.stroke();

          drawTrackPoint(coords, hexColor);
        } else {
          ctx.lineTo(coords.x, coords.y);
          ctx.stroke();

          drawTrackPoint(coords, hexColor);
        }

        // start new path
        // and reset color && lineWidth
        ctx.strokeStyle = rgbaColor;
        ctx.lineWidth = TRACK_LINE_WIDTH;
        ctx.beginPath();
        ctx.moveTo(coords.x, coords.y);

      } else { // если цвет не менялся

        ctx.strokeStyle = prevRgbaColor;
        ctx.lineWidth = TRACK_LINE_WIDTH;
        ctx.lineTo(coords.x, coords.y);

        // оптимизация, типа
        // рисовать кружки только там, где были заметные изменения скорости
        if (!SHOW_ONLY_POINTS_WITH_SPEED_CHANGES) {
          ctx.stroke();

          drawTrackPoint(coords, hexColor);

          ctx.strokeStyle = rgbaColor;
          ctx.lineWidth = TRACK_LINE_WIDTH;
          ctx.beginPath();
          ctx.moveTo(coords.x, coords.y);
        }
      }

      prevCoords = coords;
      prevRgbaColor = rgbaColor;
    }

    // если машина в движении - дорисовываем еще одну точку, чтобы трэк не обрывался
    // получается некрасиво в том случае, если обновление происходит редко
    // и машина резко перемещается на другую точку
    if (point.status === 1 && point.TRACK_NEEDS_UPDATE) {
      let coords = map.latLngToLayerPoint(point.coords);
      ctx.lineTo(coords.x, coords.y);
    }

    ctx.stroke()
  }

  setPoint(point) {
    this.point = point;
    this.coords = [point.coords_msk[1], point.coords_msk[0]];
    let [x, y] = this.coords;

    let store = this.store;

    if (!store.state.isRenderPaused) {
      this._animation = new CoordsAnimation(this, x, y, 500);
    } else {
      this.x = x;
      this.y = y;
    }
  }

}
