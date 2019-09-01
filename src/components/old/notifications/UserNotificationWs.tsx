import * as React from 'react';
import config from 'config';
import * as ReconnectingWebSocket from 'vendor/ReconnectingWebsocket';
import * as Raven from 'raven-js';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  getOrderNotRead,
  getAdmNotReadNotifications,
  setNotifyFromWs,
} from 'redux-main/reducers/modules/user_notifications/actions-user_notifications';

import {
  StateUserNotificationWs,
  StatePropsUserNotificationWs,
  DispatchPropsUserNotificationWs,
  OwnPropsUserNotificationWs,
  PropsUserNotificationWs,
} from 'components/old/notifications/@types/UserNotificationWs.h';

/* ETS2 */
class NotificationBadge extends React.Component<PropsUserNotificationWs, StateUserNotificationWs> {
  state = {
    getNotReadInterval: 0,
  };

  ws: any;
  componentDidMount() {
    if (this.props.token) {
      this.openWs();
    }
    /*
    this.getNotifications();
    this.setState({
      getNotReadInterval: setInterval(() => this.getNotifications(), 30 * 1000),
    })
    */
  }
  componentDidUpdate() {
    if (this.props.token && !this.ws) {
      this.openWs();
    }
  }
  componentWillUnmount() {
    this.closeWs();
    // this.closeIntervalNotifications();
  }

  getNotifications = () => {
    this.props.getOrderNotRead();
    this.props.getAdmNotReadNotifications();
  }

  closeIntervalNotifications() {
    clearInterval(this.state.getNotReadInterval);
  }

  openWs() {
    try {
      const wsUrl = `${config.notification_ws}?token=${this.props.token}`;
      this.ws = new ReconnectingWebSocket(wsUrl, null, {
        reconnectInterval: 30 * 1000,
      });

      this.ws.onopen = (event) => {
        // tslint:disable-next-line
        console.log(`API SERVICE OPEN WS ${config.notification_ws}`);
      };

      this.ws.onmessage = ({ data }) => {
        this.props.setNotifyFromWs(JSON.parse(data));
      };

      this.ws.onclose = (event) => {
        // tslint:disable-next-line
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
      // tslint:disable-next-line
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
    return <div></div>;
  }
}

export default connect<StatePropsUserNotificationWs, DispatchPropsUserNotificationWs, OwnPropsUserNotificationWs, ReduxState>(
  (state) => ({
    token: state.session.token,
  }),
  (dispatch: any) => ({
    getOrderNotRead: () => (
      dispatch(
        getOrderNotRead(),
      )
    ),
    getAdmNotReadNotifications: () => (
      dispatch(
        getAdmNotReadNotifications(),
      )
    ),
    setNotifyFromWs: (notify) => (
      dispatch(
        setNotifyFromWs(notify),
      )
    ),
  }),
)(NotificationBadge);
