import { getStatusById } from 'constants/statuses';
import { swapCoords } from 'utils/geo';
import { getPointStyle } from 'utils/ol';

import {
  SMALL_ICON_RADIUS,
  LARGE_ICON_RADIUS,
} from 'constants/CarIcons.js';
import CoordsAnimation from './CoordsAnimation.js';
import { getSmallIcon, getBigIcon } from 'assets/icons/car.js';
import Marker from '../BaseMarker.js';
import Track from '../../Track.js';

const DEVICE_PIXEL_RATIO = window.devicePixelRatio;

// @todo убрать прозрачность на больших зум левелах
const ZOOM_LARGE_ICONS = 8;
const PI_TIMES_TWO = Math.PI * 2;

function normalizeAngle(angle) {
  while (angle < 0) {
    angle += PI_TIMES_TWO;
  }
  while (angle > PI_TIMES_TWO) {
    angle -= PI_TIMES_TWO;
  }

  return angle;
}

export default class CarMarker extends Marker {

  constructor(point, map, options) {
    super(point, map, options);
    point.marker = this;
    this.coords = swapCoords(point.coords_msk);
    this.track = null;
    this.animating = false;
    this.currentIndex = 0;
    this.currentCoords = [0, 0];
    this.currentSpeed = 0;
    this.currentTime = 0;
    this.new = true;

    this.vectorLayer = new ol.layer.Vector({
      source: new ol.source.Vector({
        features: [],
      }),
    });
    this.vectorLayer.setZIndex(7777777);
    this.map.addLayer(this.vectorLayer);
  }

  isAnimating() {
    return this.animating;
  }

  animate() {
    const { points = [] } = this.track;
    if (points === null || points.length === 0) return false;

    this.animating = true;
    this.store.pauseRendering();
    if (this.new) this.animatePoints = points.map(t => ({ coords: t.coords_msk, speed: t.speed_avg, time: t.timestamp }));
    this.new = false;
    this.animatePoints.splice(0, this.currentIndex);
    // НЕ УДАЛЯТЬ
    // let newPoints = [];
    // _.each(this.animatePoints, (c, i) => {
    //   newPoints.push(this.animatePoints[i]);
    //   if (this.animatePoints[i+1]) {
    //     const points = getCoordinatesBetweenPoints(this.animatePoints[i], this.animatePoints[i+1]);
    //     _.each(points, (p, j) => {
    //       newPoints.push(p);
    //     });
    //   }
    // });

    // TODO сделать константный лейер для карты, а то будет каждый раз создаваться
    
    const map = this.map;
    const coords = this.animatePoints[0].coords;
    const view = map.getView();
    const duration = 1500;

    view.animate({
      duration,
      center: coords,
    });

    setTimeout(() => {
      if (this.animating) {
        this.animateEventKey = this.map.on('postcompose', this.animateToTrack.bind(this));
        this.setVisible(false);
        this.map.disableInteractions();
        this.animateStartTime = new Date().getTime();
        this.image = this.getImage({ selected: true });
        this.radius = this.image.width / 2;
        this.map.render();
      }
    }, 1500);
    return true;
  }

  stopAnimation() {
    this.animating = false;
    this.currentIndex = 0;
    this.currentCoords = [0, 0];
    this.currentSpeed = 0;
    this.currentTime = 0;
    this.new = true;
    this.map.enableInteractions();

    if (this.vectorLayer) this.map.removeLayer(this.vectorLayer);

    this.setVisible(true);
    this.store.unpauseRendering();
    ol.Observable.unByKey(this.animateEventKey);
  }

  togglePlay() {
    if (this.animating) {
      this.animating = false;
      this.map.enableInteractions();
      ol.Observable.unByKey(this.animateEventKey);

      const pausedMarker = new ol.Feature({
        type: 'geoMarker',
        geometry: new ol.geom.Point(this.animatePoints[this.currentIndex].coords),
      });
      pausedMarker.setStyle(getPointStyle('black', 7));
      this.vectorLayer.getSource().addFeature(pausedMarker);
      return true;
    } else {
      if (this.vectorLayer) {
        this.vectorLayer.getSource().clear();
      }
      this.animate();
    }
  }

  animateToTrack(event) {
    const { frameState, vectorContext } = event;
    const elapsedTime = frameState.time - this.animateStartTime;
    const index = Math.round((2 * elapsedTime) / 1000);
    this.currentIndex = index;
    if (index >= this.animatePoints.length) {
      this.stopAnimation();
      return;
    }

    const map = this.map;
    const coords = this.animatePoints[index].coords;
    this.currentCoords = coords;
    this.currentTime = this.animatePoints[index].time;
    this.currentSpeed = this.animatePoints[index].speed;
    this.store.pauseRendering(); // TODO хак для перерендера CarInfo
    const view = map.getView();
    const zoom = view.getZoom();
    const size = map.getSize();
    const pixel = [(size[0] - 500) / 2, size[1] / 2];

    // var duration = 1500;
    // var start = +new Date();
    // var pan = ol.animation.pan({
    //   duration: duration,
    //   source: view.getCenter(),
    //   start: start
    // });
    // map.beforeRender(pan);

    if (!this.paused) {
      view.centerOn(coords, size, pixel);
      if (zoom !== 9) {
        view.setZoom(9);
      }
    }

    const currentPoint = new ol.geom.Point(this.animatePoints[index].coords);
    const feature = new ol.Feature(currentPoint);
    vectorContext.drawFeature(feature, getPointStyle('black', 7));
    this.map.render();
  }

  isVisible() {
    return this.store.isPointVisible(this.point);
  }

  getImage(options) {
    const map = this.map;
    const zoom = map.getView().getZoom();

    return zoom < ZOOM_LARGE_ICONS && !options.selected ? this.renderSmall(options) : this.renderLarge(options); // ТС кружки или иконки при зумировании или клике на точку
  }

  getZoomRatio() {
    const map = this.map;
    const zoom = map.getView().getZoom();
    const coef = 8 - (ZOOM_LARGE_ICONS - zoom);
    return coef > 0 ? coef * 0.4 : 1;
  }

  renderSmall = (options) => {
    const point = this.point;
    const zoomRatio = this.getZoomRatio();
    const radius = this.radius = SMALL_ICON_RADIUS * zoomRatio * DEVICE_PIXEL_RATIO;

    const image = getSmallIcon(point.status, zoomRatio);


    if (options.showPlates) {
      const title = point.car.gov_number;
      const context = this._reactMap.canvas.getContext('2d');
      const drawCoords = this.map.projectToPixel(this.coords);

      context.fillStyle = 'white';
      context.font = `${10 * DEVICE_PIXEL_RATIO}px Verdana`;
      const width = context.measureText(title).width;
      const height = 10 * DEVICE_PIXEL_RATIO;
      const padding = 2 * DEVICE_PIXEL_RATIO;

      const rectWidth = width + (2 * padding) + radius;
      const rectHeight = height + (2 * padding);
      const rectOffsetY = drawCoords.y - radius;

      context.fillRect(drawCoords.x, rectOffsetY, rectWidth, rectHeight);
      context.strokeRect(drawCoords.x - 1, rectOffsetY - 1, rectWidth + 2, rectHeight + 2);
      context.fillStyle = 'black';
      context.textBaseline = 'middle';
      context.fillText(title, drawCoords.x + padding + radius, rectOffsetY + height - padding - 2);
    }

    return image;
  }

  getCar() {
    return this.point.car;
  }

  onClick() {
    if (!this.track) {
      this.createTrack();
    }
  }

  createTrack = () => {
    this.track = new Track(this);
  }

  hasTrackLoaded = () => {
    return this.track !== null && this.track.isLoaded();
  }

  /**
   * todo showPlates via map options
   * @return {[type]} [description]
   */
  renderLarge = (options = {}) => {
    const point = this.point;
    const color = getStatusById(point.status).color; // цвет кружочков для ТС на карте 
    const direction = point.direction;
    const typesIndex = this._reactMap.props.typesIndex;
    const type = typesIndex[point.car ? point.car.type_id : 5];
    const icon = type && type.icon;
    const radius = this.radius = (LARGE_ICON_RADIUS + 6);

    const angle = (Math.PI * direction) / 180;
    const tipAngle = normalizeAngle(angle - (Math.PI / 2));
    const drawCoords = this.map.projectToPixel(this.coords);
    const context = this._reactMap.canvas.getContext('2d');

    const title = point.car.gov_number;

    if (options.showPlates && title) {
      context.fillStyle = 'white';
      context.font = `${13 * DEVICE_PIXEL_RATIO}px Verdana`;

      const text = title;
      const width = context.measureText(text).width;
      const height = 13 * DEVICE_PIXEL_RATIO;
      const padding = 6 * DEVICE_PIXEL_RATIO;

      const rectWidth = width + (2 * padding) + radius;
      const rectHeight = height + (2 * padding);
      const rectOffsetY = (drawCoords.y + padding) - (2 * radius);

      if (tipAngle >= 0.5 * Math.PI && tipAngle <= 1.5 * Math.PI) {
        context.fillRect(drawCoords.x, rectOffsetY, rectWidth, rectHeight);
        context.strokeRect(drawCoords.x - 1, rectOffsetY - 1, rectWidth + 2, rectHeight + 2);
        context.fillStyle = 'black';
        context.textBaseline = 'middle';
        context.fillText(text, drawCoords.x + padding + radius, rectOffsetY + height);
      } else {
        context.fillRect(drawCoords.x - rectWidth, rectOffsetY, rectWidth, rectHeight);
        context.strokeRect((drawCoords.x - rectWidth) + 1, rectOffsetY - 1, rectWidth + 2, rectHeight + 2);
        context.fillStyle = 'black';
        context.textBaseline = 'middle';
        context.fillText(text, (drawCoords.x - rectWidth) + padding, rectOffsetY + height);
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

  setPoint = (point) => {
    this.point = point;
    this.coords = swapCoords(point.coords_msk);

    const [x, y] = this.coords;
    const store = this.store;

    // обновляем трэк, если у точки он загружен
    if (this.hasTrackLoaded()) {
      if (point.timestamp > this.track.getLastPoint().timestamp) {
        this.track.addPoint({
          coords: swapCoords(point.coords),
          coords_msk: swapCoords(point.coords_msk),
          direction: point.direction,
          speed_avg: point.speed,
          distance: point.distance || 'Н/Д',
          speed_max: point.speed_max || 'Н/Д',
          nsat: point.nsat || 'Н/Д',
          timestamp: point.timestamp,
        });
      }
    }

    if (!store.state.isRenderPaused) {
      this._animation = new CoordsAnimation(this, x, y, 500);
    } else {
      this.x = x;
      this.y = y;
    }
  }

}
