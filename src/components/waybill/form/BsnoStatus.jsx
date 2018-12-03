import * as React from 'react';
import * as PropTypes from 'prop-types';
import Raven from 'raven-js';
import { diffDates } from 'utils/dates';

import { FluxContext } from 'utils/decorators';
import Field from 'components/ui/Field';

import config from 'config';
import ReconnectingWebSocket from 'vendor/ReconnectingWebsocket';

@FluxContext
class BsnoStaus extends React.Component {
  static get propTypes() {
    return {
      okStatus: PropTypes.bool,
      gps_code: PropTypes.string,
      is_bnso_broken: PropTypes.bool,
      handleChange: PropTypes.func,
    };
  }

  constructor(props, context) {
    super(props);
    const {
      okStatus = false,
    } = props;
    if (okStatus) {
      const token = context.flux.getStore('session').getSession();
      const wsUrl = `${config.ws}?token=${token}`;
      const ws = new ReconnectingWebSocket(wsUrl, null);

      try {
        ws.onmessage = ({ data }) => {
          this.handleUpdatePoints(JSON.parse(data));
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
        ws,
      };
    } else {
      this.state = {
        carsTrackState: {},
        ws: null,
      };
    }
  }

  componentWillUnmount() {
    const { ws } = this.state;
    if (typeof ws !== 'undefined' && ws !== null) {
      ws.close();
      this.setState({ ws: null });
    }
  }

  handleUpdatePoints = (data) => {
    const carsTrackState = {
      ...this.state.carsTrackState,
      ...Object.values(data).reduce((newObj, value) => Object.assign(newObj, ({ [value.id]: value.timestamp })), {}),
    };

    const {
      okStatus = false,
    } = this.props;
    if (okStatus) {
      const { gps_code = 0, is_bnso_broken: is_bnso_broken_old = '' } = this.props;

      if (gps_code) {
        const timestamp = carsTrackState[gps_code] || 0;
        const is_bnso_broken = diffDates(new Date(), timestamp * 1000, 'hours') > 1;

        if (is_bnso_broken !== is_bnso_broken_old) {
          this.props.handleChange('is_bnso_broken', is_bnso_broken);
        }
      }
    }

    this.setState({ carsTrackState });
  }

  render() {
    const {
      is_bnso_broken,
    } = this.props;

    const is_bnso_broken_isBoolean = typeof is_bnso_broken === 'boolean';

    let value = '';
    const error = is_bnso_broken_isBoolean && is_bnso_broken ? 'Выполненные работы не будут учтены в системе' : '';

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

export default BsnoStaus;
