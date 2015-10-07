/**
 * Базовый интерфейс маркера карты
 */

import {projectToPixel} from '../map/MskAdapter.js';

export default class Marker {
	constructor(point, map, store, context) {
		this.point = point;

		// some methods may be useful
		this.map = map;
		this.image = null;
		this.store = store;
		this.radius = 0;
		this.ctx = context;
		this.coords = {
			x: 0,
			y: 0
		}

		this.animation = null;
	}

	onClick() { /** onClick **/}

	renderImage() {}

	render() {
		let image = this.renderImage();
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
	 * @param  x
	 * @param  y
	 * @return {[type]}
	 */
	contains([x, y]) {

    let coords = this.coords;
    let radius = this.radius;

    var dx = coords.x - x;
    var dy = coords.y - y;

    return dx * dx + dy * dy < radius * radius;
	}

}
