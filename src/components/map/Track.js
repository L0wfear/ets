import React from 'react';
import { getStartOfToday, makeDate, makeTime } from 'utils/dates';
import { TRACK_COLORS, TRACK_LINE_OPACITY, TRACK_LINE_WIDTH, TRACK_POINT_RADIUS, SHOW_ONLY_POINTS_WITH_SPEED_CHANGES } from 'constants/track.js';
import { getTrackPointByColor } from '../../icons/track/points.js';
import { swapCoords, roundCoordinates } from 'utils/geo';
import { isEmpty, hexToRgba } from 'utils/functions';

const DRAW_POINTS = true;
const COLORS_ZOOM_THRESHOLD = 6;

/**
 * получение цвета линии трэка
 * в зависимости от скорости
 * @param speed
 * @return color string
 */

export function getTrackColor(speed, maxSpeed, opacity = 1) {
  let result = TRACK_COLORS.green; // green by default

  if (speed >= 0 && speed < maxSpeed) {
    result = TRACK_COLORS.green;
  }

  if (speed >= maxSpeed) {
    result = TRACK_COLORS.red;
  }

  return opacity === 1 ? result : hexToRgba(result, opacity);
}

/**
 * Трек на карте
 */
export default class Track {

  constructor(owner) {
    this.map = owner.map;
    const reactMapProps = owner._reactMap.props;
    this.maxSpeed = owner.options.maxSpeed;
    this.typesIndex = reactMapProps.typesIndex;
    // TODO придумать что-то с этими контекстами
    this.ctx = owner._reactMap.canvas.getContext('2d');
    this.owner = owner;

    this.points = null;
    this.continuousUpdating = true;
    this.onUpdateCallback = () => {};
  }

  isLoaded() {
    // console.log(this.owner, this.points && this.points.length)
    // debugger;
    return this.points !== null && this.points.length > 0;
  }

  getLastPoint() {
    return this.isLoaded() && this.points[this.points.length - 1];
  }

  addPoint(point) {
    if (!this.continuousUpdating) {
      return;
    }

    if (this.points !== null && (this.points.length && point.timestamp > this.points[this.points.length - 1].timestamp)) {
      this.points.push(point);
      // this.render();
      this.onUpdateCallback();
    }
  }

  onUpdate(fn = () => {}) {
    this.onUpdateCallback = fn;
  }

  setContinuousUpdating(flag) {
    console.log('track', this, 'continuousUpdating is', flag);
    this.continuousUpdating = flag;
  }

  getLegend() {
    const colors = [];

    let prevColor = getTrackColor(0, this.maxSpeed);

    function addColor(color, speed) {
      if (colors.length > 0) {
        colors[colors.length - 1].till = speed - 1;
      }
      colors.push({
        color,
        speed,
      });
    }

    addColor(prevColor, 0);

    for (let i = 0, till = 100; i <= till; i++) {
      const color = getTrackColor(i, this.maxSpeed);
      if (color !== prevColor) {
        addColor(color, i);
        prevColor = color;
      }
    }

    colors[colors.length - 1].speed += '+';

    const legend = colors.map((obj, i) => {
      const text = obj.speed + (obj.till ? ' – ' + obj.till : '') + ' км/ч';
      const color = obj.color;

      return (
        <div key={i} className="track-legend-item">
          <div className="track-legend-point" style={{ backgroundColor: color }} />
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

  getDistance() {
    return parseFloat(this.points.reduce((prev, curr) => {
      function isFloat(n) {
        return n === +n && n !== (n | 0);
      }
      if (curr && isFloat(curr.distance)) {
        prev += curr.distance;
      }
      return prev;
    }, 0.000) / 1000).toFixed(3);
  }


  fetch(flux, from_dt = getStartOfToday(), to_dt = new Date().getTime()) {
    const id = this.owner.point.id;
    const updating = this.continuousUpdating;

    if (to_dt - from_dt > 5 * 24 * 60 * 60 * 1000) {
      global.NOTIFICATION_SYSTEM.notify('Период запроса трэка не может превышать 5 суток', 'warning');
      return;
    }

    this.continuousUpdating = false;

    return flux.getActions('cars').getTrack(id, from_dt, to_dt)
                .then((obj) => {
                  this.points = obj.track;
                  this.continuousUpdating = updating;
                  this.render();
                  this.onUpdateCallback();
                  console.log('track fetched for', this.owner);
                });
  }

  render(speed = null) {
    const map = this.map;
    const zoom = map.getView().getZoom();

    if (zoom > COLORS_ZOOM_THRESHOLD) {
      this.renderInColors(speed);
    } else {
      this.renderSimple();
    }
    this.owner._reactMap.triggerRender();
  }

  renderSimple() {
    const owner = this.owner;
    const track = this.points;
    const ctx = this.ctx;

    if (!track || track.length < 2) {
      return;
    }

    // Сравнение в случае если все точки трека одинаковые
    // console.log(_.uniqWith(track, (a,b) => {
    //   return a.coords_msk[0] === b.coords_msk[0] && a.coords_msk[1] === b.coords_msk[1];
    // }).length);

    ctx.strokeStyle = TRACK_COLORS.blue;
    ctx.lineWidth = TRACK_LINE_WIDTH;
    ctx.lineCap = 'round';

    const first = this.map.projectToPixel(track[0].coords_msk);

    ctx.beginPath();
    ctx.moveTo(first.x, first.y);

    for (let i = 1, till = track.length - 1; i < till; i++) {
      const coords = this.map.projectToPixel(track[i].coords_msk);
      ctx.lineTo(coords.x, coords.y);
    }

    // если машина в движении - дорисовываем еще одну точку, чтобы трэк не обрывался
    // получается некрасиво в том случае, если обновление происходит редко
    // и машина резко перемещается на другую точку
    if (owner.point.status === 1 && this.continuousUpdating) {
      const coords = this.map.projectToPixel(swapCoords(owner.point.coords_msk));
      // console.log(track[0].coords_msk, owner.point.coords_msk);
      ctx.lineTo(coords.x, coords.y);
    }

    ctx.stroke();
  }

  getExtent() {
    let minX = 100000;
    let minY = 100000;
    let maxX = 0;
    let maxY = 0;
    const trackPoints = this.points;

    for (const key in trackPoints) {
      const point = trackPoints[key];
      const [x, y] = point.coords_msk;

      if (x < minX) {
        minX = x;
      }
      if (x > maxX) {
        maxX = x;
      }

      if (y < minY) {
        minY = y;
      }
      if (y > maxY) {
        maxY = y;
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
    const ctx = this.ctx;
    if (DRAW_POINTS) {
      const cachedPoint = getTrackPointByColor(color);
      ctx.drawImage(
        cachedPoint,
        coords.x - TRACK_POINT_RADIUS - 1,
        coords.y - TRACK_POINT_RADIUS - 1,
        (TRACK_POINT_RADIUS + 1) * 2,
        (TRACK_POINT_RADIUS + 1) * 2);
    }
  }
  /**
   * Рисует трек в canvas контексте в несколько цветов, в зависимости от скорости
   * TODO http://jsperf.com/changing-canvas-state/3
   * // @param ctx
   */
  renderInColors() {
    const owner = this.owner;
    const track = this.points;
    const TRACK_LINE_WIDTH = DRAW_POINTS ? 4 : TRACK_LINE_WIDTH;
    const ctx = this.ctx;


    if (!track || track.length < 2) {
      return;
    }

    // TODO import from settings
    const RENDER_GRADIENT = this.owner.store.state.showTrackingGradient;

    const firstPoint = this.map.projectToPixel(track[0].coords_msk);
    let prevCoords = firstPoint;

    ctx.lineWidth = TRACK_LINE_WIDTH;
    ctx.lineCap = 'butt';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(firstPoint.x, firstPoint.y);

    let prevRgbaColor = getTrackColor(track[0].speed_avg, this.maxSpeed, TRACK_LINE_OPACITY);
    ctx.strokeStyle = prevRgbaColor;

    for (let i = 1, till = track.length - 1; i < till; i++) {
      const coords = this.map.projectToPixel(track[i].coords_msk);
      const speed = track[i].speed_avg;
      const rgbaColor = getTrackColor(speed, this.maxSpeed, TRACK_LINE_OPACITY);
      const hexColor = getTrackColor(speed, this.maxSpeed);

      // если предыдущий цвет не соответствует новому
      // нужно закрыть предыдущую линию
      // и нарисовать новую
      if (prevRgbaColor !== rgbaColor) {
        if (RENDER_GRADIENT) {
          // stroke path before
          ctx.stroke();

          // make gradient fill
          const gradient = ctx.createLinearGradient(prevCoords.x, prevCoords.y, coords.x, coords.y);
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
      } else {
 // если цвет не менялся

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
      const coords = this.map.projectToPixel(swapCoords(owner.point.coords_msk));
      ctx.lineTo(coords.x, coords.y);
    }

    ctx.stroke();
  }

  getPointAtCoordinate(coordinate) {
    const view = this.map.getView();
    const projectedPixel = this.map.projectToPixel(coordinate);
    const extent = view.calculateExtent(this.map.getSize());
    const viewportPoints = this.getTrackPointsInExtent(extent);
    let selected = null;

    for (const key in viewportPoints) {
      const point = viewportPoints[key];
      const pixelCoords = this.map.projectToPixel(point.coords_msk);
      const radius = TRACK_POINT_RADIUS;

      const dx = pixelCoords.x - projectedPixel.x;
      const dy = pixelCoords.y - projectedPixel.y;

      if (dx * dx + dy * dy < radius * radius) {
        selected = point;
        break;
      }
    }

    return selected;
  }


  getTrackPointsInExtent(extent) {
    const points = this.points;
    const returns = [];

    for (const key in points) {
      const point = points[key];
      if (ol.extent.containsCoordinate(extent, point.coords_msk)) {
        returns.push(point);
      }
    }

    return returns;
  }


  // TODO refactor
  async getTrackPointTooltip(flux, trackPoint, prevPoint, nextPoint) {
    let missions = [];
    const vectorObject = await flux.getActions('cars')
        .getVectorObject(trackPoint, prevPoint, nextPoint);
    // это рак вызванный косяком бекенда
    const carsList = flux.getStore('objects').state.carsList;
    const car = carsList.find(c => c.gov_number === this.owner.point.car.gov_number);
    if (car) {
      missions = await flux.getActions('cars')
          .getCarMissionsByTimestamp(car.asuods_id, trackPoint.timestamp);
      missions = missions.result;
    }
    let { nsat,
          speed_avg,
          speed_max,
          timestamp,
          distance } = trackPoint;
    const [latitude, longitude] = roundCoordinates(trackPoint.coords_msk, 6);
    const gov_number = this.owner.point.car.gov_number;

    distance = typeof distance === 'number' ? Math.floor(distance) : distance;
    timestamp = new Date(timestamp * 1000);
    const dt = `${makeDate(timestamp)} ${makeTime(timestamp, true)}`;

    return function makePopup() {
      let objectsString;
      let missionsString;
      // Объекты на точке
      if (vectorObject.result && vectorObject.result[0] && vectorObject.result[1]) {
        if (vectorObject.result[0].asuods_id && vectorObject.result[1].asuods_id) {
          if (vectorObject.result[0].asuods_id === vectorObject.result[1].asuods_id) {
            objectsString = vectorObject.result[0].name ? vectorObject.result[0].name : '';
          } else {
            objectsString = `${vectorObject.result[0].name} / ${vectorObject.result[1].name}`;
          }
        }
      }
      if (isEmpty(objectsString)) {
        objectsString = 'Объекты ОДХ не найдены';
      }

      // Задания на точке
      if (missions.length) {
        missionsString = missions.map(m => `Задание №${m.number}`).join('<br/>');
      } else {
        missionsString = 'Нет выполняемых заданий';
      }

      return `
        <div>
          <div class="header">
            <span class="gov-number">${gov_number}</span>
            <span class="dt">${dt}</span>
          </div>
          <div class="geo-objects">${objectsString}</div>
          <div class="geo-objects">${missionsString}</div>
          <div class="some-info">
            <div class="speed">V<sub>ср</sub> = ${speed_avg}км/ч<br/>V<sub>макс</sub> = ${speed_max}км/ч</div>
            <div class="distance">${distance}м</div>
            <div class="coords">${longitude}<br/>${latitude}</div>
            <div class="nsat">${nsat} спутников</div>
          </div>
        </div>
      `;
    };
  }
}
