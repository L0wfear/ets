import { getStatusById } from '../../../statuses.js';
import { getTypeById } from '../../../types.js';
import CoordsAnimation from './CoordsAnimation.js';
import { getSmallIcon, getBigIcon } from '../../../icons/car.js';
import {projectToPixel} from '../../map/MskAdapter.js';
import Marker from '../BaseMarker.js';
import Track from '../../map/Track.js';

import {
  SMALL_ICON_RADIUS,
  LARGE_ICON_RADIUS
} from '../../../constants/CarIcons.js';

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

  constructor(point, map) {
    super(point, map);
    point.marker = this;

    this.coords = {
      x: point.coords_msk[1],
      y: point.coords_msk[0]
    }

    this.track = null;
  }

  getImage(options) {
    let map = this.map;
    let zoom = map.getView().getZoom();

    return zoom < ZOOM_LARGE_ICONS && !options.selected ? this.renderSmall() : this.renderLarge(options);
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

  getCar() {
    return this.point.car
  }

  onClick() {
    this.track = new Track(this);
  }

  hasTrackLoaded() {
    // todo move to Track class
    return this.track !== null && this.track.points !== null && this.track.points.length > 0 ;
  }

  /**
   * todo showPlates via map options
   * @return {[type]} [description]
   */
  renderLarge(options = {}) {

    let point = this.point;
    let color = getStatusById(point.status).color;
    let direction = point.direction;
    let type = getTypeById(point.car ? point.car.type_id : 5);
    let icon = type && type.icon;
    let radius = this.radius = LARGE_ICON_RADIUS + 6;

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

    if (options.selected) {
      context.strokeStyle = 'white';
      context.lineWidth = 3;
      context.stroke();
    }

    return getBigIcon(icon);
 }

  setPoint(point) {
    this.point = point;
    this.coords = [point.coords_msk[1], point.coords_msk[0]];
    let [x, y] = this.coords;

    let store = this.store;

    // обновляем трэк, если у точки он загружен
    if (this.track !== null) {
      let trackPoint = {
        coords: point.coords,
        coords_msk: point.coords_msk,
        direction: point.direction,
        speed_avg: point.speed,
        distance: point.distance || 'Н/Д',
        speed_max: point.speed_max || 'Н/Д',
        nsat: point.nsat || 'Н/Д',
        timestamp: point.timestamp
      };

      this.track.addPoint(trackPoint)
    }

    if (!store.state.isRenderPaused) {
      this._animation = new CoordsAnimation(this, x, y, 500);
    } else {
      this.x = x;
      this.y = y;
    }
  }

}
