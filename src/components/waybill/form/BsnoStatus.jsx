import * as React from 'react';

import { FluxContext } from 'utils/decorators';
import Field from 'components/ui/Field.jsx';

import config from '../../../config';
import ReconnectingWebSocket from '../../../vendor/ReconnectingWebsocket.js';

@FluxContext
class BsnoStaus extends React.Component {

  static get propTypes() {
    return {
      okStatus: React.PropTypes.bool,
      car_id: React.PropTypes.number,
      is_bnso_broken: React.PropTypes.bool,
      handleChange: React.PropTypes.func,
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
      } catch (e) {
        global.NOTIFICATION_SYSTEM.notify('Ошибка подключения к потоку', 'error');
      }
      this.state = {
        carsTrackState: [],
        ws,
      };
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
      const { car_id = 0, is_bnso_broken: is_bnso_broken_old = '' } = this.props;

      if (car_id) {
        const { timestamp = 0 } = carsTrackState[car_id] || {};
        const is_bnso_broken = ((+(new Date()) / 1000) - timestamp) > 60 * 60;
        if (is_bnso_broken !== is_bnso_broken_old) {
          this.props.handleChange('is_bnso_broken', (((+(new Date()) / 1000) - timestamp) > 60 * 60));
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
    const error = is_bnso_broken_isBoolean && is_bnso_broken ? 'Выполненные работы не будут учтены в системе' : ''

    if (is_bnso_broken_isBoolean) {
      if (!is_bnso_broken) {
        value = 'Исправен';
      } else {
        value = 'Датчик ГЛОНАСС не исправен';
      }
    }

    return (
      <Field
        label="Исправность датчика ГЛОНАСС"
        value={value}
        error={error}
        disabled
      />
    )
  }
}

export default BsnoStaus;
