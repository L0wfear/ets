import BaseCanvasMarker from 'components/map/markersNew/canvas/BaseCanvasMarker';
import { swapCoords } from 'utils/geo';
import { TRACK_POINT_RADIUS, TRACK_COLOR_LINE_WIDTH } from 'constants/track.js';
import { getTrackPointByColor } from 'assets/icons/track/points.js';

class TrackMarker extends BaseCanvasMarker {
  constructor(props) {
    super({
      ...props,
      coords: swapCoords(props.point.coords_msk),
    });
  }

  withState(props) {
    return {
      point: props.point,
    }
  }

  get timestamp() { return this.state.point.timestamp; }
  get coords_msk() { return this.state.point.coords_msk; }
  get sensors() { return { ...this.state.point.sensors }; }
  get speed_avg() { return this.state.point.speed_avg; }
  get nsat() { return this.state.point.nsat; }
  get distance() { return this.state.point.distance; }

  contain = coordinates => {
    const {
      coords,
    } = this.state;

    const projectedPixel = this.props.projectToPixel(coordinates);
    const pixelCoords = this.props.projectToPixel([...coords].reverse());

    const dx = pixelCoords.x - projectedPixel.x;
    const dy = pixelCoords.y - projectedPixel.y;

    return dx * dx + dy * dy < TRACK_POINT_RADIUS * TRACK_POINT_RADIUS;
  }

  render() {
    const { point } = this.state;

    const ctx = this.props.canvas.getContext('2d');
    ctx.lineCap = 'butt';
    ctx.lineJoin = 'round';
    ctx.lineWidth = TRACK_COLOR_LINE_WIDTH;
    ctx.beginPath();

    const coords = this.props.projectToPixel(point.coords_msk);

    ctx.strokeStyle = point.color;
    const cachedPoint = getTrackPointByColor(point.color);
    ctx.drawImage(
      cachedPoint,
      coords.x - TRACK_POINT_RADIUS - 1,
      coords.y - TRACK_POINT_RADIUS - 1,
      (TRACK_POINT_RADIUS + 1) * 2,
      (TRACK_POINT_RADIUS + 1) * 2);
    ctx.stroke();
  }
}

export default TrackMarker;
