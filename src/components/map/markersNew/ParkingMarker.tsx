import BaseCanvasMarker from 'components/map/markersNew/canvas/BaseCanvasMarker';
import { swapCoords } from 'utils/geo';
const ParkingIconSVG = require('assets/icons/track/parking.svg') as string;

class ParkingMarker extends BaseCanvasMarker {
  constructor(props) {
    super({
      ...props,
      coords: swapCoords(props.point.start_point.coords_msk),
    });
  }

  withState(props) {
    const parkingIcon = new Image();
    parkingIcon.src = ParkingIconSVG;

    return {
      parkingIcon,
      point: props.point,
    }
  }

  get start_timestamp() { return this.state.point.start_point.timestamp * 1000; }
  get end_timestamp() { return this.state.point.end_point.timestamp * 1000; }

  contain = coordinates => {
    const {
      coords,
      point: {
        needShiftIcon,
      },
    } = this.state;

    const iconSizeHalf = 20 * window.devicePixelRatio / 2;
    const shift = needShiftIcon ? iconSizeHalf : 0;

    const projectedPixel = this.props.projectToPixel(coordinates);
    const pixelCoords = this.props.projectToPixel([...coords].reverse());

    const dx = pixelCoords.x - projectedPixel.x - shift;
    const dy = pixelCoords.y - projectedPixel.y;
    return (
      (Math.abs(dx) <= iconSizeHalf)
      &&
      (Math.abs(dy) <= iconSizeHalf)
    );
  }

  render() {
    const {
      point: {
        needShiftIcon,
        start_point: { coords_msk } },
    } = this.props;

    const ctx = this.props.canvas.getContext('2d');

    const iconSize = 20 * window.devicePixelRatio;

    ctx.beginPath();

    const shift = needShiftIcon ? iconSize / 2 : 0;

    const coords = this.props.projectToPixel(coords_msk);

    ctx.drawImage(this.state.parkingIcon,
      coords.x - (iconSize / 2) - shift,
      coords.y - (iconSize / 2),
      iconSize,
      iconSize,
    );
    ctx.stroke();

  }
}

export default ParkingMarker;
