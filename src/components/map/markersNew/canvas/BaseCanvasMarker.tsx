class BaseCanvasMarker {
  props: any;
  state: any;
  constructor(props) {
    this.props = props;

    this.state = {
      coords: props.coords,
      isSelected: false,
      _ZOOM_LARGE_ICONS: 8,
      radius: 7,
      ...this.withState(props),
    };
  }

  withState(props) {
    return null;
  }

  get coords() { return [...this.state.coords]; }

  setState(obj = null) {
    this.state = {
      ...this.state,
      ...obj,
    };
  }

  addDraw(options, ctx, trueCoords) {
    // additionalDraw
  }

  getZoomRatio() {
    const zoom = this.props.map.getView().getZoom();
    const coef = 8 - (this.state._ZOOM_LARGE_ICONS - zoom);
    return coef > 0 ? coef * 0.4 : 1;
  }

  contain = coordinates => {
    const {
      coords,
      radius,
    } = this.state;

    const projectedPixel = this.props.projectToPixel(coordinates);
    const pixelCoords = this.props.projectToPixel(coords);

    const dx = pixelCoords.x - projectedPixel.x;
    const dy = pixelCoords.y - projectedPixel.y;

    return dx * dx + dy * dy < radius * radius;
  }

  render(options) {
    const {
      coords,
    } = this.state;

    const canvas = this.props.canvas;
    const ctx = canvas.getContext('2d');

    const trueCoords = this.props.projectToPixel(coords);

    ctx.beginPath();
    this.addDraw(options, ctx, trueCoords);
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(trueCoords.x, trueCoords.y, this.state.radius, 0, 2 * Math.PI);

    ctx.fillStyle = '#FF0000';
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000000';
    ctx.stroke();
    ctx.closePath();
  }
}

export default BaseCanvasMarker;
