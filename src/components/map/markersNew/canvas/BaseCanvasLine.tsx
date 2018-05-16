class BaseCanvasLine {
  props: any;
  state: any;
  constructor(props) {
    this.props = props;

    this.state = {
      line: props.line,
      isSelected: false,
      _ZOOM_LARGE_ICONS: 8,
      radius: 7,
      ...this.withState(props),
    };
  }

  withState(props) {
    return null;
  }

  get lineData() { return this.state.line; }

  setState(obj = null) {
    this.state = {
      ...this.state,
      ...obj,
    };
  }

  update({ line }) {
    this.setState({
      line,
    });
  }

  addDraw(ctx, trueCoords) {
    // additionalDraw
  }

  getZoomRatio() {
    const zoom = this.props.map.getView().getZoom();
    const coef = 8 - (this.state._ZOOM_LARGE_ICONS - zoom);
    return coef > 0 ? coef * 0.4 : 1;
  }

  render(options) {
    const ctx = this.props.canvas.getContext('2d');
    const { line: { pointOne, pointTwo } } = this.state;

    ctx.strokeStyle = '#FF0000';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';

    ctx.beginPath();

    const coordsOne = this.props.projectToPixel(pointOne.coords_msk);
    const coordsTwo = this.props.projectToPixel(pointTwo.coords_msk);

    ctx.moveTo(coordsOne.x, coordsOne.y);
    ctx.lineTo(coordsTwo.x, coordsTwo.y);

    ctx.stroke();
  }
}

export default BaseCanvasLine;
