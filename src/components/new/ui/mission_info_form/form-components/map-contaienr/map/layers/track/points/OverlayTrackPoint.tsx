import * as React from 'react';
import Overlay from 'components/new/ui/map/overlay/Overlay';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { makeDate, makeTime } from 'utils/dates';
import PreloadNew from 'components/ui/new/preloader/PreloadNew';

import { getVectorObject } from 'redux-main/trash-actions/uniq';
import { get } from 'lodash';
import { roundCoordinates } from 'utils/geo';
import { getDateWithMoscowTzByTimestamp } from 'utils/dates';

import {
  OverlayInsideTrackContainer,
  EtsOverlayTrackContainer,
  OverlayTrackTitleContainer,
  SensorsListContainer,
  OverlayBoxInfoContainer,
} from 'components/new/ui/mission_info_form/form-components/map-contaienr/map/layers/track/points/styled/styled';

import { OverlayLineInfoContainer } from 'components/new/ui/map/overlay/styled/styled';

import { DivNone } from 'global-styled/global-styled';
import { OverlayLineObjectsStringContainer } from 'components/monitor/layers/track/points/styled/styled';

class OverlayTrackPoint extends React.Component<any, any> {
  state = {
    gps_code: this.props.gps_code,
    trackPoint: this.props.trackPoint,
    objectsString: '',
  };

  componentDidMount() {
    this.getObjectData(this.props);
  }

  componentDidUpdate(prevProps) {
    const { trackPoint } = this.props;
    if (prevProps.trackPoint !== trackPoint) {
      if (!this.state.trackPoint || trackPoint.timestamp !== this.state.trackPoint.timestamp) {
        this.getObjectData(this.props);
      }
    }
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
        objectsString,
      });
    });
  }

  render() {
    const { objectsString } = this.state;

    const {
      missionNumber,
      trackPoint: {
        coords_msk,
        timestamp,
        speed_avg,
        speed_max,
        distance,
        nsat,
      },
    } = this.props;

    const moscowDateTime = getDateWithMoscowTzByTimestamp(timestamp * 1000);

    const datetime = `${makeDate(moscowDateTime)} ${makeTime(moscowDateTime, true)}`;
    const pointSensors = get(this.state.trackPoint, ['sensors', 'equipment'], []).filter((s) => s.val !== 0);
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
        <OverlayLineObjectsStringContainer>
          {
            objectsString
              ? objectsString
              : <PreloadNew typePreloader="field" />
          }
        </OverlayLineObjectsStringContainer>
        <OverlayLineInfoContainer>
          <div>{`Задание №${missionNumber}`}</div>
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
              V<sub>ср</sub> = {speed_avg === 0 || speed_avg ? `${speed_avg} км/ч` : 'Нет данных'}
              <br/>
              V<sub>макс</sub> = {speed_max === 0 || speed_max ? `${speed_max} км/ч` : 'Нет данных'}
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

const mapDispatchToProps = (dispatch) => ({
  getVectorObject: (points) => (
    dispatch(
      getVectorObject('NONE', points),
    )
  ),
});

export default compose<any, any>(
  connect(
    null,
    mapDispatchToProps,
  ),
)(OverlayTrackPoint);
