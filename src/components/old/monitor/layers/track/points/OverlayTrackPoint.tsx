import * as React from 'react';
import Overlay from 'components/new/ui/map/overlay/Overlay';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import withShowByProps from 'components/old/compositions/vokinda-hoc/show-by-props/withShowByProps';
import { carInfoSetTrackPoint } from 'components/old/monitor/info/car-info/redux-main/modules/actions-car-info';
import { makeDate, makeTime } from 'components/@next/@utils/dates/dates';
import PreloadNew from 'components/old/ui/new/preloader/PreloadNew';

import { get } from 'lodash';
import { roundCoordinates } from 'utils/geo';
import { getDateWithMoscowTzByTimestamp } from 'components/@next/@utils/dates/dates';

import {
  OverlayInsideTrackContainer,
  EtsOverlayTrackContainer,
  OverlayTrackTitleContainer,
  SensorsListContainer,
  OverlayBoxInfoContainer,
  OverlayLineObjectsStringContainer,
} from 'components/old/monitor/layers/track/points/styled/styled';

import {
  OverlayLineInfoContainer,
} from 'components/new/ui/map/overlay/styled/styled';

import {
  DivNone,
} from 'global-styled/global-styled';
import LoadingContext from 'components/new/utils/context/loading/LoadingContext';
import { actionGetVectorObject } from 'redux-main/reducers/modules/some_uniq/vector_object/actions';
import { ReduxState } from 'redux-main/@types/state';
import { EtsDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { actionGetCarMissionsByTimestamp } from 'redux-main/reducers/modules/autobase/car/actions';

type Props = {
  dispatch: EtsDispatch;
  [k: string]: any;
};

class OverlayTrackPoint extends React.Component<Props, any> {
  static contextType = LoadingContext;

  state = {
    gps_code: this.props.gps_code,
    trackPoint: this.props.trackPoint,
  };

  componentDidMount() {
    if (this.state.trackPoint) {
      this.getOtherDataOnTrackPoint(this.props);
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { trackPoint } = nextProps;
    if (trackPoint) {
      if (!prevState.trackPoint || trackPoint.timestamp !== prevState.trackPoint.timestamp) {
        return { trackPoint };
      }
    } else {
      return { trackPoint };
    }

    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    const { trackPoint } = this.props;
    if (trackPoint) {
      if (!prevState.trackPoint || trackPoint.timestamp !== prevState.trackPoint.timestamp) {
        this.getOtherDataOnTrackPoint(this.props);
        this.getOtherDataOnTrackPoint(this.props);
      }
    }
  }

  getOtherDataOnTrackPoint = (props) => {
    this.getObjectData(props);
    this.getMissionsData(props);
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
      trackPoint: {
        ...this.state.trackPoint,
        objectsString,
      },
    });
  }

  getMissionsData = (props) => {
    const { asuods_id } = props;
    this.props.dispatch(
      actionGetCarMissionsByTimestamp(
        {
          car_id: asuods_id,
          point_timestamp: props.trackPoint.timestamp * 1000,
        },
        {
          page: 'mainpage',
        },
      ),
    ).then((result) => {
        this.setState({
          trackPoint: {
            ...this.state.trackPoint,
            missions: result.missions,
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
      );
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
            missions === undefined ?
            (
              <PreloadNew typePreloader="field" />
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
  withShowByProps({
    path: ['monitorPage', 'carActualGpsNumberIndex'],
    type: 'none',
  }),
  connect(
    (state: ReduxState) => ({
      gps_code: state.monitorPage.carInfo.gps_code,
      gov_number: state.monitorPage.carActualGpsNumberIndex[state.monitorPage.carInfo.gps_code].gov_number,
      asuods_id: state.monitorPage.carActualGpsNumberIndex[state.monitorPage.carInfo.gps_code].asuods_id,
      trackPoint: state.monitorPage.carInfo.popups.trackPoint,
      track: state.monitorPage.carInfo.trackCaching.track,
      cars_sensors: state.monitorPage.carInfo.trackCaching.cars_sensors,
    }),
    (dispatch) => ({
      dispatch,
      hidePopup: () => (
        dispatch(
          carInfoSetTrackPoint(),
        )
      ),
    }),
  ),
)(OverlayTrackPoint);
