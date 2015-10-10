/**
 * Базовый интерфейс маркера карты
 *
 * @todo подумать про наследование от стандартного маркера OpenLayers
 * @todo SelectableMarker extends BaseMarker
 */

const IS_MSK = true;

import { projectToPixel } from '../map/MskAdapter.js';

let wrapCoords = ([x, y]) => {
  return {
    x: x,
    y: y
  }
}

export default class Marker {
  constructor(point, map) {
    this.point = point;

    // some methods may be useful
    this.store = map._pointsStore;
    this.map = map.map;
    this.canvas = map.canvas;
    this.image = null;
    this.radius = 0;
    this.ctx = this.canvas.getContext('2d')
    this.coords = this.getCoords()

    this.animation = null;
  }

  getCoords() {
    let point = this.point;
    let coords = point.coords;
    let coords_msk = point.coords_msk;

    return IS_MSK ? wrapCoords(coords_msk) : wrapCoords(coords)
  }

  onClick() {
    /** onClick **/
  }

  renderImage() {}

  render(options = {}) {
    let image = this.getImage(options);
    let radius = image.width / 2;
    let ctx = this.ctx;
    let drawCoords = projectToPixel(this.coords);

    if (this.animation) {
      this.animation.update(time);
    }

    ctx.drawImage(image, drawCoords.x - radius, drawCoords.y - radius, radius * 2, radius * 2);
  }

  /**
   * проверка на вхождение координаты в маркер
   */
  contains(coordinates) {

    let projectedPixel = projectToPixel(coordinates);
    let pixelCoords = projectToPixel(this.coords)

    let radius = this.radius;

    var dx = pixelCoords.x - projectedPixel.x;
    var dy = pixelCoords.y - projectedPixel.y;

    return dx * dx + dy * dy < radius * radius;
  }

}
