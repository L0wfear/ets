import * as React from 'react';
import * as PropTypes from 'prop-types';
import Raven from 'raven-js';
import {
  diffDates,
  getDateWithMoscowTzByTimestamp,
  getDateWithMoscowTz,
} from 'utils/dates';

import Field from 'components/ui/Field';

import ReconnectingWebSocket from 'vendor/ReconnectingWebsocket';
import { connect } from 'react-redux';
import { getSessionState } from 'redux-main/reducers/selectors';
import { loadMoscowTime } from 'redux-main/trash-actions/uniq/promise';

class BsnoStaus extends React.Component {
  static get propTypes() {
    return {
      okStatus: PropTypes.bool,
      gps_code: PropTypes.string,
      is_bnso_broken: PropTypes.bool,
      handleChange: PropTypes.func,
    };
  }

  constructor(props) {
    super(props);
    const { okStatus = false } = props;

    if (okStatus) {
      const { points_ws } = props;
      let token = null;

      if (process.env.STAND === 'dev' || process.env.STAND === 'gost_stage') {
        token = JSON.parse(
          localStorage.getItem(global.SESSION_KEY_ETS_TEST_BY_DEV2),
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
          if (!__DEVELOPMENT__) {
            Raven.captureException(
              new Error(
                'Ошибка подключения к сокету (Исправность датчика ГЛОНАСС)',
              ),
            );
          }
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
        itervalId: setInterval(() => this.updateDateOnSecond(), 1000),
      };
    }
  }

  componentDidMount() {
    loadMoscowTime().then(({ time }) => {
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
        (newObj, value) =>
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

export default connect((state) => ({
  token: getSessionState(state).token,
  points_ws: getSessionState(state).appConfig.points_ws,
}))(BsnoStaus);
