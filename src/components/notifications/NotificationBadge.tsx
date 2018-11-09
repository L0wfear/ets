import * as React from 'react';
import * as Badge from 'react-bootstrap/lib/Badge';
import { FluxContext, connectToStores } from 'utils/decorators';

/* ETS2 */
@connectToStores(['userNotifications'])
@FluxContext
class NotificationBadge extends React.Component<any, any> {
  context!: ETSCore.LegacyContext;

  state = {
    socketIsWork: false,
    checkUsNotifInterval: 0,
  }
  ws: any;
  componentDidMount() {
    this.checkNotifications();
    this.setState({ checkUsNotifInterval: setInterval(this.checkNotifications, 1000 * 60 * 60 ) });
  }
  componentWillUnmount() {
    clearInterval(this.state.checkUsNotifInterval);
  }
  checkNotifications = () => {
    this.context.flux.getActions('userNotifications').getUserNotificationInfo();
  }

  render() {
    const { countNotRead = 0 } = this.props;
    return <Badge>{countNotRead}</Badge>;
  }
}

export default NotificationBadge;
