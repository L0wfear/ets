import { connect } from 'react-redux';
import * as moment from 'moment';

import CanvasLayer from 'components/map/layers/base/CanvasLayer';
import FuelEventMarker from 'components/map/markersNew/FuelEventMarker';
import { secondsToTime } from 'utils/dates';
import { getTrackFuelEventsByFilter } from 'redux/selectors/oneCarInfo';

const COLORS_ZOOM_THRESHOLD = 6;
export function containsCoordinate(extent, coordinates) {
  const x = coordinates[0];
  const y = coordinates[1];
  return (extent[0] <= x && x <= extent[2]) && (extent[1] <= y && y <= extent[3]);
}

@connect(
  state => ({
    events: getTrackFuelEventsByFilter(state),
  }),
)
class TrackLayerSZ extends CanvasLayer {

  withState() {
    return {
      markers: {},
    };
  }

  componentDidMount() {
    this.addLayer();
    this.addPopup();
  }

  inheritComponentWillReceiveProps(props) {
    this.updateMarkers(props);
    this.hideAllPopup();
    this.triggerRender();
  }

  updateMarkers(props) {
    const { events } = props;
    const eventsAsMap = Object.entries(events);

    const markers = eventsAsMap.reduce((newObj, [key, sensorEvents]) => {
      if (!newObj[key]) {
        newObj[key] = [];
      }

      newObj[key] = sensorEvents.map(point => new FuelEventMarker({
        point,
        canvas: this.state.canvas,
        projectToPixel: this.props.projectToPixel,
      }));

      return newObj;
    }, {});

    this.setState({ markers });
  }

  checkSingleClick = coordinate => {
    const { optimizedMarkers = [] } = this.state;
    const findEvent = Object.values(optimizedMarkers).reduce((selectedEvent, events) => events.find(p => p.contain(coordinate)), false);

    if (findEvent) {
      this.showFuelEventPopup(findEvent);
      return true;
    }

    return false;
  }

  showFuelEventPopup(fuelEvent) {
    const {
      coords,
      type,
      value,
      start_timestamp,
      end_timestamp,
      id = '',
    } = fuelEvent;

    const typeText = type === 'leak' ? 'Слив топлива' : 'Заправка топлива'
    const start = `${moment(start_timestamp).format(`${global.APP_DATE_FORMAT} HH:mm`)} ${moment(end_timestamp).format(`${global.APP_DATE_FORMAT} HH:mm`)}`;
    const diff = secondsToTime((end_timestamp - start_timestamp) / 1000);

    this.showPopup({
      coords: [...coords].reverse(),
      html: `
      <div style="font-weight: normal;">
        <div class="header" style="padding-left: 10px;">
          ${typeText}:
        </div>
        <div style="padding:10px;">
          <div><b>Датчик:</b> ${id}</div>
          <div><b>Кол-во:</b> ${Math.abs(value)} л</div>
          <div><b>Дата и время:</b> ${start}</div>
          <div><b>Потраченное время:</b> ${diff}</div>
        </div>
      </div>
    `,
    });
  }

  getMarkersInBounds(extent) {
    const { markers } = this.state;

    const optimizedMarkers = Object.entries(markers).reduce((newObj, [key, sensorEventsMarkers]) => {
      if (!newObj[key]) {
        newObj[key] = [];
      }

      newObj[key] = sensorEventsMarkers.reduce((newArr, fuelEventPoint) => {
        // isVisible
        if (containsCoordinate(extent, [...fuelEventPoint.coords].reverse())) {
          newArr.push(fuelEventPoint);
        }

        return newArr;
      }, []);

      return newObj;
    }, {});

    this.setState({ optimizedMarkers });

    return optimizedMarkers;
  }

  canvasFunction = (canvas, extent, pixelRatio) => {
    const { map } = this.props;
    const zoom = map.getView().getZoom();

    if (zoom <= COLORS_ZOOM_THRESHOLD) {
      this.hideAllPopup();
      return canvas;
    }

    const optimizedMarkers: object = this.getMarkersInBounds(extent);
    Object.values(optimizedMarkers).forEach(markers => markers.forEach(marker => marker.render()));

    return canvas;
  }
}

export default TrackLayerSZ;
