import { default as statuses, getStatusById } from '../../statuses.js';
import { getTypeById } from '../../types.js';
import { getIcon } from '../../icons/index.js';

const IS_RETINA = window.devicePixelRatio >= 2;

const SMALL_RADIUS = 5;
const LARGE_RADIUS = 12;
const LARGE_RADIUS_SELECTED = 14;
const ZOOM_THRESHOLD = 15;
const ZOOM_LARGE_ICONS = 14;

function normalizeAngle(angle) {

  while (angle < 0) angle += 2 * Math.PI;
  while (angle > 2 * Math.PI) angle -= 2 * Math.PI;

  return angle;
}


/**
 * TODO MOVE SMALLCACHE TO SEPARATE FILE
 */
const smallCache = {};
global.SMALLCACHE = smallCache;

function getSmallImage(statusId, zoom = 1) {

  let cached = true;

  if ( smallCache[statusId] === undefined ){
    smallCache[statusId] = [];
    cached = false
  }

  if ( smallCache[statusId][zoom] === undefined) {
    cached = false
  }

  if (!cached) {
    let radius = SMALL_RADIUS * zoom * (IS_RETINA ? 2 : 1);
    let color = getStatusById(statusId).color;
    let canvas = document.createElement('canvas');
    canvas.width = canvas.height = 2 * radius;
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.strokeStyle = 'white';
    ctx.lineWidth = zoom < 2 ? 1 : 2;

    ctx.beginPath();
    ctx.arc(radius, radius, radius - 2 * zoom,  0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    smallCache[statusId][zoom] = canvas;
    return canvas;
  } else {
    return smallCache[statusId][zoom]
  }
}

class SimpleAnimation {

  /**
   * TODO отключить анимации при window.hover
   */

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

  getZoomCoef(map, threshold = ZOOM_THRESHOLD){
    let zoom = map.getZoom();
    let coef = 8 - (threshold - zoom);
    return coef > 0 ? coef * .4 : 1;
  }

  render(context, selected, time, options) {
    let store = this._store;
    let point = this._point;

    // TODO убрать отсюда эту проверку
    // просто возвращать из хранилища изначально отфильтрованные точки
    if (!store.isPointVisible(point)) return;

    if (this._animation) {
      this._animation.update(time);
    }

    let map = this._map;
    let zoom = map.getZoom();

    if (zoom < ZOOM_LARGE_ICONS && !selected) {
      this._renderSmall(context, options);
    } else {
      this._renderLarge(context, selected, options);
    }
  }

  _renderSmall(context, options) {
    let map = this._map;
    let point = this._point;
    let coords = this._getCoords();
    let zoom = this.getZoomCoef(map);
    let radius = SMALL_RADIUS * zoom;

    let image = getSmallImage(point.status, zoom);

    context.drawImage(image, coords.x - radius, coords.y - radius, radius * 2, radius * 2);
  }

  _renderLarge(context, selected, options) {
    let map = this._map;
    let point = this._point;
    let color = getStatusById(point.status).color;
    let direction = point.direction;
    let type = getTypeById(point.car ? point.car.type_id : 5);
    let icon = type && type.icon;

    let angle = Math.PI * direction / 180 ;
    let tipAngle = normalizeAngle(angle - Math.PI / 2);
    let coords = this._getCoords();

    const title = point.car.gov_number;

    if (options.showPlates && title) {
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

    var radius = LARGE_RADIUS;
    if (selected) {
      radius = radius * 1.15
    }

    context.fillStyle = color;
    context.beginPath();
    context.save();
    context.translate(coords.x, coords.y);
    context.rotate(tipAngle);
    context.arc(0, 0, radius, Math.PI/4, - Math.PI/4);
    context.lineTo(Math.sqrt(2) * radius, 0);
    context.restore();
    context.closePath();
    context.fill();

    if (selected) {
      context.strokeStyle = 'white';
      context.lineWidth = 3;
      context.stroke();
    }

    context.drawImage(getIcon(icon), coords.x - radius, coords.y - radius, 2 * radius, 2 * radius);
  }

  renderTrack(ctx) {
    let point = this._point;
    let track = point.track;
    // TODO блокировать отрисовку до следующего обновления трэка
    //if ( point.LAST_RENDER_TRACK_LENGTH && point.LAST_RENDER_TRACK_LENGTH === track.length ) return;

    let map = this._map;
    //console.log( 'rendering track ')

    if (!track || track.length < 2) return;

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
    if ( point.status === 1 && point.TRACK_NEEDS_UPDATE){
      let coords = map.latLngToLayerPoint(point.coords);
      ctx.lineTo(coords.x, coords.y);
    }

    ctx.stroke();
  }

  renderTrackInColors(ctx){


    let point = this._point;
    let track = point.track;
    let map = this._map;
    let type_id = point.car.type_id;

    if (!track || track.length < 2) return;

    // TODO move to settings store
    let RENDER_GRADIENT = false;

    let getColor = (speed) => {
      /*

       0-10кмч - зеленый
       10-20кмч - зелено-зелено-желтый
       20-30кмч - красный для машин ПМ,ПЩ,РЖР,РТР, для других зелено-желтый
       30-40кмч - красный для машин ПМ,ПЩ,РЖР,РТР, для других желтый
       40+кмч - красный

       ПМ "title": "Поливомоечная техника", "id": 1
       ПЩ "title": "Плужно-щеточная техника","id": 10
       РЖР "title": "Распределитель жидких реагентов", "id": 6
       РТР "title": "Распределитель твердых реагентов", "id": 7


        ** EXAMPLE OF GRADIENT **

       var gradient=ctx.createLinearGradient(0,0,170,0);
       gradient.addColorStop("0","magenta");
       gradient.addColorStop("0.5","blue");
       gradient.addColorStop("1.0","red");

       */

      let isPMPSH =  type_id === 1 || type_id === 6 || type_id === 7 || type_id === 10;
      let colors = {
        green: '#6c0',
        greenyellow: '#cf3',
        yellow: '#ff3',
        red: '#f03',
        stop: '#003'
      }

     /* TODO STOP SIGN
      if ( speed === 0 ){
        return colors.stop
      }*/

      if ( speed >= 0 && speed < 10 ){
        return colors.green
      }

      if ( speed >= 10 && speed < 20  ) {
        return colors.greenyellow
      }

      if ( speed >= 20 && speed < 30 ) {
        return isPMPSH ? colors.red : colors.greenyellow
      }

      if ( speed >= 30 && speed <= 40 ){
        return isPMPSH ? colors.red : colors.yellow
      }

      if ( speed > 40 ) {
        return colors.red
      }
    }

    // TODO убрать эту функцию, ибо она порождена багой на бэкэнде
    let getSpeed = trackPoint => {
      return 'speed_avg' in trackPoint ? trackPoint.speed_avg : trackPoint.speed
    };

    let firstPoint = map.latLngToLayerPoint(track[0].coords);
    let previousCoords = firstPoint, previousColor;

    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(firstPoint.x, firstPoint.y);

    ctx.strokeStyle = previousColor = getColor( track[0].speed_avg );

    for (let i = 1, till = track.length - 1; i < till; i++) {
      let coords = map.latLngToLayerPoint (track[i].coords );
      let speed = getSpeed( track[i] );
      let color = getColor( speed );

      // если предыдущий цвет не соответствует новому
      // нужно закрыть предыдущую линию
      // и нарисовать новую
      if ( previousColor !== color ){

        if (RENDER_GRADIENT) {

          ctx.stroke();

          let gradient=ctx.createLinearGradient( previousCoords.x, previousCoords.y, coords.x, coords.y );
          gradient.addColorStop('0',previousColor);
          gradient.addColorStop('0.6',color);

          ctx.strokeStyle = gradient;
          ctx.beginPath();
          ctx.moveTo ( previousCoords.x, previousCoords.y );
          ctx.lineTo ( coords.x, coords.y );
          ctx.stroke();

          ctx.strokeStyle = color;
          ctx.beginPath();
          ctx.moveTo(coords.x, coords.y);

        } else {
          ctx.lineTo( coords.x, coords.y);
          ctx.stroke();

          ctx.strokeStyle = color;
          ctx.beginPath();
          ctx.moveTo(coords.x, coords.y);
        }
    } else {
      ctx.lineTo(coords.x, coords.y);
    }

    previousCoords = coords;
    previousColor = color;

  }

    // если машина в движении - дорисовываем еще одну точку, чтобы трэк не обрывался
    // получается некрасиво в том случае, если обновление происходит редко
    // и машина резко перемещается на другую точку
    if ( point.status === 1 && point.TRACK_NEEDS_UPDATE){
      let coords = map.latLngToLayerPoint(point.coords);
      ctx.lineTo(coords.x, coords.y);
    }

    ctx.stroke()
  }

  setPoint(point) {
    this._point = point;
    let map = this._map;

    this._coords = point.coords;

    const projectedPoint = this._crs.project(L.latLng(this._coords));
    // this._projectedX = projectedPoint.x;
    // this._projectedY = projectedPoint.y;

    let store = this._store;

    if ( !store.state.isRenderPaused ) {
      this._animation = new CoordsAnimation(this, projectedPoint.x, projectedPoint.y, 500);
    } else {
      this.x = projectedPoint.x;
      this.y = projectedPoint.y;
    }
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

    let _zoom  = this.getZoomCoef(map )
    let radius ;

    if (zoom < ZOOM_LARGE_ICONS) {
      radius = SMALL_RADIUS * _zoom ;
    } else {
      radius = LARGE_RADIUS ;
    }

    var dx = coords.x - mousePoint.x;
    var dy = coords.y - mousePoint.y;

    return dx * dx + dy * dy < radius * radius;
  }

}

export default Marker;
