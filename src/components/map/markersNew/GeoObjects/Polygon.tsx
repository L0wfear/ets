import BaseCanvasPolygon from 'components/map/markersNew/canvas/BaseCanvasPolygon';

class GeoObjectPolygon extends BaseCanvasPolygon {
  constructor(props) {
    super({
      ...props,
      coords: props.coords,
    });
  }

  withState(props) {
    return {
      polygonData: props.polygonData,
      selected: props.selected,
    };
  }

  render(options) {
    const ctx = this.props.canvas.getContext('2d');
    const { coords, selected } = this.state;
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

    ctx.fillStyle = selected ? '#FFFF00' : '#FF0000';
    ctx.fill();
  }
}

export default GeoObjectPolygon;
