class BaseCanvasLine {
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

  get coords() { return this.state.coords; }

  setState(obj = null) {
    this.state = {
      ...this.state,
      ...obj,
    };
  }

  update({ polygon }) {
    this.setState({
      polygon,
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
    const { coords } = this.state;

    ctx.beginPath();

    coords.forEach(oneLine => {
      oneLine.forEach((point, i) => {
        const coordsPoint = this.props.projectToPixel(point);
        if (i === 0) {
          ctx.moveTo(coordsPoint.x, coordsPoint.y);
        } else {
          ctx.lineTo(coordsPoint.x, coordsPoint.y);
        }
      });
    });

    ctx.fillStyle = '#FF0000';
    ctx.fill();
  }
}

export default BaseCanvasLine;
