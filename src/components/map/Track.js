import React from 'react';
import { get, pick, toArray } from 'lodash';
import insider from 'point-in-polygon';

import { SpanTitle, ColorLegend } from 'components/map/syled/styled';
import { getStartOfToday, makeDate, makeTime, secondsToTime } from 'utils/dates';
import { swapCoords, roundCoordinates } from 'utils/geo';
import { isEmpty, hexToRgba } from 'utils/functions';
import { TRACK_COLORS, TRACK_LINE_OPACITY, TRACK_LINE_WIDTH, TRACK_POINT_RADIUS, SHOW_ONLY_POINTS_WITH_SPEED_CHANGES } from 'constants/track.js';
import { getTrackSensorColor } from 'constants/sensors.js';
import { getTrackPointByColor } from 'assets/icons/track/points.js';
import ParkingIconSVG from 'assets/icons/track/parking.svg';

import FuelIcon1 from 'assets/icons/track/oil-01.png';
import FuelIcon2 from 'assets/icons/track/oil-02.png';

const checkPointInGeometry = (point, geometry) => {
  return {
    onMkad: Object.values(geometry).some((geom) => {
      const { shape: { coordinates, type } } = geom;

      if (type === 'Polygon') {
        return coordinates.some(polygon => insider(point, polygon));
      }

      if (type === 'MultiPolygon') {
        return coordinates.some(mpolygon => mpolygon.some(polygon => insider(point, polygon)));
      }

      return false;
    }),
  };
};

const makePointTrack = (points, odh_mkad) => (
  points.map(point => ({
    ...point,
    checkOnSpeed: checkPointInGeometry(point.coords_msk, odh_mkad),
  }))
);

const DRAW_POINTS = true;
const COLORS_ZOOM_THRESHOLD = 6;

/**
 * получение цвета линии трэка
 * в зависимости от скорости
 * @param speed
 * @return color string
 */
export function getTrackColor({ speed_avg, checkOnSpeed }, { maxSpeed, mkad_speed_lim, speed_lim }, opacity = 1) {
  let topSpeed = maxSpeed;
  if (checkOnSpeed) {
    topSpeed = checkOnSpeed.onMkad ? mkad_speed_lim : speed_lim;
  }

  let result = TRACK_COLORS.green; // green by default

  if (speed_avg >= 0 && speed_avg <= topSpeed) {
    result = TRACK_COLORS.green;
  }

  if (speed_avg > topSpeed) {
    result = TRACK_COLORS.red;
  }

  return opacity === 1 ? result : hexToRgba(result, opacity);
}

/**
 * Трек на карте
 */
 // TODO РЕФАКТОР!!!!
export default class Track {

  constructor(owner) {
    this.map = owner.map;
    const reactMapProps = owner._reactMap.props;
    this.mkad_speed_lim = owner.options.mkad_speed_lim;
    this.speed_lim = owner.options.speed_lim;
    this.maxSpeed = owner.options.maxSpeed;
    this.typesIndex = reactMapProps.typesIndex;
    // TODO придумать что-то с этими контекстами
    this.ctx = owner._reactMap.canvas.getContext('2d');
    this.owner = owner;

    this.points = null;
    this.hasPointTrakOnMkad = false;
    this.sensorsState = {
      level: [],
      equipment: [],
    };
    this.parkings = [];
    this.events = {};

    this.distance = 0;

    this.parkingIcon = new Image();
    this.parkingIcon.src = ParkingIconSVG;

    this.fuelIcons = {};
    this.fuelIcons.leak = new Image();
    this.fuelIcons.leak.src = FuelIcon2;
    this.fuelIcons.refill = new Image();
    this.fuelIcons.refill.src = FuelIcon1;

    this.continuousUpdating = true;
    this.onUpdateCallback = () => {};

    this.isLoading = false;
  }

  isLoaded() {
    // console.log(this.owner, this.points && this.points.length)
    // debugger;
    return this.points !== null && this.points.length > 0;
  }
  removeAllPoints = () => {
    this.points = null;
  }

  getLastPoint() {
    return this.isLoaded() && this.points[this.points.length - 1];
  }

  addPoint = (point) => {
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
    console.log('track', this, 'continuousUpdating is', flag); // eslint-disable-line
    this.continuousUpdating = flag;
  }

  getLegend({ object_type_name, has_mkad }) {
    const legendPard = [];
    legendPard.push(
      <div key="obj-green" className="track-legend-item">
        <ColorLegend className="track-legend-point" color={TRACK_COLORS.green} />
        <div className="track-legend-text">
          <span>{`0 - ${this.speed_lim} км/ч`}</span>
          <SpanTitle>{object_type_name}</SpanTitle>
        </div>
      </div>,
      <div key="obj-red" className="track-legend-item">
        <ColorLegend className="track-legend-point" color={TRACK_COLORS.red} />
        <div className="track-legend-text">{`${this.speed_lim}+ км/ч`}</div>
      </div>,
    );

    if (has_mkad) {
      legendPard.push(<div key="devider">---------------------------</div>);
      legendPard.push(
        <div key="mkad-green" className="track-legend-item">
          <ColorLegend className="track-legend-point" color={TRACK_COLORS.green} />
          <div className="track-legend-text">
            <span>{`0 - ${this.mkad_speed_lim} км/ч`}</span>
            <SpanTitle>{'На МКАД'}</SpanTitle>
          </div>
        </div>,
        <div key="mkad-red" className="track-legend-item">
          <ColorLegend className="track-legend-point" color={TRACK_COLORS.red} />
          <div className="track-legend-text">{`${this.mkad_speed_lim}+ км/ч`}</div>
        </div>,
      );
    }


    return (
      <div className="track-legend">
        {
          legendPard
        }
      </div>
    );
  }

  getDistance() {
    return this.distance;
  }


  fetch(flux, from_dt = getStartOfToday(), to_dt = new Date().getTime()) {
    const carData = this.owner.point.car_actual;
    const updating = this.continuousUpdating;

    if (to_dt - from_dt > 10 * 24 * 60 * 60 * 1000) {
      global.NOTIFICATION_SYSTEM.notify('Период запроса трека не может превышать 10 суток', 'warning');
      return new Promise((res, rej) => rej);
    }

    this.continuousUpdating = false;
    this.isLoading = true;

    return flux.getActions('cars').getTrack(carData, from_dt, to_dt)
                .then((obj) => {
                  this.parkings = obj.parkings;
                  this.events = obj.events;
                  this.points = makePointTrack(obj.track, this.owner.storeGeoobjects.state.odh_mkad);
                  this.hasPointTrakOnMkad = this.points.some(({ checkOnSpeed: { onMkad } }) => onMkad);
                  this.sensors = obj.sensors;
                  this.distance = obj.distance;
                  this.continuousUpdating = updating;
                  this.render();
                  this.onUpdateCallback();
                  console.log('track fetched for', this.owner); // eslint-disable-line
                  this.isLoading = false;

                  return obj;
                });
  }

  render(speed = null) {
    const map = this.map;
    const zoom = map.getView().getZoom();

    this.addParkingsToTrack();
    this.addFuelEventsToTrack();
    this.renderInColors();

    this.owner._reactMap.triggerRender();
  }

  addParkingsToTrack() {
    const { parkings, points } = this;
    if (parkings.length) {
      parkings.forEach((p) => {
        const { timestamp } = p.start_point;
        const point = points.find(e => e.timestamp === timestamp);
        point.parking = true;
      });
    }
  }

  addFuelEventsToTrack() {
    const { events, points } = this;
    Object.keys(events).forEach((k) => {
      events[k].forEach((e) => {
        const { timestamp } = e.start_point;
        for (let i = 0; i < points.length; ++i) {
          if (points[i].timestamp === timestamp) {
            points[i].event = this.sensorsState.level.includes(k) ? e.type : undefined;
          }
        }
      });
    });
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
    const LINE_WIDTH = DRAW_POINTS ? 4 : TRACK_LINE_WIDTH;
    const iconSize = 20 * window.devicePixelRatio;
    const ctx = this.ctx;
    const freezed = track.every(p => p.coords_msk[0] === track[0].coords_msk[0] && p.coords_msk[1] === track[0].coords_msk[1]);

    if (!track || track.length < 2) {
      return;
    }

    // TODO import from settings
    const RENDER_GRADIENT = this.owner.store.state.showTrackingGradient;

    const firstPoint = this.map.projectToPixel(track[0].coords_msk);



    if (this.sensorsState.equipment.length) {
      prevCoords = firstPoint;

      ctx.lineWidth = LINE_WIDTH;
      ctx.lineCap = 'butt';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(firstPoint.x, firstPoint.y);

      prevRgbaColor = getTrackSensorColor(this.sensorsState.equipment, get(track[0], ['sensors', 'equipment']));
      ctx.strokeStyle = prevRgbaColor;

      for (let i = 1, till = track.length; i < till; i++) {
        const p = track[i];

        const coords = this.map.projectToPixel(p.coords_msk);

        const rgbaColor = getTrackSensorColor(this.sensorsState.equipment, get(p, ['sensors', 'equipment']));
        const hexColor = getTrackSensorColor(this.sensorsState.equipment, get(p, ['sensors', 'equipment']));

        ctx.globalCompositeOperation = 'destination-over';

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
          ctx.lineWidth = LINE_WIDTH;
          ctx.beginPath();
          ctx.moveTo(coords.x, coords.y);
        } else {
  // если цвет не менялся

          ctx.strokeStyle = prevRgbaColor;
          ctx.lineWidth = LINE_WIDTH;
          ctx.lineTo(coords.x, coords.y);

          // оптимизация, типа
          // рисовать кружки только там, где были заметные изменения скорости
          if (!SHOW_ONLY_POINTS_WITH_SPEED_CHANGES) {
            ctx.stroke();

            this.drawTrackPoint(coords, hexColor);

            ctx.strokeStyle = rgbaColor;
            ctx.lineWidth = LINE_WIDTH;
            ctx.beginPath();
            ctx.moveTo(coords.x, coords.y);
          }
        }

        prevCoords = coords;
        prevRgbaColor = rgbaColor;

        ctx.globalCompositeOperation = 'source-over';
        if (p.parking) {
          const shift = p.event !== undefined || freezed ? 20 : 0;
          ctx.drawImage(this.parkingIcon,
            coords.x - (iconSize / 2) - shift,
            coords.y - (iconSize / 2) - shift,
            iconSize,
            iconSize,
          );
        }
        if (p.event !== undefined) {
          const shift = p.parking || freezed ? -20 : 0;
          ctx.drawImage(this.fuelIcons[p.event],
            coords.x - (iconSize / 2) - shift,
            coords.y - (iconSize / 2) - shift,
            iconSize,
            iconSize,
          );
        }
      }

      // если машина в движении - дорисовываем еще одну точку, чтобы трэк не обрывался
      // получается некрасиво в том случае, если обновление происходит редко
      // и машина резко перемещается на другую точку
      if (owner.point.status === 1 && this.continuousUpdating) {
        const coords = this.map.projectToPixel(swapCoords(owner.point.coords_msk));
        ctx.lineTo(coords.x, coords.y);
      }

      ctx.stroke();
      ctx.closePath();
    }

    let prevCoords = firstPoint;

    ctx.lineWidth = LINE_WIDTH + this.sensorsState.equipment.length ? 8 : 0;
    ctx.lineCap = 'butt';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(firstPoint.x, firstPoint.y);

    let prevRgbaColor = getTrackColor(track[0], this, TRACK_LINE_OPACITY);

    ctx.strokeStyle = prevRgbaColor;

    for (let i = 1, till = track.length; i < till; i++) {
      const prevPoint = track[i - 1];
      const p = track[i];

      /**
       * TODO Выяснить, почему приходят одинаковые точки.
       * Так как приходят одинаковые по координатам точки, но с разными скоростями,
       * необходимо пропускать такие точки для корректной отрисовки.
       */
      // if (isEqual(prevPoint.coords, p.coords)) {
      //   continue;
      // }

      const coords = this.map.projectToPixel(p.coords_msk);

      let rgbaColor = getTrackColor(p, this, TRACK_LINE_OPACITY);
      let hexColor = getTrackColor(p, this);

      ctx.globalCompositeOperation = 'destination-over';

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
        ctx.lineWidth = LINE_WIDTH + this.sensorsState.equipment.length ? 8 : 0;
        ctx.beginPath();
        ctx.moveTo(coords.x, coords.y);
      } else {
 // если цвет не менялся

        ctx.strokeStyle = prevRgbaColor;
        ctx.lineWidth = LINE_WIDTH + this.sensorsState.equipment.length ? 8 : 0;
        ctx.lineTo(coords.x, coords.y);

        // оптимизация, типа
        // рисовать кружки только там, где были заметные изменения скорости
        if (!SHOW_ONLY_POINTS_WITH_SPEED_CHANGES) {
          ctx.stroke();

          this.drawTrackPoint(coords, hexColor);

          ctx.strokeStyle = rgbaColor;
          ctx.lineWidth = LINE_WIDTH + this.sensorsState.equipment.length ? 8 : 0;
          ctx.beginPath();
          ctx.moveTo(coords.x, coords.y);
        }
      }

      prevCoords = coords;
      prevRgbaColor = rgbaColor;

      ctx.globalCompositeOperation = 'source-over';
      if (p.parking) {
        const shift = p.event !== undefined || freezed ? 20 : 0;
        ctx.drawImage(this.parkingIcon,
          coords.x - (iconSize / 2) - shift,
          coords.y - (iconSize / 2) - shift,
          iconSize,
          iconSize,
        );
      }
      if (p.event !== undefined) {
        const shift = p.parking || freezed ? -20 : 0;
        ctx.drawImage(this.fuelIcons[p.event],
          coords.x - (iconSize / 2) - shift,
          coords.y - (iconSize / 2) - shift,
          iconSize,
          iconSize,
        );
      }
    }

    // если машина в движении - дорисовываем еще одну точку, чтобы трэк не обрывался
    // получается некрасиво в том случае, если обновление происходит редко
    // и машина резко перемещается на другую точку
    if (owner.point.status === 1 && this.continuousUpdating) {
      const coords = this.map.projectToPixel(swapCoords(owner.point.coords_msk));
      ctx.lineTo(coords.x, coords.y);
    }

    ctx.stroke();
    ctx.closePath();
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

    this.parkings.length && this.parkings.forEach((p) => {
      const point = p.start_point;
      const pixelCoords = this.map.projectToPixel(swapCoords(point.coords_msk));
      const radius = 20;

      const dx = pixelCoords.x - projectedPixel.x;
      const dy = pixelCoords.y - projectedPixel.y;

      if (dx * dx + dy * dy < radius * radius) {
        selected = viewportPoints.find(p => p.timestamp === point.timestamp);
      }
    });

    Object.keys(this.events).forEach(k => this.sensorsState.level.includes(k) && this.events[k].forEach((p) => {
      const point = p.start_point;
      const pixelCoords = this.map.projectToPixel(swapCoords(point.coords_msk));
      const radius = 20;

      const dx = pixelCoords.x - projectedPixel.x;
      const dy = pixelCoords.y - projectedPixel.y;

      if (dx * dx + dy * dy < radius * radius) {
        selected = viewportPoints.find(p => p.timestamp === point.timestamp);
      }
    }));


    return selected;
  }


  getTrackPointsInExtent(extent) {
    return Object.values(this.points).reduceRight((newArr, point) => {
      if (ol.extent.containsCoordinate(extent, point.coords_msk)) {
        newArr.push(point);
      }

      return newArr;
    }, []);
  }

  makeParkingPopup(parking) {
    const start = `${makeDate(new Date(parking.start_point.timestamp * 1000))} ${makeTime(new Date(parking.start_point.timestamp * 1000), true)}`;
    const end = `${makeDate(new Date(parking.end_point.timestamp * 1000))} ${makeTime(new Date(parking.end_point.timestamp * 1000), true)}`;
    const diff = secondsToTime(parking.end_point.timestamp - parking.start_point.timestamp);
    return () => `
      <div style="font-weight: normal;">
        <div class="header" style="padding-left: 10px;">
          Зона стоянки:
        </div>
        <div style="padding:10px;">
          <div><b>Начало:</b> ${start}</div>
          <div><b>Конец:</b> ${end}</div>
          <div><b>Время стоянки:</b> ${diff}</div>
        </div>
      </div>
    `;
  }

  makeEventPopup(event, id) {
    const type = event.event_type === 'leak' ? 'Слив топлива' : 'Заправка топлива';
    const value = event.event_val;
    const start = `${makeDate(new Date(event.start_point.timestamp * 1000))} ${makeTime(new Date(event.start_point.timestamp * 1000), true)}`;
    const diff = secondsToTime(event.end_point.timestamp - event.start_point.timestamp);
    return () => `
      <div style="font-weight: normal;">
        <div class="header" style="padding-left: 10px;">
          ${type}:
        </div>
        <div style="padding:10px;">
          <div><b>Датчик:</b> ${id}</div>
          <div><b>Кол-во:</b> ${Math.abs(value)} л</div>
          <div><b>Дата и время:</b> ${start}</div>
          <div><b>Потраченное время:</b> ${diff}</div>
        </div>
      </div>
    `;
  }


  // TODO refactor
  async getTrackPointTooltip(flux, trackPoint, prevPoint, nextPoint, forceEvent) {
    const event = {
      data: null,
      id: null,
    };
    Object.keys(this.events).forEach((k) => {
      if (forceEvent || this.sensorsState.level.includes(k)) {
        event.data = this.events[k].find(p => {
          return p.start_point.timestamp <= trackPoint.timestamp
            && p.end_point.timestamp >= trackPoint.timestamp;
        });
        event.id = k;
      }
    });

    const parking = this.parkings.find(p => {
      return p.start_point.timestamp <= trackPoint.timestamp
        && p.end_point.timestamp >= trackPoint.timestamp;
    });

    const joinedPopup = `
      <div>
        ${event.data ? this.makeEventPopup(event.data, event.id)() : ''}
        ${parking ? this.makeParkingPopup(parking)() : ''}
      </div>
    `;

    if (event.data || parking) {
      return () => joinedPopup;
    }

    let missions = [];
    const vectorObject = await flux.getActions('cars')
        .getVectorObject(trackPoint, prevPoint, nextPoint);
    const carsList = flux.getStore('objects').state.carsList;

    const car = carsList.find(c => c.gov_number === this.owner.point.car.gov_number);
    if (car) {
      missions = await flux.getActions('cars')
          .getCarMissionsByTimestamp(car.asuods_id, trackPoint.timestamp + 10800); // +3 часа
    }

    let { timestamp, distance } = trackPoint;
    const { nsat, speed_avg, speed_max } = trackPoint;
    const { track: { sensors } } = flux.getStore('objects').state;
    const pointSensors = get(trackPoint, ['sensors', 'equipment'], []).filter(s => s.val !== 0);

    const maxSpeed = parseInt(speed_max, 10);
    const speed = parseInt(speed_avg, 10);
    const nsatCount = parseInt(nsat, 10);
    const distanceCount = parseInt(distance, 10);
    const [latitude, longitude] = roundCoordinates(trackPoint.coords_msk, 6);
    const gov_number = this.owner.point.car.gov_number;

    distance = typeof distance === 'number' ? Math.floor(distance) : distance;
    timestamp = new Date(timestamp * 1000);
    const dt = `${makeDate(timestamp)} ${makeTime(timestamp, true)}`;

    return function makePopup() {
      let objectsString;
      let missionsString;
      let sensorsString;
      let sensorsVisibility = 'none';
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

      if (pointSensors.length > 0) {
        sensorsVisibility = 'block';
        const sensorNames = toArray(pick(sensors, pointSensors.map(p => `${p.id}`)));
        sensorsString = `
          <div style="margin-bottom: 5px;">Работающие датчики навесного оборудования</div>
          ${sensorNames.map((p, i) => `<div style="margin-left: 10px;">Датчик №${i + 1} - ${p.type_name}</div>`).join('')}
        `;
      }


      return `
        <div>
          <div class="header">
            <span class="gov-number">${gov_number}</span>
            <span class="dt">${dt}</span>
          </div>
          <div class="geo-objects">${objectsString}</div>
          <div class="geo-objects">${missionsString}</div>
          <div style="display: ${sensorsVisibility}" class="geo-objects">${sensorsString}</div>
          <div class="some-info">
            <div class="speed">V<sub>ср</sub> = ${!isNaN(speed) ? `${speed}км/ч` : 'Нет данных'}<br/>V<sub>макс</sub> = ${!isNaN(maxSpeed) ? `${maxSpeed}км/ч` : 'Нет данных'}</div>
            <div class="distance">${isNaN(distanceCount) ? 'Н/Д' : `${distanceCount}м`}</div>
            <div class="coords">${longitude}<br/>${latitude}</div>
            <div class="nsat">${isNaN(nsatCount) ? 0 : nsatCount} спутников</div>
          </div>
        </div>
      `;
    };
  }
}
