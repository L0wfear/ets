import * as React from 'react';
import { compose } from 'recompose';
import * as Raven from 'raven-js';
import { connect } from 'react-redux';

import withDefaultCard, { PropsToDefaultCard } from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard';

import CollapseButton from 'components/old/ui/collapse/button/CollapseButton';
import List from 'components/new/pages/dashboard/menu/cards/car-in-work-overall/list/List';

import {
  dashboardLoadCarInWorkOverall,
  dashboardSetInfoDataInCarInWorkOverall,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/actions-dashboard';

import CarInWorkOverallInfo from 'components/new/pages/dashboard/menu/cards/car-in-work-overall/info/CarInWorkOverallInfo';

import {
  getDashboardState,
  getSessionState,
} from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';
import * as ReconnectingWebSocket from 'reconnectingwebsocket';
import { actionMonitorPageLoadCarActual } from 'components/old/monitor/redux-main/models/actions-monitor-page';
import { InitialStateDashboard } from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/_dashboard.h';
import { InitialStateSession } from 'redux-main/reducers/modules/session/@types/session';
import { HandleThunkActionCreator } from 'react-redux';

type StateProps = {
  items: InitialStateDashboard['car_in_work_overall']['data']['items'];
  points_ws: InitialStateSession['appConfig']['points_ws'];
  token: InitialStateSession['token'];
  carActualGpsNumberIndex: any;
};
type DispatchProps = {
  setInfoData: HandleThunkActionCreator<typeof dashboardSetInfoDataInCarInWorkOverall>;
  actionMonitorPageLoadCarActual: HandleThunkActionCreator<typeof actionMonitorPageLoadCarActual>;
};
type OwnProps = {};

type Props = StateProps &
  DispatchProps &
  OwnProps;

type State = {
  ws: any;
  carsTrackState: any;
  countNotInTouch: number | {};
};

class CarInWorkOverall extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    const { points_ws } = props;
    let token = null;

    if (process.env.STAND === 'gost_stage' || process.env.STAND === 'ets_hotfix') {
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
          return count + 1;
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
        {
          Boolean(collapsetItems[0]) && (
            <CollapseButton>
              <List
                items={collapsetItems}
                handleClick={this.handleClickMission}
                addIndex={counttoFirstShow}
                classNameContainer="line_data"
              />
            </CollapseButton>
          )
        }
      </div>
    );
  }
}

export default compose<Props, PropsToDefaultCard>(
  withDefaultCard({
    path: 'car_in_work_overall',
    loadData: dashboardLoadCarInWorkOverall,
    InfoComponent: CarInWorkOverallInfo,
  }),
  connect<StateProps, DispatchProps, OwnProps, ReduxState>(
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
