import BaseCanvasMarker from 'components/map/markersNew/canvas/BaseCanvasMarker';
import { swapCoords } from 'utils/geo';
import { getStatusById } from 'constants/statuses';
import { getSmallIcon, getBigIcon } from 'assets/icons/car.js';
import {
  SMALL_ICON_RADIUS,
  LARGE_ICON_RADIUS,
} from 'constants/CarIcons.js';

const DEVICE_PIXEL_RATIO = window.devicePixelRatio;

const PI_TIMES_TWO = Math.PI * 2;
function normalizeAngle(angle) {
  while (angle < 0) {
    angle += PI_TIMES_TWO;
  }
  while (angle > PI_TIMES_TWO) {
    angle -= PI_TIMES_TWO;
  }

  return angle;
}
const emptyObj = {};

const checkByStatus = (filtres, status, selected) => {
  if (selected) {
    return true;
  }

  switch (status) {
    case 1: return filtres.showInMove;
    case 2: return filtres.showInHalfStop;
    case 3: return filtres.showInStop;
    case 4: return filtres.showInNotConnected;
    default: return false;
  }
};

class CarMarker extends BaseCanvasMarker {
  constructor(props) {
    super({
      ...props,
      coords: swapCoords(props.point.coords_msk),
    });
  }
  withState(props) {
    return {
      point: props.point,
      showGovNumber: props.showGovNumber,
    };
  }

  get selected() {
    return this.state.point.selected;
  }

  get gps_code() {
    return this.state.point.car.gps_code;
  }

  contain = coordinates => {
    const { filtres, point: { status, selected } } = this.state;

    if (checkByStatus(filtres, status, selected)) {
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

    return false;
  }

  update({ point }) {
    this.setState({
      point,
      coords: swapCoords(point.coords_msk),
    });
  }

  addDraw(options, ctx, trueCoords, direction = 0) {
    const { showGovNumber } = options;
    const { point: { car: { gov_number = '' } = {} } } = this.state;

    if ((showGovNumber) && gov_number) {
      const message = (`${gov_number || ''}`).toUpperCase();
      const lengthMessage = (10 + message.length * 9);

      ctx.beginPath();
      if (direction < 180 && direction > 0) {
        ctx.rect(trueCoords.x - lengthMessage, trueCoords.y - 20, lengthMessage, 20);
      } else {
        ctx.rect(trueCoords.x, trueCoords.y - 20, lengthMessage, 20);
      }

      ctx.fillStyle = '#FFFFFF';
      ctx.fill();

      ctx.lineWidth = 2;
      ctx.strokeStyle = '#000000';
      ctx.stroke();

      ctx.font = '13px Comic Sans MS';
      ctx.fillStyle = 'black';

      if (direction < 180 && direction > 0) {
        ctx.fillText(message, trueCoords.x + 10 - lengthMessage, trueCoords.y - 6);
      } else {
        ctx.fillText(message, trueCoords.x + 15, trueCoords.y - 6);
      }
      ctx.closePath();
    }
  }
  getImage(options) {
    const { point: { selected } } = this.state;

    const { map } = this.props;
    const zoom = map.getView().getZoom();
    return !selected && (zoom < this.state._ZOOM_LARGE_ICONS) ? this.renderSmall(options) : this.renderLarge(options);
  }

  renderSmall(options) {
    const {
      coords,
    } = this.state;
    const { point: { status } } = this.state;
    const zoomRatio = this.getZoomRatio();
    const radius = SMALL_ICON_RADIUS * zoomRatio * DEVICE_PIXEL_RATIO;

    const canvas = this.props.canvas;
    const ctx = canvas.getContext('2d');

    const trueCoords = this.props.projectToPixel(coords);

    ctx.beginPath();
    this.addDraw(options, ctx, trueCoords);
    ctx.closePath();

    this.setState({ radius });
    return getSmallIcon(status, zoomRatio);
  }

  renderLarge(options) {
    const {
      coords,
      point: {
        direction,
        car: { type_id = 5 } = {},
        selected,
      },
      typesIndex = {},
    } = this.state;
    const { icon } = typesIndex[type_id] || emptyObj;

    const ctx = this.props.canvas.getContext('2d');

    const trueCoords = this.props.projectToPixel(coords);
    const radius = (LARGE_ICON_RADIUS + (!selected ? 6 : 10));
    const tipAngle = normalizeAngle((Math.PI * direction) / 180 - (Math.PI / 2));

    this.addDraw(options, ctx, trueCoords, direction);

    ctx.fillStyle = getStatusById(this.state.point.status).color;
    ctx.lineWidth = !selected ? 2 : 4;
    ctx.strokeStyle = !selected ? '#000000' : '#FFFFFF';

    ctx.beginPath();
    ctx.save();
    ctx.translate(trueCoords.x, trueCoords.y);
    ctx.rotate(tipAngle);

    ctx.arc(0, 0, radius, Math.PI / 4, -Math.PI / 4);
    ctx.lineTo(Math.sqrt(2) * radius, 0);

    ctx.restore();
    ctx.closePath();

    ctx.fill();
    ctx.stroke();

    this.setState({ radius });
    return getBigIcon(icon);
  }

  render(options) {
    const { filtres } = options;
    const { point: { status, selected } } = this.state;
    const { canvas } = this.props;
    const { coords } = this.state;

    if (checkByStatus(filtres, status, selected)) {
      const image = this.getImage(options);
      const radius = image.width / 2;
      const ctx = canvas.getContext('2d');
      const trueCoords = this.props.projectToPixel(coords);

      if (typeof ctx === 'undefined') {
        return;
      }

      ctx.drawImage(image, trueCoords.x - radius, trueCoords.y - radius, radius * 2, radius * 2);
    }

    this.setState(options);
  }
}

export default CarMarker;
