import * as React from 'react';
import { Badge } from 'react-bootstrap';
import { FluxContext } from 'utils/decorators';
import { connectToStores } from 'utils/decorators';

@connectToStores(['userNotifications'])
@FluxContext
class NotificationBadge extends React.Component<any, any> {
  shouldComponentUpdate(nextProps) {
    const { countNotRead: nextCountNotRead } = nextProps;
    const { countNotRead: countNotRead } = this.props;
    return nextCountNotRead !== countNotRead;
  }
  componentDidMount() {
    this.checkNotifications();
    const checkUsNotifInterval = setInterval(this.checkNotifications, 1000 * 60 * 60);
    this.setState({ checkUsNotifInterval });
  }
  componentWillUnmount() {
    const { checkUsNotifInterval } = this.state;
    clearInterval(checkUsNotifInterval);
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
