import React from 'react';
import { projectToPixel } from './MskAdapter.js';
import { getStartOfToday, makeDate, makeTime } from 'utils/dates';
import { TRACK_COLORS, TRACK_LINE_OPACITY, TRACK_LINE_WIDTH, TRACK_POINT_RADIUS, SHOW_ONLY_POINTS_WITH_SPEED_CHANGES } from '../../constants/track.js';
import { getTrackPointByColor } from '../../icons/track/points.js';
import { swapCoords, roundCoordinates } from 'utils/geo';
import { getTypeById } from 'utils/labelFunctions';

const IS_MSK = true;
const DRAW_POINTS = true;
const COLORS_ZOOM_THRESHOLD = 8;

/**
 * получение цвета линии трэка
 * в зависимости от скорости
 * @param speed
 * @returns color string
 */
export function getTrackColor(speed, type_id, opacity = 1) {
  /*

   0-10кмч - зеленый
   10-20кмч - зелено-желтый
   20-30кмч - красный для машин ПМ,ПЩ,РЖР,РТР, для других зелено-желтый
   30-40кмч - красный для машин ПМ,ПЩ,РЖР,РТР, для других желтый
   40+кмч - красный

   ПМ "title": "Поливомоечная техника", "id": 1
   ПЩ "title": "Плужно-щеточная техника","id": 10
   РЖР "title": "Распределитель жидких реагентов", "id": 6
   РТР "title": "Распределитель твердых реагентов", "id": 7
   */

  let result = TRACK_COLORS.green; // green by default

  /**
   * преобразовывает hex цвет в rgba с нужной прозрачностью
   * @param hex
   * @param opacity
   * @returns {*}
   */
  function hexToRgba(hex, opacity) {
    let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
    });

    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 'rgba('
    + parseInt(result[1], 16) + ','
    + parseInt(result[2], 16) + ','
    + parseInt(result[3], 16) + ','
    + opacity + ')' : null
  }

  let type = getTypeById(type_id);
  let speed_max = type && type.speed_max | 0;

  /* @TODO STOP SIGN
   if ( speed === 0 ){
   return colors.stop
   }*/

  if (speed >= 0 && speed < 10) {
    result = TRACK_COLORS.green
  }

  if (speed >= 10 && speed < 20) {
    result = TRACK_COLORS.green
  }

  if (speed >= 20 && speed < 30) {
    result = TRACK_COLORS.green
  }

  if (speed >= 30 && speed < speed_max) {
    result = TRACK_COLORS.green
  }

  if (speed >= speed_max) {
    result = TRACK_COLORS.red
  }

  return opacity === 1 ? result : hexToRgba(result, opacity);
}

export default class Track {

  constructor(owner) {

    this.map = owner.map;
    // TODO придумать что-то с этими контекстами
    this.ctx = owner._reactMap.canvas.getContext('2d');
    this.owner = owner;

    this.points = null;
    this.continuousUpdating = true;
    this.onUpdateCallback = () => {};
    this.getTrack = window.__ETS_CONTAINER__.flux.getActions('car').getTrack;
  }

  isLoaded(){
    //console.log(this.owner, this.points && this.points.length)
    //debugger;
    return this.points !== null && this.points.length > 0;
  }

  getLastPoint(){
    return this.isLoaded() && this.points[this.points.length - 1]
  }

  addPoint(point) {

    if (!this.continuousUpdating) {
      return;
    }

    //point.coords_msk = point.coords_msk;
    //point.coords = swapCoords(point.coords);

    if (this.points !== null && (this.points.length && point.timestamp > this.points[this.points.length - 1].timestamp)) {
      this.points.push(point);
      //this.render();
      this.onUpdateCallback();
    }
  }

  onUpdate(fn = () => {}) {
    this.onUpdateCallback = fn;
  }

  setContinuousUpdating(flag) {
    console.log('track', this, 'continuousUpdating is', flag)
    this.continuousUpdating = flag;
  }

  getLegend() {

    // todo refactor this
    let colors = [];
    let car = this.owner.getCar();

    let type_id = car.type_id;
    let prevColor = getTrackColor(0, type_id);

    function addColor(color, speed) {
      if (colors.length > 0) {
        colors[colors.length - 1].till = speed - 1;
      }
      colors.push({
        color: color,
        speed: speed
      })
    }

    addColor(prevColor, 0);

    for (let i = 0, till = 100; i <= till; i++) {
      let color = getTrackColor(i, type_id);
      if (color !== prevColor) {
        addColor(color, i);
        prevColor = color;
      }
    }

    if (colors[colors.length - 1].till === undefined) {
      colors[colors.length - 1].speed = colors[colors.length - 1].speed + '+'
    }


    let legend = colors.map((obj, i) => {
      let text = obj.speed + (obj.till ? ' – ' + obj.till : '') + ' км/ч';
      let color = obj.color;

      return (
        <div key={i} className="track-legend-item">
          <div className="track-legend-point" style={{backgroundColor: color}}></div>
          <div className="track-legend-text">{text}</div>
        </div>
      );
    });

    return (
      <div className="track-legend">
        {legend}
      </div>
    );
  }


  fetch(from_dt = getStartOfToday(), to_dt = new Date().getTime()) {

    let id = this.owner.point.id;
    let updating = this.continuousUpdating;
    //this.points = null;

    if (to_dt - from_dt > 5 * 24 * 60 * 60 * 1000) {
      global.NOTIFICATION_SYSTEM.notify('Период запроса трэка не может превышать 5 суток', 'warning')
      return;
    }

    this.continuousUpdating = false;

    return this.getTrack(id, from_dt, to_dt)
                .then((track) => {
                  this.points = track;
                  this.continuousUpdating = updating;
                  this.render();
                  this.onUpdateCallback();
                  console.log('track fetched for', this.owner)
                })

  }

  render() {
    let map = this.map;
    let zoom = map.getView().getZoom();

    if (zoom > COLORS_ZOOM_THRESHOLD) {
      this.renderInColors();
    } else {
      this.renderSimple();
    }
  }

  renderSimple() {
    let owner = this.owner;
    let track = this.points;
    let ctx = this.ctx;

    if (!track || track.length < 2) {
      return
    }

    ctx.strokeStyle = TRACK_COLORS.blue;
    ctx.lineWidth = TRACK_LINE_WIDTH;
    ctx.lineCap = 'round';

    let first = projectToPixel(track[0].coords_msk);

    ctx.beginPath();
    ctx.moveTo(first.x, first.y);

    for (let i = 1, till = track.length - 1; i < till; i++) {
      let coords = projectToPixel(track[i].coords_msk);
      ctx.lineTo(coords.x, coords.y);
    }

    // если машина в движении - дорисовываем еще одну точку, чтобы трэк не обрывался
    // получается некрасиво в том случае, если обновление происходит редко
    // и машина резко перемещается на другую точку
    if (owner.point.status === 1 && this.continuousUpdating) {
      let coords = projectToPixel(swapCoords(owner.point.coords_msk));
      ctx.lineTo(coords.x, coords.y);
    }

    ctx.stroke();
  }

  getExtent() {
    let minX = 100000,
      minY = 100000,
      maxX = 0,
      maxY = 0;
    let trackPoints = this.points;

    for (let key in trackPoints) {
      let point = trackPoints[key];
      let [x, y] = point.coords_msk;

      if (x < minX) {
        minX = x
      }
      if (x > maxX) {
        maxX = x
      }

      if (y < minY) {
        minY = y;
      }
      if (y > maxY) {
        maxY = y
      }
    }

    return [minX, minY, maxX, maxY];
  }


  /**
   * рисует точку трэка
   * @param coords
   * @param color
   */
  drawTrackPoint(coords, color) {
    let ctx = this.ctx;
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
  /**
   * TODO http://jsperf.com/changing-canvas-state/3
   * @param ctx
   */
  renderInColors() {

    let owner = this.owner;
    let track = this.points;
    let TRACK_LINE_WIDTH = DRAW_POINTS ? 4 : TRACK_LINE_WIDTH;
    let ctx = this.ctx;

    if (!track || track.length < 2) {
      return;
    }

    let type_id = owner.point.car.type_id;

    // todo import from settings
    const RENDER_GRADIENT = this.owner.store.state.showTrackingGradient;

    // TODO убрать эту функцию, ибо она порождена багой на бэкэнде
    function getSpeed(trackPoint) {
      return 'speed_avg' in trackPoint ? trackPoint.speed_avg : trackPoint.speed
    }

    let firstPoint = projectToPixel(track[0].coords_msk);
    let prevCoords = firstPoint;

    ctx.lineWidth = TRACK_LINE_WIDTH;
    ctx.lineCap = 'butt';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(firstPoint.x, firstPoint.y);

    let prevRgbaColor = ctx.strokeStyle = getTrackColor(getSpeed(track[0]), type_id, TRACK_LINE_OPACITY);

    for (let i = 1, till = track.length - 1; i < till; i++) {
      let coords = projectToPixel(track[i].coords_msk);
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

          this.drawTrackPoint(coords, hexColor);
        } else {
          ctx.lineTo(coords.x, coords.y);
          ctx.stroke();

          this.drawTrackPoint(coords, hexColor);
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

          this.drawTrackPoint(coords, hexColor);

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
    if (owner.point.status === 1 && this.continuousUpdating) {
      //debugger;
      let coords = projectToPixel(swapCoords(owner.point.coords_msk));
      ctx.lineTo(coords.x, coords.y);
    }

    ctx.stroke()
  }

  getPointAtCoordinate(coordinate) {
    let view = this.map.getView();
    let projectedPixel = projectToPixel(coordinate);
    let extent = view.calculateExtent(this.map.getSize());
    let viewportPoints = this.getTrackPointsInExtent(extent);
    let selected = null;

    for (let key in viewportPoints) {
      let point = viewportPoints[key];
      let pixelCoords = projectToPixel(point.coords_msk)
      let radius = TRACK_POINT_RADIUS;

      var dx = pixelCoords.x - projectedPixel.x;
      var dy = pixelCoords.y - projectedPixel.y;

      if (dx * dx + dy * dy < radius * radius) {
        selected = point;
        break;
      }
    }

    return selected;
  }


  getTrackPointsInExtent(extent) {
    let points = this.points;
    let returns = [];

    for (let key in points) {
      let point = points[key];
      if (ol.extent.containsCoordinate(extent, point.coords_msk)) {
        returns.push(point)
      }
    }

    return returns;

  }


  // todo refactor
  async getTrackPointTooltip(trackPoint, prevPoint, nextPoint){
    let vectorObject = await window.__ETS_CONTAINER__.flux
        .getActions('car')
        .getVectorObject(trackPoint, prevPoint, nextPoint);

    let { nsat,
          speed_avg,
          speed_max,
          direction,
          timestamp,
          distance } = trackPoint,
      [latitude, longitude] = roundCoordinates(trackPoint.coords_msk, 6),
      geoObjects = null,
      gov_number = this.owner.point.car.gov_number;

    distance = typeof distance == 'number' ? Math.floor(distance) : distance;
    timestamp = new Date( timestamp * 1000 );
    let dt = makeDate( timestamp ) + ' ' + makeTime( timestamp, true );

    return function makePopup(){
        let objectsString;
        if (vectorObject.result) {
          objectsString = vectorObject.result[0].asuods_id === vectorObject.result[1].asuods_id ?
          vectorObject.result[0].name : vectorObject.result[0].name+' / '+vectorObject.result[1].name;
        } else {
          objectsString = 'Объекты ОДХ не найдены';
        }

        // let objectsString = 'Объекты ОДХ';
        //
        // if ( geoObjects === null ){
        //   objectsString += ' загружаются'
        // } else {
        //   if ( geoObjects.length > 0 ){
        //     //objectsString += ': '+ geoObjects.map((obj)=>obj.name + ' ('+getCustomerById(obj.customer_id).title+')').join(', ')
        //   } else {
        //     objectsString += ' не найдены'
        //   }
        // }

        return '<div class="header">' +
                  '<span class="gov-number">'+gov_number+'</span>' +
                  '<span class="dt">'+dt+'</span>  ' +
                '</div>  ' +
                '<div class="geo-objects">'+objectsString+'</div>'+
                  '<div class="some-info">' +
                  '<div class="speed">V<sub>ср</sub> = '+speed_avg+' км/ч<br/>'+'V<sub>макс</sub> = '+speed_max+' км/ч</div>' +
                  '<div class="distance">' + distance + ' м</div>' +
                  '<div class="coords">'+latitude+ '<br/>' + longitude + '</div>' +
                  '<div class="nsat">'+ nsat +' спутников</div>' +
                '</div>' +
                  // '<div class="ignition">${ignition}</div>' +
            '</div>';
    }
  }
}
