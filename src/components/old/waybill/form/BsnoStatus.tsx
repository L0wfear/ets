import * as React from 'react';
import * as Raven from 'raven-js';
import ReconnectingWebSocket from 'reconnectingwebsocket';
import { connect } from 'react-redux';

import {
  diffDates,
  getDateWithMoscowTzByTimestamp,
  getDateWithMoscowTz,
} from 'components/@next/@utils/dates/dates';

import Field from 'components/@next/@ui/renderFields/Field';

import { getSessionState } from 'redux-main/reducers/selectors';
import { actionLoadTimeMoscow } from 'redux-main/reducers/modules/some_uniq/time_moscow/actions';
import { EtsDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { InitialStateSession } from 'redux-main/reducers/modules/session/@types/session';
import { ReduxState } from 'redux-main/@types/state';

type StateProps = {
  token: InitialStateSession['token'];
  points_ws: InitialStateSession['appConfig']['points_ws'];
};
type DispatchProps = {
  dispatch: EtsDispatch;
};
type OwnProps = {
  okStatus: boolean;
  gps_code: string;
  is_bnso_broken: boolean;
  handleChange: (...arg: any) => any;

  page: string;
  path?: string;
};
type Props = (
  StateProps
  & DispatchProps
  & OwnProps
);

class BsnoStaus extends React.Component<Props, any> {
  constructor(props) {
    super(props);
    const { okStatus = false } = props;

    if (okStatus) {
      const { points_ws } = props;
      let token = null;

      if (
        process.env.STAND === 'gost_stage'
        || process.env.STAND === 'ets_hotfix'
      ) {
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
          this.handleUpdatePoints(JSON.parse(data));
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
        global.NOTIFICATION_SYSTEM.notify(
          'Ошибка подключения к потоку',
          'error',
        );
      }
      this.state = {
        carsTrackState: {},
        ws,
      };
    } else {
      this.state = {
        carsTrackState: {},
        ws: null,
        date: getDateWithMoscowTz(),
        itervalId: null,
      };
    }
  }

  componentDidMount() {
    this.props.dispatch(actionLoadTimeMoscow({}, this.props)).then((time) => {
      clearInterval(this.state.itervalId);

      this.setState({
        date: getDateWithMoscowTzByTimestamp(time.timestamp * 1000),
        itervalId: setInterval(() => this.updateDateOnSecond(), 1000),
      });
    });
  }

  componentWillUnmount() {
    const { ws } = this.state;
    if (typeof ws !== 'undefined' && ws !== null) {
      ws.close();
      this.setState({ ws: null });
    }
    clearInterval(this.state.itervalId);
  }

  updateDateOnSecond = () => {
    const { date } = this.state;

    date.setSeconds(date.getSeconds() + 1);

    this.setState(({ carsTrackState }) => {
      const { okStatus = false } = this.props;

      if (okStatus) {
        const {
          gps_code = 0,
          is_bnso_broken: is_bnso_broken_old = '',
        } = this.props;

        if (gps_code) {
          const timestamp = carsTrackState[gps_code] || 0;
          const is_bnso_broken = diffDates(date, timestamp * 1000, 'hours') > 1;

          if (is_bnso_broken !== is_bnso_broken_old) {
            this.props.handleChange('is_bnso_broken', is_bnso_broken);
          }
        }
      }

      return {
        date,
      };
    });
  };

  handleUpdatePoints = (data) => {
    const carsTrackState = {
      ...this.state.carsTrackState,
      ...Object.values(data).reduce(
        (newObj, value: { id: number; timestamp: number; }) =>
          Object.assign(newObj, { [value.id]: value.timestamp }),
        {},
      ),
    };

    const { okStatus = false } = this.props;
    if (okStatus) {
      const {
        gps_code = 0,
        is_bnso_broken: is_bnso_broken_old = '',
      } = this.props;

      if (gps_code) {
        const timestamp = carsTrackState[gps_code] || 0;
        const is_bnso_broken
          = diffDates(this.state.date, timestamp * 1000, 'hours') > 1;

        if (is_bnso_broken !== is_bnso_broken_old) {
          this.props.handleChange('is_bnso_broken', is_bnso_broken);
        }
      }
    }

    this.setState({ carsTrackState });
  };

  render() {
    const { is_bnso_broken } = this.props;

    const is_bnso_broken_isBoolean = typeof is_bnso_broken === 'boolean';

    let value = '';
    const error
      = is_bnso_broken_isBoolean && is_bnso_broken
        ? 'Выполненные работы не будут учтены в системе'
        : '';

    if (is_bnso_broken_isBoolean) {
      if (!is_bnso_broken) {
        value = 'Исправен';
      } else {
        value = 'Датчик ГЛОНАСС не исправен';
      }
    }

    return (
      <Field
        id="is_bnso_broken"
        type="string"
        label="Исправность датчика ГЛОНАСС"
        value={value}
        error={error}
        disabled
      />
    );
  }
}

export default connect<StateProps, DispatchProps, OwnProps, ReduxState>(
  (state) => ({
    token: getSessionState(state).token,
    points_ws: getSessionState(state).appConfig.points_ws,
  }),
)(BsnoStaus);
