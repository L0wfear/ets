import { getStatusById } from 'constants/statuses';
import CoordsAnimation from './CoordsAnimation.js';
import { getSmallIcon, getBigIcon } from '../../../../icons/car.js';
import Marker from '../BaseMarker.js';
import Track from '../../Track.js';
import { swapCoords, wrapCoords } from 'utils/geo';
import { getPointStyle } from 'utils/ol';
import { getTypeById } from 'utils/labelFunctions';
import _ from 'lodash';

const DEVICE_PIXEL_RATIO = window.devicePixelRatio;

import {
  SMALL_ICON_RADIUS,
  LARGE_ICON_RADIUS
} from 'constants/CarIcons.js';

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
    this.coords = wrapCoords(swapCoords(point.coords_msk))
    this.track = null;
    this.animating = false;
    this.currentIndex = 0;
    this.currentCoords = [0,0];
    this.currentSpeed = 0;
    this.currentTime = 0;
    this.new = true;
  }

  isAnimating() {
    return this.animating;
  }

  animate() {
    this.animating = true;
    this.store.pauseRendering();
    if (this.new) this.animatePoints = _(this.track.points).map(t => ({coords: t.coords_msk, speed: t.speed_avg, time: t.timestamp})).value();
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

    var geoMarker = new ol.Feature({
      type: 'geoMarker',
      geometry: new ol.geom.Point(this.animatePoints[0].coords)
    });

    // TODO сделать константный лейер для карты, а то будет каждый раз создаваться
    this.vectorLayer = new ol.layer.Vector({
      source: new ol.source.Vector({
        features: []
      })
    });
    this.map.addLayer(this.vectorLayer);

    let map = this.map;
    let coords = this.animatePoints[0].coords;
    let view = map.getView();

    var duration = 1500;
    var start = +new Date();
    var pan = ol.animation.pan({
      duration: duration,
      source: view.getCenter(),
      start
    });
    map.beforeRender(pan);
    view.setCenter(coords);

    setTimeout(() => {
      this.animateEventKey = this.map.on('postcompose', this.animateToTrack.bind(this));
      this.setVisible(false);
      this.map.disableInteractions();
      this.animateStartTime = new Date().getTime();
      this.image = this.getImage({selected: true});
      this.radius = this.image.width / 2;
      this.map.render();
    }, 1500);
  }

  stopAnimation() {
    this.animating = false;
    this.currentIndex = 0;
    this.currentCoords = [0,0];
    this.currentSpeed = 0;
    this.currentTime = 0;
    this.new = true;
    this.map.enableInteractions();
    if (this.vectorLayer) this.map.removeLayer(this.vectorLayer);
    this.setVisible(true);
    this.store.unpauseRendering();
    this.map.unByKey(this.animateEventKey);
  }

  togglePlay() {
    if (this.animating) {
      this.animating = false;
      this.map.enableInteractions();
      this.map.unByKey(this.animateEventKey);

      let pausedMarker = new ol.Feature({
        type: 'geoMarker',
        geometry: new ol.geom.Point(this.animatePoints[this.currentIndex].coords)
      });
      pausedMarker.setStyle(getPointStyle('black', 7));
      this.vectorLayer.getSource().addFeature(pausedMarker);
    } else {
      if (this.vectorLayer) this.map.removeLayer(this.vectorLayer);
      this.animate();
    }
  }

  animateToTrack(event) {
    let { image, radius } = this;
    let { frameState, vectorContext } = event;
    let elapsedTime = frameState.time - this.animateStartTime;
    let index = Math.round(2 * elapsedTime / 1000);
    this.currentIndex = index;
    if (index >= this.animatePoints.length) {
      this.stopAnimation();
      return;
    }

    let map = this.map;
    let coords = this.animatePoints[index].coords;
    this.currentCoords = coords;
    this.currentTime = this.animatePoints[index].time;
    this.currentSpeed = this.animatePoints[index].speed;
    this.store.pauseRendering(); //TODO хак для перерендера CarInfo
    let view = map.getView();
    let zoom = view.getZoom();
    let size = map.getSize();
    let pixel = [(size[0] - 500) / 2, size[1] / 2];

    // var duration = 1500;
    // var start = +new Date();
    // var pan = ol.animation.pan({
    //   duration: duration,
    //   source: view.getCenter(),
    //   start: start
    // });
    // map.beforeRender(pan);

    if (!this.paused) {
      view.centerOn(coords, size, pixel)
      if (zoom != 9) {
        view.setZoom(9);
      }
    };

    let currentPoint = new ol.geom.Point(this.animatePoints[index].coords);
    let feature = new ol.Feature(currentPoint);
    vectorContext.drawFeature(feature, getPointStyle('black', 7));
    this.map.render();
  }

  isVisible() {
    return this.store.isPointVisible(this.point);
  }

  getImage(options) {
    let map = this.map;
    let zoom = map.getView().getZoom();

    return zoom < ZOOM_LARGE_ICONS && !options.selected ? this.renderSmall(options) : this.renderLarge(options);
  }

  getZoomRatio() {
    let map = this.map;
    let zoom = map.getView().getZoom();
    let coef = 8 - (ZOOM_LARGE_ICONS - zoom);
    return coef > 0 ? coef * .4 : 1 ;
  }

  renderSmall = (options) => {
    let point = this.point;
    let zoomRatio = this.getZoomRatio();
    let radius = this.radius = SMALL_ICON_RADIUS * zoomRatio;

    let image = getSmallIcon(point.status, zoomRatio);


    if (options.showPlates) {
      const title = point.car.gov_number;
      let context = this._reactMap.canvas.getContext('2d');
      let drawCoords = this.map.projectToPixel(this.coords);

      context.fillStyle = 'white';

      var width = context.measureText(title).width;
      var padding = 1 * zoomRatio;

      // dont try to understand
      var rectWidth = width + padding + radius - 3;
      var rectHeight = radius + 4;
      var rectOffsetY = drawCoords.y - radius / 2 - 2;

      context.fillRect(drawCoords.x - rectWidth, rectOffsetY, rectWidth, rectHeight);
      context.fillStyle = 'black';
      context.textBaseline = 'middle';
      context.fillText(title, drawCoords.x - rectWidth + padding, drawCoords.y);
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

  createTrack() {
    this.track = new Track(this);
  }

  hasTrackLoaded() {
    return this.track !== null && this.track.isLoaded();
  }

  /**
   * todo showPlates via map options
   * @return {[type]} [description]
   */
  renderLarge = (options = {}) => {

    let point = this.point;
    let color = getStatusById(point.status).color;
    let direction = point.direction;
    let type = getTypeById(point.car ? point.car.type_id : 5);
    let icon = type && type.icon;
    let radius = this.radius = (LARGE_ICON_RADIUS + 6);

    let angle = Math.PI * direction / 180;
    let tipAngle = normalizeAngle(angle - Math.PI / 2);
    let drawCoords = this.map.projectToPixel(this.coords);
    let context = this._reactMap.canvas.getContext('2d');

    const title = point.car.gov_number;

    if (options.showPlates && title) {

      context.fillStyle = 'white';

      var text = title;
      var width = context.measureText(text).width ;
      var padding = 3;

      var rectWidth = width + 2 * padding + radius + 7;
      var rectHeight = 2 * radius - 9;
      var rectOffsetY = drawCoords.y - radius + 5;

      rectWidth = rectWidth * DEVICE_PIXEL_RATIO;

      context.font = 12 * DEVICE_PIXEL_RATIO + 'px \'Helvetica Neue\'';

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
    this.coords = swapCoords(point.coords_msk);

    let [x, y] = this.coords;
    let store = this.store;

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
          timestamp: point.timestamp
        })
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
