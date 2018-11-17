import * as React from 'react';
import * as Button from 'react-bootstrap/lib/Button';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';
import { ExtField } from 'components/ui/new/field/ExtField';
import * as cx from 'classnames';

import { connect } from 'react-redux';
import { carInfoToggleForToday, fetchTrack, fetchCarInfo, carInfoChangeDate } from 'components/monitor/info/car-info/redux-main/modules/actions-car-info';
import DistanceAgg from 'components/monitor/info/car-info/car-tab-menu/car-track-information/title-track-tab/DistanceAgg';
import { initialState } from 'components/monitor/info/car-info/redux-main/modules/car-info';
import { diffDates } from 'utils/dates';
import { ReduxState } from 'redux-main/@types/state';

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
  gps_code: number;

  track: any;
  status: string;
};

type StateTitleTrackTab = {
  errorDates: string;
};

class TitleTrackTab extends React.Component<PropsTitleTrackTab, StateTitleTrackTab> {
  state = {
    errorDates: '',
  };

  carInfoToggleForToday: any = (e) => {
    if (!this.props.disabledForToday) {
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
      }
    }
  }

  handleChangeDate = (field, value) => {
    if (value) {
      const dates = {
        ...this.props,
        [field]: value,
      };
      let errorDates = '';

      if (diffDates(dates.date_end, dates.date_start, 'minutes', false) <= 0) {
        errorDates = 'Дата начала должна быть раньше даты окончания';
      } else if (diffDates(dates.date_end, dates.date_start, 'days') > 10) {
        errorDates = 'Период формирования трека не должен превышать 10 суток';
      } else {
        errorDates = '';
      }
      this.props.changeDate(field, value);
      if (errorDates !== this.state.errorDates) {
        this.setState({ errorDates });
      }
    }
  }

  reloadTrackAndMissions: any = () => {
    const payload = {
      asuods_id: this.props.asuods_id,
      gps_code: this.props.gps_code,
      date_start: this.props.date_start,
      date_end: this.props.date_end,
    };

    this.props.fetchMissionsData(payload);
    this.props.fetchTrack(payload);
  }

  render() {
    const { forToday, track } = this.props;
    const disbledByTrackPlayStatys = this.props.status !== 'stop';
    const { errorDates } = this.state;

    return (
      <div className="car_info_block column tab-data">
        <div className="car_info-track_date_title">
          <div>Трекинг</div>
          <div className={cx('car_info-toggle_for_today', { disabled: this.props.disabledForToday || disbledByTrackPlayStatys || !!errorDates })} onClick={this.carInfoToggleForToday}>
            <input type="checkbox" checked={forToday} readOnly disabled={this.props.disabledForToday || disbledByTrackPlayStatys} />
            <span>За сегодня</span>
          </div>
        </div>
        <div className="car_info-track_date_control">
          <div className={'flex-line-unset'}>
            <ExtField
              type={'date'}
              time
              date={this.props.date_start}
              onChange={this.handleChangeDate}
              boundKeys={['date_start']}
              disabled={forToday || track === -1}
            />
            <span className="carinfo-divider">–</span>
            <ExtField
              type={'date'}
              time
              date={this.props.date_end}
              onChange={this.handleChangeDate}
              boundKeys={['date_end']}
              disabled={forToday || track === -1}
            />
            <Button
              title="Перезагрузить данные"
              className="reload-button"
              onClick={this.reloadTrackAndMissions}
              disabled={forToday || track === -1 || disbledByTrackPlayStatys}
            >
              <Glyphicon glyph="repeat" />
            </Button>
          </div>
          <div>
            <span className={'error'}>{errorDates}</span>
          </div>
          <DistanceAgg />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  forToday: state.monitorPage.carInfo.forToday,
  date_start: state.monitorPage.carInfo.date_start,
  date_end: state.monitorPage.carInfo.date_end,
  odh_mkad: state.monitorPage.geoobjects.odh_mkad.data,
  gps_code: state.monitorPage.carInfo.gps_code,
  asuods_id: (state.monitorPage.carActualGpsNumberIndex[state.monitorPage.carInfo.gps_code] || { asuods_id: null}).asuods_id,
  track: state.monitorPage.carInfo.trackCaching.track,
  error: state.monitorPage.carInfo.trackCaching.error,
  status: state.monitorPage.carInfo.playTrack.status,
});

const mapDispatchToProps = (dispatch) => ({
  carInfoToggleForToday: () => dispatch(carInfoToggleForToday()),
  changeDate: (field, value) => dispatch(carInfoChangeDate(field, value)),
  fetchMissionsData: (props) => (
    dispatch(fetchCarInfo(props))
  ),
  dispatch,
});

const mergedProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  disabledForToday: ((!stateProps.asuods_id || stateProps.track === -1) && !stateProps.error) || stateProps.error,
  fetchTrack: (props) => (
    dispatchProps.dispatch(fetchTrack(props, stateProps.odh_mkad))
  ),
});

export default connect<any, any, any, ReduxState>(
  mapStateToProps,
  mapDispatchToProps,
  mergedProps,
)(TitleTrackTab);
