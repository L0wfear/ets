import * as React from 'react';
import * as ReactDom from 'react-dom';
import NotificationSystem from 'react-notification-system';

import EtsThemeProvider from 'components/new/ui/@bootstrap/EtsThemeProvider';

const notificationsDiv = document.createElement('div');
notificationsDiv.id = 'notifications';
document.body.appendChild(notificationsDiv);

/*
  INFO
  https://github.com/igorprado/react-notification-system
 */
class AppNotificationSystem extends React.Component {
  node = React.createRef<any>();
  constructor(props) {
    super(props);

    global.NOTIFICATION_SYSTEM = this;
  }

  notifyWithObject: typeof global.NOTIFICATION_SYSTEM.notifyWithObject  = (notification) => {
    this.node.current.addNotification(notification);
  }

  removeNotification: typeof global.NOTIFICATION_SYSTEM.removeNotification = (uid) => {
    this.node.current.removeNotification(uid);
  }

  notify: typeof global.NOTIFICATION_SYSTEM.notify = (text: string | object, type = 'success', position = 'tc') => {
    if (typeof this.node.current === 'undefined') {
      return undefined;
    }

    if (typeof text === 'object') {
      return this.notifyWithObject(text);
    }

    return this.notifyWithObject({
      message: text,
      level: type,
      position,
    });
  }

  render() {
    return (
      <EtsThemeProvider>
        <NotificationSystem ref={this.node} />
      </EtsThemeProvider>
    );
  }
}
ReactDom.render(
  <AppNotificationSystem />,
  document.getElementById('notifications'),
);
