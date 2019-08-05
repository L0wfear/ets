import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { ExtField } from 'components/old/ui/new/field/ExtField';

import { connect } from 'react-redux';
import {
  carInfoToggleForToday,
  fetchTrack,
  fetchCarInfo,
  carInfoChangeDate,
} from 'components/old/monitor/info/car-info/redux-main/modules/actions-car-info';
import DistanceAgg from 'components/old/monitor/info/car-info/car-tab-menu/car-track-information/title-track-tab/DistanceAgg';
import { initialState } from 'components/old/monitor/info/car-info/redux-main/modules/car-info';
import { diffDates } from 'components/@next/@utils/dates/dates';
import { ReduxState } from 'redux-main/@types/state';
import { isArray } from 'util';
// выпилить
import { CAR_INFO_SET_TRACK_CACHING } from 'components/old/monitor/info/car-info/redux-main/modules/car-info';
import { CarInfoBlockTabDataColumn } from 'components/old/monitor/styled';
import { CarInfoTrackDateTitle } from 'components/old/monitor/info/geoobjects-info/styled';
import { CarInfoToggleForToday } from './styled';
import { getSessionState } from 'redux-main/reducers/selectors';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';

type PropsTitleTrackTab = {
  forToday: boolean;
  carInfoToggleForToday: any;
  disabledForToday: boolean;
  date_start: Date;
  date_end: Date;
  changeDate: any;

  fetchMissionsData: any;
  fetchTrack: any;
  asuods_id: number;
  gps_code: string;

  track: any;
  status: string;
  loadingTrack: boolean;

  map_track_days: InitialStateSession['appConfig']['map_track_days'];
};

type StateTitleTrackTab = {
  errorDates: string;
  gps_code: string;
};

class TitleTrackTab extends React.Component<
  PropsTitleTrackTab,
  StateTitleTrackTab
> {
  state = {
    gps_code: this.props.gps_code,
    errorDates: '',
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { gps_code } = nextProps;

    if (prevState.gps_code !== gps_code) {
      return {
        errorDates: '',
        gps_code,
      };
    }

    return null;
  }

  carInfoToggleForToday: any = (e) => {
    const disbledByTrackPlayStatys = this.props.status !== 'stop';

    if (
      !(
        (this.props.loadingTrack && this.props.disabledForToday) ||
        disbledByTrackPlayStatys
      )
    ) {
      this.props.carInfoToggleForToday();
      if (!this.props.forToday) {
        const payload = {
          asuods_id: this.props.asuods_id,
          gps_code: this.props.gps_code,
          date_start: initialState.date_start,
          date_end: initialState.date_end,
        };

        this.props.fetchMissionsData(payload);
        this.props.fetchTrack(payload);

        this.setState({ errorDates: '' });
      }
    }
  };

  handleChangeDate = (field, value) => {
    if (value) {
      const dates = {
        ...this.props,
        [field]: value,
      };
      let errorDates = '';

      if (diffDates(dates.date_end, dates.date_start, 'minutes', false) <= 0) {
        errorDates = 'Дата начала должна быть раньше даты окончания';
      } else if (
        diffDates(dates.date_end, dates.date_start, 'days') > this.props.map_track_days
      ) {
        errorDates = `Период формирования трека не должен превышать ${this.props.map_track_days} суток`;
      } else {
        errorDates = '';
      }
      this.props.changeDate(field, value);
      if (errorDates !== this.state.errorDates) {
        this.setState({ errorDates });
      }
    }
  };

  reloadTrackAndMissions: any = () => {
    const payload = {
      asuods_id: this.props.asuods_id,
      gps_code: this.props.gps_code,
      date_start: this.props.date_start,
      date_end: this.props.date_end,
    };

    this.props.fetchMissionsData(payload);
    this.props.fetchTrack(payload);
  };

  render() {
    const { forToday } = this.props;
    const disbledByTrackPlayStatys = this.props.status !== 'stop';
    const { errorDates } = this.state;

    return (
      <CarInfoBlockTabDataColumn>
        <CarInfoTrackDateTitle>
          <div>Трекинг</div>
          <CarInfoToggleForToday
            isDisabled={
              disbledByTrackPlayStatys
              || (
                !this.props.loadingTrack
                && this.props.disabledForToday
              )
            }
            onClick={this.carInfoToggleForToday}
          >
            <input
              type="checkbox"
              checked={forToday}
              readOnly
              disabled={this.props.disabledForToday || disbledByTrackPlayStatys}
            />
            <span>За сегодня</span>
          </CarInfoToggleForToday>
        </CarInfoTrackDateTitle>
        <div className="car_info-track_date_control">
          <div className={'flex-line-unset'}>
            <ExtField
              type={'date'}
              time
              date={this.props.date_start}
              onChange={this.handleChangeDate}
              boundKeys="date_start"
              disabled={forToday || this.props.disabledForToday}
            />
            <span className="carinfo-divider">–</span>
            <ExtField
              type={'date'}
              time
              date={this.props.date_end}
              onChange={this.handleChangeDate}
              boundKeys="date_end"
              disabled={forToday || this.props.disabledForToday}
            />
            <EtsBootstrap.Button
              title="Перезагрузить данные"
              className="reload-button"
              onClick={this.reloadTrackAndMissions}
              disabled={
                forToday ||
                this.props.disabledForToday ||
                disbledByTrackPlayStatys ||
                !!errorDates
              }>
              <EtsBootstrap.Glyphicon glyph="repeat" />
            </EtsBootstrap.Button>
          </div>
          <div>
            <span className={'error'}>{errorDates}</span>
          </div>
          <DistanceAgg />
        </div>
      </CarInfoBlockTabDataColumn>
    );
  }
}

const mapStateToProps = (state) => ({
  map_track_days: getSessionState(state).appConfig.map_track_days,
  forToday: state.monitorPage.carInfo.forToday,
  date_start: state.monitorPage.carInfo.date_start,
  date_end: state.monitorPage.carInfo.date_end,
  odh_mkad: state.monitorPage.geoobjects.odh_mkad.data,
  gps_code: state.monitorPage.carInfo.gps_code,
  asuods_id: (
    state.monitorPage.carActualGpsNumberIndex[
      state.monitorPage.carInfo.gps_code
    ] || { asuods_id: null }
  ).asuods_id,
  track: state.monitorPage.carInfo.trackCaching.track,
  error: state.monitorPage.carInfo.trackCaching.error,
  status: state.monitorPage.carInfo.playTrack.status,
  loadingTrack: isArray(state.loading.loadingType)
    ? state.loading.loadingType.includes(CAR_INFO_SET_TRACK_CACHING)
    : false,
});

const mapDispatchToProps = (dispatch) => ({
  carInfoToggleForToday: () => dispatch(carInfoToggleForToday()),
  changeDate: (field, value) => dispatch(carInfoChangeDate(field, value)),
  fetchMissionsData: (props) => dispatch(fetchCarInfo(props)),
  dispatch,
});

const mergedProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  disabledForToday:
    (!stateProps.asuods_id || stateProps.track === -1) && !stateProps.error,
  fetchTrack: (props) =>
    dispatchProps.dispatch(fetchTrack(props, stateProps.odh_mkad)),
});

export default connect<any, any, any, ReduxState>(
  mapStateToProps,
  mapDispatchToProps,
  mergedProps,
)(TitleTrackTab);
