/**
 * Базовый интерфейс маркера карты
 *
 * @todo подумать про наследование от стандартного маркера OpenLayers
 * @todo SelectableMarker extends BaseMarker
 */
import { wrapCoords } from 'utils/geo';

const IS_MSK = true;

export default class Marker {
  constructor(point, map, options = {}) {
    this.point = point;

    // some methods may be useful
    this.store = map._pointsStore;

    // todo this.owner
    this._reactMap = map;

    this.map = map.map;
    this.image = null;
    this.radius = 0;
    this.coords = this.getCoords();
    this.options = options;

    this.animation = null;
    this.visible = true;
  }

  getCoords() {
    const point = this.point;
    const coords = point.coords;
    const coords_msk = point.coords_msk;

    return IS_MSK ? wrapCoords(coords_msk) : wrapCoords(coords);
  }

  onClick() {
    /** onClick **/
  }

  setVisible(bool) {
    this.visible = bool;
  }

  renderImage() {}

  render(options = {}) {
    if (this.coords[0] === null || this.coords[1] === null || this.visible === false) return;

    const image = this.getImage(options);
    const radius = image.width / 2;
    const canvas = this._reactMap.canvas;
    const ctx = canvas.getContext('2d');
    const drawCoords = this.map.projectToPixel(this.coords);

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
    const projectedPixel = this.map.projectToPixel(coordinates);
    const pixelCoords = this.map.projectToPixel(this.coords);

    const radius = this.radius;

    const dx = pixelCoords.x - projectedPixel.x;
    const dy = pixelCoords.y - projectedPixel.y;

    return dx * dx + dy * dy < radius * radius;
  }

}
