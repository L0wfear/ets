import { getStatusById } from '../../statuses.js';
import { getTypeById } from '../../types.js';
import { getIcon } from '../../icons/index.js';

const SMALL_RADIUS = 5;
const LARGE_RADIUS = 12;
const ZOOM_THRESHOLD = 13;


var _SMALL_RADIUS = SMALL_RADIUS;

function normalizeAngle(angle) {

  while (angle < 0) angle += 2 * Math.PI;
  while (angle > 2 * Math.PI) angle -= 2 * Math.PI;

  return angle;
}

const smallCache = {};

function getSmallImage(statusId) {
  var cached = smallCache[statusId];

  if (!cached) {
    var SMALL_RADIUS = _SMALL_RADIUS * 2; // FIXME detect retina statically

    var color = getStatusById(statusId).color;
    var canvas = document.createElement('canvas');
    canvas.width = canvas.height = 2 * SMALL_RADIUS;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(SMALL_RADIUS, SMALL_RADIUS, SMALL_RADIUS,  0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    cached = smallCache[statusId] = canvas;
  }

  return cached;
}

class SimpleAnimation {

  constructor(target, propertyName, toValue, interval) {
    this._target = target;
    this._propertyName = propertyName;
    this._fromValue = target[propertyName];
    this._currentValue = this._fromValue;
    this._toValue = toValue;
    this._progress = 0;
    this._interval = interval;
    this._speed = 1 / interval;
    this.ended = false;

    this._startTime = -1;
    this._currentTime = -1;
    this._valueSpan = this._toValue - this._fromValue;
  }

  update(newTime) {

    if (this.ended) {
      return;
    }

    if (this._currentTime < 0) {
      this._currentTime = newTime;
      this._startTime = newTime;
      return;
    }

    const oldTime = this._currentTime;
    this._currentTime = newTime;

    const speed = this._speed;
    const oldProgress = this._progress;
    const deltaTime = newTime - oldTime;
    let deltaProgress = speed * deltaTime;
    let newProgress = oldProgress + deltaProgress;

    if (newProgress >= 1.0) {
      newProgress = 1.0;
      this.ended = true;
    }

    this._progress = newProgress;
    deltaProgress = newProgress - oldProgress;

    this._currentValue += this._valueSpan * deltaProgress;
    this._target[this._propertyName] = this._currentValue;
  }
}

class CoordsAnimation {

  constructor(target, x, y, interval) {
    this.ended = false;
    this._x = new SimpleAnimation(target, '_projectedX', x, interval);
    this._y = new SimpleAnimation(target, '_projectedY', y, interval);
  }

  update(newTime) {

    if (this.ended) {
      return;
    }

    this._x.update(newTime);
    this._y.update(newTime);

    if (this._x.ended) {
      this.ended = true;
    }

  }
}

class Marker {

  constructor(point, map, store) {
    this._point = point;
    this._map = map;
    this._store = store;
    this._coords = point.coords;
    this._crs = map.options.crs;
    this._animation = null;

    const projectedPoint = this._crs.project(L.latLng(this._coords));
    this._projectedX = projectedPoint.x;
    this._projectedY = projectedPoint.y;
  }

  _getCoords() {
    let map = this._map;
    let origin = map.getPixelOrigin();

    let x = this._projectedX;
    let y = this._projectedY;

    let crs = this._crs;
    let zoom = map.getZoom();
    let scale = crs.scale(zoom);
    let coords = crs.transformation._transform({ x, y }, scale);

    coords.x -= origin.x;
    coords.y -= origin.y;

    return coords;
  }

  render(context, selected, time) {
    let store = this._store;
    let point = this._point;

    if (!store.isPointVisible(point)) return;

    if (this._animation) {
      this._animation.update(time);
    }

    let map = this._map;
    let zoom = map.getZoom();

    if (zoom < ZOOM_THRESHOLD && !selected) {
      this._renderSmall(context);
    } else {
      this._renderLarge(context, selected);
    }
  }

  _renderSmall(context) {
    let map = this._map;
    let point = this._point;
    let origin = map.getPixelOrigin();

    let coords = this._getCoords();

    // SSD-21
    // если машина неактивна - рисуем серым
    // TODO убрать этот хак
    if (point['connection_status'] === 0 ){
      point.status = 4;
    }

    let image = getSmallImage(point.status);

    context.drawImage(image, coords.x - SMALL_RADIUS/2, coords.y - SMALL_RADIUS / 2, SMALL_RADIUS * 2, SMALL_RADIUS * 2);
  }

  _renderLarge(context, selected) {
    let map = this._map;
    let point = this._point;
    let color = getStatusById(point.status).color;
    let direction = point.direction;
    let type = getTypeById(point.car ? point.car[1] : 5);
    let icon = type && type.icon;

    let angle = Math.PI * direction / 180 ;
    let tipAngle = normalizeAngle(angle - Math.PI / 2);
    let coords = this._getCoords();

    const title = point.car[0];

    if (title) {
      const ctx = context;
      const radius = LARGE_RADIUS;

      ctx.fillStyle = 'white';

      var text = title;
      var width = ctx.measureText(text).width;
      var padding = 3;

      var rectWidth = width + 2 * padding + radius;
      var rectHeight = 2 * radius - 2;
      var rectOffsetY =  coords.y - radius + 1;

      if (tipAngle >= 0.5 * Math.PI && tipAngle <= 1.5 * Math.PI ) {
        ctx.fillRect(coords.x, rectOffsetY, rectWidth, rectHeight);
        ctx.fillStyle = 'black';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, coords.x + padding + radius, coords.y);
      } else {
        ctx.fillRect(coords.x - rectWidth, rectOffsetY, rectWidth, rectHeight);
        ctx.fillStyle = 'black';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, coords.x - rectWidth + padding, coords.y);
      }
    }

    context.fillStyle = color;
    context.beginPath();
    context.save();
    context.translate(coords.x, coords.y);
    context.rotate(tipAngle);
    context.arc(0, 0, LARGE_RADIUS, Math.PI/4, - Math.PI/4);
    context.lineTo(Math.sqrt(2) * LARGE_RADIUS, 0);
    context.restore();
    context.closePath();
    context.fill();

    if (selected) {
      context.strokeStyle = 'white';
      context.lineWidth = 2;
      context.stroke();
    }
    context.drawImage(getIcon(icon), -LARGE_RADIUS + coords.x, -LARGE_RADIUS + coords.y, 2 * LARGE_RADIUS, 2 * LARGE_RADIUS);
  }

  renderTrack(ctx) {
    let point = this._point;
    let track = point.track;
    let map = this._map;

    if (!track || track.length < 2) return;

    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    let first = map.latLngToLayerPoint(track[0]);

    ctx.beginPath();
    ctx.moveTo(first.x, first.y);

    for (let i = 1; i < track.length - 1; i++) {
      let coords = map.latLngToLayerPoint(track[i]);
      ctx.lineTo(coords.x, coords.y);
    }

    ctx.lineTo(this._coords.x, this._coords.y);

    ctx.stroke();
  }

  setPoint(point) {
    this._point = point;
    let map = this._map;

    this._coords = point.coords;

    const projectedPoint = this._crs.project(L.latLng(this._coords));
    // this._projectedX = projectedPoint.x;
    // this._projectedY = projectedPoint.y;

    this._animation = new CoordsAnimation(this, projectedPoint.x, projectedPoint.y, 500);


  }

  contains(mousePoint) {
    let map = this._map;

    let store = this._store;
    let point = this._point;

    if (!store.isPointVisible(point)) {
      return false;
    }

    let coords = map.latLngToLayerPoint(this._coords);
    var zoom = map.getZoom();

    var radius;

    if (zoom < ZOOM_THRESHOLD) {
      radius = SMALL_RADIUS;
    } else {
      radius = LARGE_RADIUS;
    }

    var dx = coords.x - mousePoint.x;
    var dy = coords.y - mousePoint.y;

    return dx * dx + dy * dy < radius * radius;
  }

}

export default Marker;
