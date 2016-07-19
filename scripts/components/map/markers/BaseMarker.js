/**
 * Базовый интерфейс маркера карты
 *
 * @todo подумать про наследование от стандартного маркера OpenLayers
 * @todo SelectableMarker extends BaseMarker
 */
import { wrapCoords } from 'utils/geo';

const IS_MSK = true;

export default class Marker {
  constructor(point, map) {
    this.point = point;

    // some methods may be useful
    this.store = map._pointsStore;

    // todo this.owner
    this._reactMap = map;

    this.map = map.map;
    this.image = null;
    this.radius = 0;
    this.coords = this.getCoords()

    this.animation = null;
  }

  getCoords() {
    let point = this.point;
    let coords = point.coords;
    let coords_msk = point.coords_msk;

    return IS_MSK ? wrapCoords(coords_msk) : wrapCoords(coords);
  }

  onClick() {
    /** onClick **/
  }

  renderImage() {}

  render(options = {}) {
    if (this.coords[0] === null || this.coords[1] === null ) return;

    let image = this.getImage(options);
    let radius = image.width / 2;
    let canvas = this._reactMap.canvas;
    let ctx = canvas.getContext('2d');
    let drawCoords = this.map.projectToPixel(this.coords);

    if (typeof ctx === 'undefined') {
      return;
    }

    if (this.animation) {
      this.animation.update(time);
    }

    ctx.drawImage(image, drawCoords.x - radius, drawCoords.y - radius, radius * 2, radius * 2);
  }

  /**
   * проверка на вхождение координаты в маркер
   */
  contains = (coordinates) => {

    let projectedPixel = this.map.projectToPixel(coordinates);
    let pixelCoords = this.map.projectToPixel(this.coords)

    let radius = this.radius;

    var dx = pixelCoords.x - projectedPixel.x;
    var dy = pixelCoords.y - projectedPixel.y;

    return dx * dx + dy * dy < radius * radius;
  }

}
