import * as React from 'react';
import Overlay from 'components/map/new/overlay/Overlay';
import hocAll from 'components/compositions/vokinda-hoc/recompose';
import { connect } from 'react-redux';
import withShowByProps from 'components/compositions/vokinda-hoc/show-by-props/withShowByProps';
import { carInfoSetTrackPoint } from 'components/monitor/new/info/car-info/redux-main/modules/actions-car-info';
import { makeDate, makeTime } from 'utils/dates';
import Preloader from 'components/ui/Preloader';
import { getVectorObject } from 'redux-main/trash-actions/uniq';
import { getCarMissionsByTimestamp } from 'redux-main/trash-actions/car';
import { get } from 'lodash';
import { roundCoordinates } from 'utils/geo';
import { getDateWithMoscowTzByTimestamp } from 'utils/dates';

import {
  OverlayInsideTrackContainer,
  EtsOverlayTrackContainer,
  OverlayTrackTitleContainer,
  SensorsListContainer,
  OverlayBoxInfoContainer,
} from 'components/missions/mission/MissionInfoForm/new/map/layers/track/points/styled/styled';

import {
  OverlayLineInfoContainer,
} from 'components/map/new/overlay/styled/styled';

import {
  DivNone,
} from 'global-styled/global-styled';

class OverlayTrackPoint extends React.Component<any, any> {
  state = { 
    gps_code: this.props.gps_code,
    trackPoint: this.props.trackPoint,
  }

  componentDidMount() {
    if (this.state.trackPoint) {
      this.getOtherDataOnTrackPoint(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { trackPoint } = nextProps;
    if (trackPoint) {
      if (!this.state.trackPoint || trackPoint.timestamp !== this.state.trackPoint.timestamp) {
        this.getOtherDataOnTrackPoint(nextProps);
        this.getOtherDataOnTrackPoint(nextProps);
        this.setState({ trackPoint });
      }
    } else {
      this.setState({ trackPoint });
    }
  }

  getOtherDataOnTrackPoint = (props) => {
    this.getObjectData(props);
    this.getMissionsData(props);
  }
  getObjectData = (props) => {
    const { track, trackPoint } = props;
    const index = track.findIndex(({ timestamp }) => timestamp === trackPoint.timestamp);
    const points = track.slice(index - 1, index + 2);

    this.props.getVectorObject(points).then(({ payload: { vectorObject } }) => {
      let objectsString = 'Объекты ОДХ не найдены';
      if (vectorObject && vectorObject[0] && vectorObject[1]) {
        if (vectorObject[0].asuods_id && vectorObject[1].asuods_id) {
          if (vectorObject[0].asuods_id === vectorObject[1].asuods_id) {
            objectsString = vectorObject[0].name ? vectorObject[0].name : '';
          } else {
            objectsString = `${vectorObject[0].name} / ${vectorObject[1].name}`;
          }
        }
      }

      this.setState({
        trackPoint: {
          ...this.state.trackPoint,
          objectsString,
        },
      });
    });
  }

  getMissionsData = (props) => {
    const { asuods_id } = props;

    this.props.getCarMissionsByTimestamp(asuods_id, props.trackPoint.timestamp * 1000)
      .then(({ payload: { missionsByTimestamp: missions } }) => {
        this.setState({
          trackPoint: {
            ...this.state.trackPoint,
            missions,
          },
        });
      });
  }

  render() {
    const { trackPoint } = this.state;

    if (!trackPoint) {
      return (
        <Overlay
          title={''}
          map={this.props.map}
          hidePopup={this.props.hidePopup}
        />
      )
    }

    const {
      coords_msk,
      timestamp,
      objectsString = '',
      missions,
      speed_avg,
      speed_max,
      distance,
      nsat,
    } = trackPoint;
    const moscowDateTime = getDateWithMoscowTzByTimestamp(timestamp * 1000);

    const datetime = `${makeDate(moscowDateTime)} ${makeTime(moscowDateTime, true)}`;
    const pointSensors = get(this.state.trackPoint, ['sensors', 'equipment'], []).filter(s => s.val !== 0);
    const distanceCount = parseInt(distance, 10);
    const nsatCount = parseInt(nsat, 10);
    const [latitude, longitude] = roundCoordinates(coords_msk, 6);

    const Title = (
      <OverlayTrackTitleContainer>
        <span>{this.props.gov_number}</span>
        <span>{datetime}</span>
      </OverlayTrackTitleContainer>
    );

    return (
      <Overlay
        OverlayInside={OverlayInsideTrackContainer}
        EtsOverlay={EtsOverlayTrackContainer}
        title={Title}
        map={this.props.map}
        coordsMsk={coords_msk}
        hidePopup={this.props.hidePopup}
      >
        <OverlayLineInfoContainer>{objectsString ? objectsString : <Preloader type="field" />}</OverlayLineInfoContainer>
        <OverlayLineInfoContainer>
          {
            missions === undefined ?
            (
              <Preloader type="field" />
            )
            :
            (
              missions.length === 0 ?
              (
                <div>Нет выполняемых заданий</div>
              )
              :
              (
                missions.map(({ number }) => (
                  <div key={number}>{`Задание №${number}`}</div>
                ))
              )
            )
          }
        </OverlayLineInfoContainer>
        {
          !pointSensors.length ?
          ( <DivNone /> )
          :
          (
            <OverlayLineInfoContainer>
              <div>Работающие датчики навесного оборудования</div>
              <SensorsListContainer>
                {
                  pointSensors.filter(({ id }) => !!id).map((sensor, index) => (
                    <div key={sensor.id}>{`Датчик №${index + 1} - ${this.props.cars_sensors[sensor.id].type_name}`}</div>
                  ))
                }
              </SensorsListContainer>
            </OverlayLineInfoContainer>
          )
        }
        <OverlayBoxInfoContainer>
          <OverlayLineInfoContainer>
            <span>
              V<sub>ср</sub> = {!isNaN(speed_avg) ? `${speed_avg}км/ч` : 'Нет данных'}
              <br/>
              V<sub>макс</sub> = {!isNaN(speed_max) ? `${speed_max}км/ч` : 'Нет данных'}
            </span>
          </OverlayLineInfoContainer>
          <OverlayLineInfoContainer>
            <span>
              {isNaN(distanceCount) ? 'Н/Д' : `${distanceCount}м`}
            </span>
          </OverlayLineInfoContainer>
          <OverlayLineInfoContainer>
            <span>
              {longitude}
              <br/>
              {latitude}
            </span>
          </OverlayLineInfoContainer>
          <OverlayLineInfoContainer>
            <span>
              {isNaN(nsatCount) ? 0 : nsatCount} спутников
            </span>
          </OverlayLineInfoContainer>
        </OverlayBoxInfoContainer>
      </Overlay>
    );
  }
}

const mapStateToProps = state => ({
  gps_code: state.monitorPage.carInfo.gps_code,
  gov_number: state.monitorPage.carActualGpsNumberIndex[state.monitorPage.carInfo.gps_code].gov_number,
  asuods_id: state.monitorPage.carActualGpsNumberIndex[state.monitorPage.carInfo.gps_code].asuods_id,
  trackPoint: state.monitorPage.carInfo.popups.trackPoint,
  track: state.monitorPage.carInfo.trackCaching.track,
  cars_sensors: state.monitorPage.carInfo.trackCaching.cars_sensors,
});

const mapDispatchToProps = dispatch => ({
  hidePopup: () => (
    dispatch(
      carInfoSetTrackPoint()
    )
  ),
  getVectorObject: (points) => (
    dispatch(
      getVectorObject('NONE', points),
    )
  ),
  getCarMissionsByTimestamp: (asuods_id, timestamp) => (
    dispatch(
      getCarMissionsByTimestamp('NONE', asuods_id, timestamp),
    )
  ),
});

export default hocAll(
  withShowByProps({
    path: ['monitorPage', 'carActualGpsNumberIndex'],
    type: 'none',
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )
)(OverlayTrackPoint);

