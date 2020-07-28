import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import ExtField from 'components/@next/@ui/renderFields/Field';

import { connect } from 'react-redux';
import {
  carInfoToggleForToday,
  fetchTrack,
  fetchCarInfo,
  carInfoChangeDate,
} from 'components/old/monitor/info/car-info/redux-main/modules/actions-car-info';
import DistanceAgg from 'components/old/monitor/info/car-info/car-tab-menu/car-track-information/title-track-tab/DistanceAgg';
import { getTrackDefaultDateEnd, getTrackDefaultDateStart } from 'components/old/monitor/info/car-info/redux-main/modules/car-info';
import { diffDates, createValidDateTime, minusTime, addTime, getStartOfServerToday } from 'components/@next/@utils/dates/dates';
import { ReduxState } from 'redux-main/@types/state';
import { isArray } from 'util';
// выпилить
import { CAR_INFO_SET_TRACK_CACHING } from 'components/old/monitor/info/car-info/redux-main/modules/car-info';
import { CarInfoBlockTabDataColumn } from 'components/old/monitor/styled';
import { CarInfoTrackDateTitle } from 'components/old/monitor/info/geoobjects-info/styled';
import { CarInfoToggleForToday } from './styled';
import { getSessionState } from 'redux-main/reducers/selectors';
import { InitialStateSession } from 'redux-main/reducers/modules/session/@types/session';
import { compose } from 'recompose';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import ErrorsBlock from 'components/@next/@ui/renderFields/ErrorsBlock/ErrorsBlock';
import { ButtonsRowMargin } from 'components/old/monitor/info/car-info/car-tab-menu/styled';
import { actionLoadTimeMoscow } from 'redux-main/reducers/modules/some_uniq/time_moscow/actions';

type PropsTitleTrackTab = {
  forToday: boolean;
  carInfoToggleForToday: any;
  disabledForToday: boolean;
  changeDate: any;

  actionLoadTimeMoscow: any;
  fetchMissionsData: any;
  fetchTrack: any;
  asuods_id: number;
  gps_code: string;

  track: any;
  status: string;
  loadingTrack: boolean;

  map_track_days: InitialStateSession['appConfig']['map_track_days'];
} & WithSearchProps;

type StateTitleTrackTab = {
  errorDates: string;
  gps_code: string;

  date_start: string;
  date_end: string;
};
const daysIntoPeriod = 10;

class TitleTrackTab extends React.Component<
  PropsTitleTrackTab,
  StateTitleTrackTab
> {
  state = {
    gps_code: this.props.gps_code,
    errorDates: '',
    date_start: this.props.searchState.date_start,
    date_end: this.props.searchState.date_end,
  };

  componentDidUpdate(nextProps: PropsTitleTrackTab, prevState: StateTitleTrackTab) {
    const { gps_code } = nextProps;

    if (this.props.gps_code !== prevState.gps_code) {
      return {
        errorDates: '',
        gps_code,
        date_start: createValidDateTime(getTrackDefaultDateStart()),
        date_end: createValidDateTime(getTrackDefaultDateEnd()),
      };
    }
  }

  componentDidMount () {
    const datesIsMove = (
      diffDates(this.props.searchState.date_start, this.state.date_start)
      || diffDates(this.props.searchState.date_end, this.state.date_end)
    );
    if(datesIsMove) {
      const partialState = {
        date_start: createValidDateTime(this.props.searchState.date_start),
        date_end: createValidDateTime(this.props.searchState.date_end),
        errorDates: '',
      };
      this.props.setDataInSearch({
        date_start: createValidDateTime(partialState.date_start),
        date_end: createValidDateTime(partialState.date_end),
      });

      this.setState({ ...partialState });
    }
  }

  updateMoscowTime = () => {
    this.props.actionLoadTimeMoscow().then((time) => {
      const partialState = {
        date_start: createValidDateTime(getStartOfServerToday(time.date)),
        date_end: createValidDateTime(time.date),
      };

      this.setState({ ...partialState });
    });
  };

  carInfoToggleForToday: any = (e) => {
    const disbledByTrackPlayStatys = this.props.status !== 'stop';

    if (
      !(
        (this.props.loadingTrack && this.props.disabledForToday)
        || disbledByTrackPlayStatys
      )
    ) {
      const datesIsMove = (
        diffDates(this.props.searchState.date_start, this.state.date_start)
        || diffDates(this.props.searchState.date_end, this.state.date_end)
      );
      this.props.carInfoToggleForToday();
      this.updateMoscowTime();
      if (datesIsMove && !this.props.forToday) {
        const partialState = {
          date_start: createValidDateTime(this.state.date_start),
          date_end: createValidDateTime(this.state.date_end),
          errorDates: '',
        };
        this.props.setDataInSearch({
          date_start: createValidDateTime(partialState.date_start),
          date_end: createValidDateTime(partialState.date_end),
        });

        this.setState({ ...partialState });
      }
    }
  };

  validateDates = (date_start, date_end) => {
    let errorDates = '';
    if (diffDates(date_end, date_start, 'minutes', false) <= 0) {
      errorDates = 'Дата начала должна быть раньше даты окончания';
    } else if (
      diffDates(date_end, date_start, 'days')
      > (process.env.STAND === 'prod' ? 10 : 30)
    ) {
      errorDates = `Период формирования трека не должен превышать ${
        process.env.STAND === 'prod' ? 10 : 30
      } суток`;
    } else {
      errorDates = '';
    }

    return errorDates;
  };

  handleChangeDate = (field: 'date_start' | 'date_end', value: any) => {
    if (value) {
      const date_start = this.state.date_start;
      const date_end = this.state.date_end;

      const partialState = {
        date_start,
        date_end,
        [field]: createValidDateTime(value),
        errorDates: '',
        gps_code: this.props.gps_code,
      };

      partialState.errorDates = this.validateDates(partialState.date_start, partialState.date_end);

      // this.props.changeDate(field, value);
      this.setState({ ...partialState });
    }
  };

  handleChangeDateStartEnd = (date_start, date_end) => {
    if (date_start && date_end) {
      this.setState({ date_start, date_end });
      const errorDates = this.validateDates(date_start, date_end);
      if (errorDates !== this.state.errorDates) {
        this.setState({ errorDates });
      }
    }
  };

  refreshTrackAndMissions = () => {
    const refresh = true;
    this.reloadTrackAndMissions(refresh);
  };

  reloadTrackAndMissions = (refresh: boolean = false) => {
    this.props.setDataInSearch({
      date_start: createValidDateTime(this.state.date_start),
      date_end: createValidDateTime(this.state.date_end),
      refresh: refresh ? 1 : null,
    });
  };

  makeNewPeriodBackward = () => {
    let newDateStart = this.state.date_start;
    let newDateEnd = this.state.date_end;

    newDateStart = minusTime(this.state.date_start, 10, 'days');
    newDateEnd = this.state.date_start;
    this.handleChangeDateStartEnd(newDateStart, newDateEnd);
    setTimeout(() => {
      if (!(this.props.forToday
        || this.props.disabledForToday
        || this.props.status !== 'stop'
        || !!this.state.errorDates)) {
        this.reloadTrackAndMissions();
      }
    }, 0);
  };

  makeNewPeriodForward = () => {
    let newDateStart = this.state.date_start;
    let newDateEnd = this.state.date_end;

    newDateStart = addTime(this.state.date_start, 10, 'days');
    newDateEnd = addTime(this.state.date_start, 20, 'days');

    this.handleChangeDateStartEnd(newDateStart, newDateEnd);
    setTimeout(() => {
      if (!(this.props.forToday
        || this.props.disabledForToday
        || this.props.status !== 'stop'
        || !!this.state.errorDates)) {
        this.reloadTrackAndMissions();
      }
    }, 0);
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
          <ButtonsRowMargin>
            <EtsBootstrap.Button
              title="Перезагрузить данные"
              className="reload-button"
              onClick={this.reloadTrackAndMissions}
              disabled={
                forToday
                  || this.props.disabledForToday
                  || disbledByTrackPlayStatys
                  || !!errorDates
              }>
              <EtsBootstrap.Glyphicon glyph="repeat" />
            </EtsBootstrap.Button>
            <EtsBootstrap.Button
              title={`Сдвинуть период трека на ${daysIntoPeriod} дней назад`}
              className="backward-button"
              onClick={this.makeNewPeriodBackward}
              disabled={forToday
                  || this.props.disabledForToday
                  || disbledByTrackPlayStatys
                  || !!errorDates}>
              <EtsBootstrap.Glyphicon glyph="backward" />
            </EtsBootstrap.Button>
            <EtsBootstrap.Button
              title={`Сдвинуть период трека на ${daysIntoPeriod} дней вперёд`}
              className="forward-button"
              onClick={this.makeNewPeriodForward}
              disabled={forToday
                  || this.props.disabledForToday
                  || disbledByTrackPlayStatys
                  || !!errorDates}>
              <EtsBootstrap.Glyphicon glyph="forward" />
            </EtsBootstrap.Button>
          </ButtonsRowMargin>
          <div className={'flex-line-unset'}>
            <ExtField
              type={'date'}
              time
              date={this.state.date_start}
              onChange={this.handleChangeDate}
              boundKeys="date_start"
              disabled={forToday || this.props.disabledForToday}
            />
            <span className="carinfo-divider">–</span>
            <ExtField
              type={'date'}
              time
              date={this.state.date_end}
              onChange={this.handleChangeDate}
              boundKeys="date_end"
              disabled={forToday || this.props.disabledForToday}
            />
          </div>
          <ErrorsBlock
            showError
            hidden={!errorDates}
            error={errorDates}
          />
          <DistanceAgg />
        </div>
      </CarInfoBlockTabDataColumn>
    );
  }
}

const mapStateToProps = (state) => ({
  map_track_days: getSessionState(state).appConfig.map_track_days,
  forToday: state.monitorPage.carInfo.forToday,
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
  actionLoadTimeMoscow: () => dispatch(actionLoadTimeMoscow({}, { page: 'mainpage' })),
  carInfoToggleForToday: () => dispatch(carInfoToggleForToday()),
  changeDate: (field, value) => dispatch(carInfoChangeDate(field, value)),
  fetchMissionsData: (props) => dispatch(fetchCarInfo(props, { page: 'mainpage' })),
  dispatch,
});

const mergedProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  disabledForToday:
    (!stateProps.asuods_id || stateProps.track === -1) && !stateProps.error,
  fetchTrack: (props) =>
    dispatchProps.dispatch(fetchTrack(props, stateProps.odh_mkad)),
});

export default compose(
  withSearch,
  connect<any, any, any, ReduxState>(
    mapStateToProps,
    mapDispatchToProps,
    mergedProps,
  ),
)(TitleTrackTab);
