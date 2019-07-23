import * as React from 'react';
import { compose } from 'recompose';
import * as Raven from 'raven-js';

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
import { DivNone } from 'global-styled/global-styled';
import {
  getDashboardState,
  getSessionState,
} from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';
import { PropsToDefaultCard } from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard.h';
import * as ReconnectingWebSocket from 'vendor/ReconnectingWebsocket';
import { actionMonitorPageLoadCarActual } from 'components/monitor/redux-main/models/actions-monitor-page';

class CarInWorkOverall extends React.Component<
  PropsCarInWorkOverall,
  StateCarInWorkOverall
> {
  constructor(props) {
    super(props);

    const { points_ws } = props;
    let token = null;

    if (process.env.STAND === 'gost_stage') {
      token = JSON.parse(
        localStorage.getItem(global.SESSION_KEY_ETS_TEST_BY_DEV),
      );
    } else {
      token = this.props.token;
    }

    const wsUrl = `${points_ws}?token=${token}`;

    const ws = new ReconnectingWebSocket(wsUrl, null);

    try {
      ws.onmessage = ({ data }) => {
        this.handleUpdateTs(JSON.parse(data));
      };
      ws.onclose = (event) => {
        if (event.code === 1006) {
          Raven.captureException(
            new Error(
              '1006: A connection was closed abnormally (that is, with no close frame being sent). A low level WebSocket error.',
            ),
          );
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
    this.props.actionMonitorPageLoadCarActual();
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
    const { carActualGpsNumberIndex } = this.props;

    const countNotInTouch = Object.values(carsTrackState).reduce(
      (count: number, value: any) => {
        if (value.status === 4 && carActualGpsNumberIndex[value.id]) {
          count++;
        }
        return count;
      },
      0,
    );

    this.setState({
      carsTrackState,
      countNotInTouch,
    });
  };

  handleClickMission: React.MouseEventHandler<HTMLLIElement> = ({
    currentTarget: {
      dataset: { path },
    },
  }) => {
    const index = Number.parseInt((path as string).split('/').slice(-1)[0], 0);
    this.props.setInfoData(this.props.items[index]);
  };

  render() {
    const { items } = this.props;
    const { countNotInTouch } = this.state;

    const customItem = {
      title: `ТС, не передающие сигнал: ${countNotInTouch}`,
      tooltip:
        'Общее количество ТС организации, не передающие данные с БНСО (более 1 часа)',
    };

    const itemsCopy = [...items];
    itemsCopy.splice(2, 1, customItem);
    const counttoFirstShow = 2;
    const firstTwoItem = itemsCopy.slice(0, counttoFirstShow);
    const collapsetItems = itemsCopy.slice(counttoFirstShow);

    return (
      <div>
        <List
          items={firstTwoItem}
          handleClick={this.handleClickMission}
          classNameContainer="line_data"
          addIndex={0}
        />
        {collapsetItems.length ? (
          <CollapseButton>
            <List
              items={collapsetItems}
              handleClick={this.handleClickMission}
              addIndex={counttoFirstShow}
              classNameContainer="line_data"
            />
          </CollapseButton>
        ) : (
          <DivNone />
        )}
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
  connect<
    StatePropsCarInOveral,
    DispatchPropsCarInOveral,
    OwnPropsCarInOveral,
    ReduxState
  >(
    (state) => ({
      items: getDashboardState(state).car_in_work_overall.data.items,
      token: getSessionState(state).token,
      points_ws: getSessionState(state).appConfig.points_ws,
      carActualGpsNumberIndex: state.monitorPage.carActualGpsNumberIndex,
    }),
    (dispatch: any) => ({
      setInfoData: (infoData) => (
        dispatch(
          dashboardSetInfoDataInCarInWorkOverall(infoData),
        )
      ),
      actionMonitorPageLoadCarActual: (...arg) => (
        dispatch(
          actionMonitorPageLoadCarActual(...arg),
        )
      ),
    }),
  ),
)(CarInWorkOverall);
