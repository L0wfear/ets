import * as React from 'react';

import withDefaultCard from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard';
import { connect } from 'react-redux';

import CollapseButton from 'components/ui/collapse/button/CollapseButton';
import List from 'components/new/pages/dashboard/menu/cards/car-in-work-overall/list/List';

import {
  dashboardLoadCarInWorkOverall,
  dashboardSetInfoDataInCarInWorkOverall,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/actions-dashboard';

import CarInWorkOverallInfo from 'components/new/pages/dashboard/menu/cards/car-in-work-overall/info/CarInWorkOverallInfo';

import {
  PropsCarInWorkOverall,
  StateCarInWorkOverall,
  StatePropsCarInOveral,
  DispatchPropsCarInOveral,
  OwnPropsCarInOveral,
} from 'components/new/pages/dashboard/menu/cards/car-in-work-overall/CarInWorkOverall.h';
import {
  DivNone,
} from 'global-styled/global-styled';
import { compose } from 'recompose';
import { getDashboardState } from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';
import { PropsToDefaultCard } from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard.h';
import * as ReconnectingWebSocket from 'vendor/ReconnectingWebsocket';
import * as Raven from 'raven-js';
import config from 'config';
import { getSessionState } from 'redux-main/reducers/selectors';

import { loadCarActualIndex } from 'redux-main/trash-actions/car';
import {
  MONITOR_PAGE_SET_CAR_ACTUAL_INDEX,
} from 'components/monitor/redux-main/models/monitor-page';

class CarInWorkOverall extends React.Component<PropsCarInWorkOverall, StateCarInWorkOverall> {

  constructor(props, context) {
    super(props);
    const {
      userToken,
    } = this.props;

    const wsUrl = `${config.ws}?token=${userToken}`;
    const ws = new ReconnectingWebSocket(wsUrl, null);

    try {
      ws.onmessage = ({ data }) => {
        this.handleUpdateTs(JSON.parse(data));
      };
      ws.onclose = (event) => {
        if (event.code === 1006) {
          Raven.captureException(new Error('1006: A connection was closed abnormally (that is, with no close frame being sent). A low level WebSocket error.'));
        }
        // console.warn('WEBSOCKET - Потеряно соединение с WebSocket, пытаемся переподключиться');
      };
      ws.onerror = () => {
        // console.error('WEBSOCKET - Ошибка WebSocket');
      };
    } catch (e) {
      global.NOTIFICATION_SYSTEM.notify('Ошибка подключения к потоку', 'error');
    }
    this.state = {
      carsTrackState: {},
      countNotInTouch: 0,
      ws,
    };
  }

  componentDidMount() {
    this.props.loadCarActualIndex();
  }

  componentWillUnmount() {
    const { ws } = this.state;
    if (typeof ws !== 'undefined' && ws !== null) {
      ws.close();
      this.setState({ ws: null });
    }
  }

  handleUpdateTs = (data) => {

    const carsTrackState = {
      ...this.state.carsTrackState,
      ...data,
    };
    const {
      carActualGpsNumberIndex,
    } = this.props;

    const countNotInTouch = Object.values(carsTrackState).reduce((count: number, value: any) => {
      if (value.status === 4 && carActualGpsNumberIndex[value.id]) {
        count++;
      }
      return count;
    }, 0);

    this.setState({
      carsTrackState,
      countNotInTouch,
    });
  }

  handleClickMission: React.MouseEventHandler<HTMLLIElement> = ({ currentTarget: { dataset: { path } } }) => {
    const index = Number.parseInt((path as string).split('/').slice(-1)[0], 0);
    this.props.setInfoData(this.props.items[index]);
  }

  render() {
    const {
      items,
    } = this.props;
    const {
      countNotInTouch,
    } = this.state;

    const customItem = {
      title: `ТС, не передающие сигнал: ${countNotInTouch}`,
      tooltip: 'Общее количество ТС организации, не передающие данные с БНСО (более 1 часа)',
    };

    items.splice(2, 1, customItem);
    const counttoFirstShow = 2;
    const firstTwoItem = items.slice(0, counttoFirstShow);
    const collapsetItems = items.slice(counttoFirstShow);
    return (
      <div>
        <List
          items={firstTwoItem}
          handleClick={this.handleClickMission}
          classNameContainer="line_data"
          addIndex={0}
        />
        {
          collapsetItems.length ?
          (
            <CollapseButton >
              <List
                items={collapsetItems}
                handleClick={this.handleClickMission}
                addIndex={counttoFirstShow}
                classNameContainer="line_data"
              />
            </CollapseButton>
          )
          :
          (
            <DivNone />
          )
        }
      </div>
    );
  }
}

export default compose<PropsCarInWorkOverall, PropsToDefaultCard>(
  withDefaultCard({
    path: 'car_in_work_overall',
    loadData: dashboardLoadCarInWorkOverall,
    InfoComponent: CarInWorkOverallInfo,
  }),
  connect<StatePropsCarInOveral, DispatchPropsCarInOveral, OwnPropsCarInOveral, ReduxState>(
    (state) => ({
      items: getDashboardState(state).car_in_work_overall.data.items,
      userToken: getSessionState(state).token,
      carActualGpsNumberIndex: state.monitorPage.carActualGpsNumberIndex,
    }),
    (dispatch) => ({
      setInfoData: (infoData) => (
        dispatch(
          dashboardSetInfoDataInCarInWorkOverall(infoData),
        )
      ),
      loadCarActualIndex: () => (
        dispatch(
          loadCarActualIndex(MONITOR_PAGE_SET_CAR_ACTUAL_INDEX),
        )
      ),
    }),
  ),
)(CarInWorkOverall);
