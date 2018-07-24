import { connect } from 'react-redux';
import * as moment from 'moment';
import { get, pick, toArray } from 'lodash';
import { roundCoordinates } from 'utils/geo';

import {
  CarInfoService,
  VectorObjectService,
} from 'api/Services';

import CanvasLayer from 'components/map/layers/base/CanvasLayer';
import TrackMarker from 'components/map/markersNew/TrackMarker';

import { getTrackByFilter } from 'redux/selectors/oneCarInfo';
import { getCarInfo, getCarData } from 'redux/selectors/carsPoints';

const COLORS_ZOOM_THRESHOLD = 6;

const getObjectByThreePoints = props =>
  VectorObjectService.get({
    coordinates: [props.prevPoint_coords_msk, props.selectedPoint_coords_msk, props.nextPoint_coords_msk],
  }).then(({ result: [one, two] }) => {
    if (one && two) {
      const { asuods_id: one_a_id, name: one_name = '' } = one;
      const { asuods_id: two_a_id, name: two_name = '' } = two;
      if (one_a_id && two_a_id) {
        if (one_a_id === two_a_id) {
          return one_name;
        }
        return `${one_name} / ${two_name}`;
      }
    }

    return '';
  });

const getCarMissionsByTimestamp = props => {
  const payload = {
    ...props,
  };
  if (!payload.car_id) {
    return Promise.resolve('Нет выполняемых заданий');
  }
  return CarInfoService.get(payload)
    .then(({ result: { mission = [] } }) => mission.map(m => `Задание №${m.number}`).join('<br/>') || 'Нет выполняемых заданий');
};

const getPointSensor = sensors => {
  return new Promise(res => {
    const pointSensors = get(sensors, ['equipment'], []).filter(s => s.val !== 0);
    let sensorsVisibility = 'none';
    let sensorsString = '';

    if (pointSensors.length) {
      sensorsVisibility = 'block';
      const sensorNames = toArray(pick(sensors, pointSensors.map(p => `${p.id}`)));
      sensorsString = `
        <div style="margin-bottom: 5px;">Работающие датчики навесного оборудования</div>
        ${sensorNames.map((p: any, i) => `<div style="margin-left: 10px;">Датчик №${i + 1} - ${p.type_name}</div>`).join('')}
      `;
    }

    res({
      sensorsVisibility,
      sensorsString,
    });
  });
};

export function containsCoordinate(extent, coordinates) {
  const x = coordinates[0];
  const y = coordinates[1];
  return (extent[0] <= x && x <= extent[2]) && (extent[1] <= y && y <= extent[3]);
}

@connect(
  state => ({
    track: getTrackByFilter(state),
    selectedCar: getCarInfo(state),
    carData: getCarData(state),
  }),
)
class MarkersLayer extends CanvasLayer {

  withState() {
    return {
      markers: [],
      optimizedMarkers: [],
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
    const { track } = props;

    const markers = track.map(point => new TrackMarker({
      point,
      canvas: this.state.canvas,
      projectToPixel: this.props.projectToPixel,
    }));

    this.setState({ markers });
  }

  checkSingleClick = coordinate => {
    const { optimizedMarkers } = this.state;
    const pointIndex = optimizedMarkers.findIndex(marker => marker.contain(coordinate));
    if (pointIndex !== -1) {
      this.showTrackPopup(pointIndex);
      return true;
    }
    return false;
  }

  /**
   * @todo вынести
   */
  showTrackPopup = async pointIndex => {
    const {
      selectedCar: { car: { gov_number } },
      carData: { asuods_id: car_id },
    } = this.props;

    const { optimizedMarkers } = this.state;
    const { timestamp, coords, sensors, speed_avg, nsat, distance } = optimizedMarkers[pointIndex];

    const speed = parseInt(speed_avg, 10);
    const nsatCount = parseInt(nsat, 10);
    const distanceCount = parseInt(distance, 10);
    const [latitude, longitude] = roundCoordinates(coords, 6);

    const querys = [
      getObjectByThreePoints({
        prevPoint_coords_msk: optimizedMarkers[pointIndex - 1 < 0 ? 0 : pointIndex - 1].coords.reverse(),
        selectedPoint_coords_msk: [...coords].reverse(),
        nextPoint_coords_msk: optimizedMarkers[pointIndex + 1 === pointIndex.length ? 0 : pointIndex].coords.reverse(),
      }),
      getCarMissionsByTimestamp({ car_id, point_timestamp: timestamp + 10800}),
      getPointSensor(sensors),
    ];

    const [
      objName,
      missions,
      sensorData,
    ] = await Promise.all(querys);

    const {
      sensorsVisibility,
      sensorsString,
    } = sensorData as any;

    this.showPopup({
      coords: [...coords].reverse(),
      html: `
      <div>
        <div class="header">
          <span class="gov-number">${gov_number}</span>
          <span class="dt">${moment(timestamp * 1000).format(`${global.APP_DATE_FORMAT} ${global.APP_TIME_FORMAT}`)}</span>
        </div>
        <div class="geo-objects">${objName}</div>
        <div class="geo-objects">${missions}</div>
        <div style="display: ${sensorsVisibility}" class="geo-objects">${sensorsString}</div>
        <div class="some-info">
          <div class="speed">V<sub>ср</sub> = ${!isNaN(speed) ? `${speed}км/ч` : 'Нет данных'}<br/>V<sub>макс</sub> = ${!isNaN(2) ? `${1}км/ч` : 'Нет данных'}</div>
          <div class="distance">${isNaN(distanceCount) ? 'Н/Д' : `${distanceCount}м`}</div>
          <div class="coords">${longitude}<br/>${latitude}</div>
          <div class="nsat">${isNaN(nsatCount) ? 0 : nsatCount} спутников</div>
        </div>
      </div>
    `,
    });
  }

  getMarkersInBounds(extent) {
    const { markers } = this.state;

    const optimizedMarkers = markers.reduce((newArr, trackPoint) => {
      // isVisible
      if (containsCoordinate(extent, [...trackPoint.coords].reverse())) {
        newArr.push(trackPoint);
      }

      return newArr;
    }, []);

    this.setState({ optimizedMarkers });

    return optimizedMarkers;
  }

  canvasFunction = (canvas, extent, pixelRatio) => {
    const { map, track } = this.props;

    const zoom = map.getView().getZoom();

    if (track.length < 2 || zoom <= COLORS_ZOOM_THRESHOLD) {
      this.hideAllPopup();
      return canvas;
    }

    const optimizedMarkers = this.getMarkersInBounds(extent);
    optimizedMarkers.forEach(marker => marker.render());

    return canvas;
  }
}

export default MarkersLayer;
