class RenderLoop {

  constructor(stats) {
    this._stats = stats;
    this._callbacks = [];
    this._handle = null;
    this.render = this.render.bind(this);
  }

  add(callback, context) {
    this._callbacks.push([callback, context]);
    return this;
  }

  remove(callback) {
    throw new Error('not implemented');
  }

  render(time) {

    let stats = this._stats;
    let callbacks = this._callbacks;

    stats.begin();
    for (let i = 0; i < callbacks.length; i++) {
      let callback = callbacks[i];
      let fn = callback[0];
      let context = callback[1];
      fn.call(context, time);
    }
    stats.end();

    this._handle = window.requestAnimationFrame(this.render);
  }

  start() {
    if (this._handle !== null) {
      throw new Error('already started');
    }

    this._handle = window.requestAnimationFrame(this.render);
  }

  stop() {
    throw new Error('not implemented');
  }

}

export default RenderLoop;
