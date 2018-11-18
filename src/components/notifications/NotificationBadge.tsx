import * as React from 'react';
import * as Badge from 'react-bootstrap/lib/Badge';

import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { getUserNotificationInfo } from 'redux-main/reducers/modules/user_notifications/actions-user_notifications';
import { getUserNotificationsState } from 'redux-main/reducers/selectors';

import {
  StateNotificationBadge,
  StatePropsNotificationBadge,
  DispatchPropsNotificationBadge,
  OwnPropsNotificationBadge,
  PropsNotificationBadge,
} from 'components/notifications/@types/NotificationBadge.h';

/* ETS2 */
class NotificationBadge extends React.PureComponent<PropsNotificationBadge, StateNotificationBadge> {
  context!: ETSCore.LegacyContext;

  state = {
    socketIsWork: false,
    checkUsNotifInterval: 0,
  };

  ws: any;
  componentDidMount() {
    this.checkNotifications();
    this.setState({ checkUsNotifInterval: setInterval(this.checkNotifications, 1000 * 60 * 60 ) });
  }
  componentWillUnmount() {
    clearInterval(this.state.checkUsNotifInterval);
  }
  checkNotifications = () => {
    this.props.getUserNotificationInfo();
  }

  render() {
    const { countNotRead = 0 } = this.props;
    return <Badge>{countNotRead}</Badge>;
  }
}

export default connect<StatePropsNotificationBadge, DispatchPropsNotificationBadge, OwnPropsNotificationBadge, ReduxState>(
  getUserNotificationsState,
  (dispatch) => ({
    getUserNotificationInfo: () => (
      dispatch(
        getUserNotificationInfo(),
      )
    ),
  }),
)(NotificationBadge);
