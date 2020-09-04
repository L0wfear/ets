import * as React from 'react';
import { get } from 'lodash';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import { makeDate, makeTime } from 'components/@next/@utils/dates/dates';
import PreloadNew from 'components/old/ui/new/preloader/PreloadNew';
import Overlay from 'components/new/ui/map/overlay/Overlay';

import { roundCoordinates } from 'utils/geo';
import { getDateWithMoscowTzByTimestamp } from 'components/@next/@utils/dates/dates';

import {
  OverlayInsideTrackContainer,
  EtsOverlayTrackContainer,
  OverlayTrackTitleContainer,
  SensorsListContainer,
  OverlayBoxInfoContainer,
} from 'components/new/ui/mission_info_form/form-components/map-contaienr/map/layers/track/points/styled/styled';

import { OverlayLineInfoContainer } from 'components/new/ui/map/overlay/styled/styled';

import { DivNone } from 'global-styled/global-styled';
import { OverlayLineObjectsStringContainer } from 'components/old/monitor/layers/track/points/styled/styled';
import { EtsDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { actionGetVectorObject } from 'redux-main/reducers/modules/some_uniq/vector_object/actions';
import { actionGetCarMissionsAndWaybillsByTimestamp } from 'redux-main/reducers/modules/autobase/car/actions';

type Props = {
  dispatch: EtsDispatch;
  [k: string]: any;
};

class OverlayTrackPoint extends React.Component<Props, any> {
  state = {
    gps_code: this.props.gps_code,
    trackPoint: this.props.trackPoint,
    objectsString: '',
    missions: null,
  };

  componentDidMount() {
    this.getObjectData(this.props);
  }

  componentDidUpdate(prevProps) {
    const { trackPoint } = this.props;
    if (this.state.missions === null || prevProps.trackPoint !== trackPoint) {
      this.props.dispatch(
        actionGetCarMissionsAndWaybillsByTimestamp(
          {
            car_id: this.props.car_id,
            point_timestamp: this.props.trackPoint.timestamp * 1000,
          },
          {
            page: 'cars_travel_time',
          },
        ),
      ).then((result) => {
        this.setState({
          missions: result.missions,
        });
      });
    }
    if (prevProps.trackPoint !== trackPoint) {
      if (!this.state.trackPoint || trackPoint.timestamp !== this.state.trackPoint.timestamp) {
        this.getObjectData(this.props);
      }
    }
  }

  getObjectData = async (props) => {
    const { track, trackPoint } = props;
    const index = track.findIndex(({ timestamp }) => timestamp === trackPoint.timestamp);
    const points = track.slice(index - 1, index + 2);

    const vectorObject = await this.props.dispatch(actionGetVectorObject(
      {
        coordinates: points.map(({ coords_msk }) => coords_msk),
      },
      {
        page: 'mainpage',
      },
    ));
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
  };

  render() {
    const { objectsString } = this.state;

    const {
      trackPoint: {
        coords_msk,
        timestamp,
        speed_avg,
        speed_max,
        distance,
        nsat,
      },
    } = this.props;
    const { missions } = this.state;
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
          {
            missions === null
              ? (
                <PreloadNew typePreloader="field" />
              )
              :            (
                missions.length === 0
                  ? (
                    <div>Нет выполняемых заданий</div>
                  )
                  :              (
                    missions.map(({ number }) => (
                      <div key={number}>{`Задание №${number}`}</div>
                    ))
                  )
              )
          }
        </OverlayLineInfoContainer>
        {
          !pointSensors.length
            ? ( <DivNone /> )
            :          (
              <OverlayLineInfoContainer>
                <div>Работающие датчики навесного оборудования</div>
                <SensorsListContainer>
                  {
                    pointSensors.filter(({ id }) => !!id).map((sensor, index) => {
                      const carSensorTypeName = this.props.cars_sensors[sensor.id]?.type_name;
                      return <div key={sensor.id}>{`Датчик №${index + 1} ${carSensorTypeName ? `- ${carSensorTypeName}` : ''}`}</div>;
                    })
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

export default compose<any, any>(
  connect(
    null,
    (dispatch) => ({
      dispatch,
    }),
  ),
)(OverlayTrackPoint);
