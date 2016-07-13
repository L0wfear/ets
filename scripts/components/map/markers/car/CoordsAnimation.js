import SimpleAnimation from './SimpleAnimation.js';

export default class CoordsAnimation {

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
