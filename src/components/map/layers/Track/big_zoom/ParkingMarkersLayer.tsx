import { connect } from 'react-redux';
import * as moment from 'moment';

import CanvasLayer from 'components/map/layers/base/CanvasLayer';
import ParkingMarker from 'components/map/markersNew/ParkingMarker';
import { secondsToTime } from 'utils/dates';
import { getTrackParkingsByFilter } from 'redux/selectors/oneCarInfo';

const COLORS_ZOOM_THRESHOLD = 6;

export function containsCoordinate(extent, coordinates) {
  const x = coordinates[0];
  const y = coordinates[1];
  return (extent[0] <= x && x <= extent[2]) && (extent[1] <= y && y <= extent[3]);
}

@connect(
  state => ({
    parkings: getTrackParkingsByFilter(state),
  }),
)
class ParkingMarkersLayer extends CanvasLayer {

  withState() {
    return {
      markers: [],
    };
  }

  componentDidMount() {
    this.addLayer();
    this.addPopup();
  }

  inheritComponentWillReceiveProps(props) {
    this.updateMarkers(props);
    this.triggerRender();
    this.hideAllPopup();
  }

  updateMarkers(props) {
    const { parkings } = props;

    const markers = parkings.map(point => new ParkingMarker({
      point,
      canvas: this.state.canvas,
      projectToPixel: this.props.projectToPixel,
    }));

    this.setState({ markers });
  }

  checkSingleClick = coordinate => {
    const { optimizedMarkers = [] } = this.state;
    const findParking = optimizedMarkers.find(p => p.contain(coordinate));

    if (findParking) {
      this.showParkingPopup(findParking);
      return true;
    }

    return false;
  }

  showParkingPopup(parking) {
    const {
      start_timestamp,
      end_timestamp,
      coords,
    } = parking;

    const start = moment(start_timestamp).format(`${global.APP_DATE_FORMAT} HH:mm`);
    const end = moment(end_timestamp).format(`${global.APP_DATE_FORMAT} HH:mm`);
    const diff = secondsToTime((end_timestamp - start_timestamp) / 1000);

    this.showPopup({
      coords: [...coords].reverse(),
      html: `
      <div style="font-weight: normal;">
        <div class="header" style="padding-left: 10px;">
          Зона стоянки:
        </div>
        <div style="padding:10px;">
          <div><b>Начало:</b> ${start}</div>
          <div><b>Конец:</b> ${end}</div>
          <div><b>Время стоянки:</b> ${diff}</div>
        </div>
      </div>
    `,
    });
  }

  getMarkersInBounds(extent) {
    const { markers } = this.state;

    const optimizedMarkers = markers.reduce((newArr, parkingPoint) => {
      // isVisible
      if (containsCoordinate(extent, [...parkingPoint.coords].reverse())) {
        newArr.push(parkingPoint);
      }

      return newArr;
    }, []);

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

    const optimizedMarkers = this.getMarkersInBounds(extent);
    optimizedMarkers.forEach(marker => marker.render());

    return canvas;
  }
}

export default ParkingMarkersLayer;
