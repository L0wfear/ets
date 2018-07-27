import * as React from 'react';
import { Glyphicon } from 'react-bootstrap';
import { FluxContext } from 'utils/decorators';
import config from 'components/../config';
import * as ReconnectingWebSocket from 'vendor/ReconnectingWebsocket';
import * as Raven from 'raven-js';

/* ETS2 */
const style: any = {
  fontSize: 18
};

@FluxContext
class NotificationBadge extends React.Component<any, any> {
  ws: any;
  componentDidMount() {
    this.openWs();
  }
  componentWillUnmount() {
    this.closeWs();
  }
  checkNotifications = () => {
  }

  openWs() {
    
    try {
      const token = this.context.flux.getStore('session').getSession();
      const wsUrl = `${config.notification_ws}?token=${token}`;
      this.ws = new ReconnectingWebSocket(wsUrl);

      this.ws.onopen = (event) => {
        console.log(`API SERVICE OPEN WS ${config.notification_ws}`);
      }

      this.ws.onmessage = ({ data }) => {
        this.context.flux.getActions('userNotifications').setNotifyFromWs(JSON.parse(data));
      };

      this.ws.onclose = (event) => {
        console.log(`API SERVICE CLOSE WS ${config.notification_ws}`);

        if (event.code === 1006) {
          Raven.captureException(new Error('1006: A connection was closed abnormally (that is, with no close frame being sent). A low level WebSocket error.'));
        }
        if (event.code === 1002) {
          Raven.captureException(new Error('1002: Ошибка авторизации'));
        }
      };
      this.ws.onerror = () => {
        // console.error('WEBSOCKET - Ошибка WebSocket');
      };
    } catch (e) {
      console.warn(e)
    }
  }

  closeWs() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  render() {
    return <div style={style}><Glyphicon glyph="exclamation-sign" /></div>;
  }
}

export default NotificationBadge;
