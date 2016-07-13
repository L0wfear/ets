export default class SimpleAnimation {

  /**
   * TODO отключить анимации при window.hover
   */

  constructor(target, propertyName, toValue, interval) {
    this._target = target;
    this._propertyName = propertyName;
    this._fromValue = target[propertyName];
    this._currentValue = this._fromValue;
    this._toValue = toValue;
    this._progress = 0;
    this._interval = interval;
    this._speed = 1 / interval;
    this.ended = false;

    this._startTime = -1;
    this._currentTime = -1;
    this._valueSpan = this._toValue - this._fromValue;
  }

  update(newTime) {

    if (this.ended) {
      return;
    }

    if (this._currentTime < 0) {
      this._currentTime = newTime;
      this._startTime = newTime;
      return;
    }

    const oldTime = this._currentTime;
    this._currentTime = newTime;

    const speed = this._speed;
    const oldProgress = this._progress;
    const deltaTime = newTime - oldTime;
    let deltaProgress = speed * deltaTime;
    let newProgress = oldProgress + deltaProgress;

    if (newProgress >= 1.0) {
      newProgress = 1.0;
      this.ended = true;
    }

    this._progress = newProgress;
    deltaProgress = newProgress - oldProgress;

    this._currentValue += this._valueSpan * deltaProgress;
    this._target[this._propertyName] = this._currentValue;
  }
}
