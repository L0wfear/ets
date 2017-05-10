import React from 'react';
import { render } from 'react-dom';
import NotificationSystem from 'react-notification-system';

const notificationsDiv = document.createElement('div');
notificationsDiv.id = 'notifications';
document.body.appendChild(notificationsDiv);

/*
  INFO
  https://github.com/igorprado/react-notification-system
 */
class AppNotificationSystem extends React.Component {

  constructor(props) {
    super(props);
    this._notify = this.notify.bind(this);
  }

  notifyWithObject(notification) {
    this._notificationSystem.addNotification(notification);
  }

  /**
   * показать обычное сообщение
   * @param text
   * @param type success|error|warning|info
   */
  notify(text, type = 'success', position = 'tc') {
    if (typeof text === 'object') {
      return this.notifyWithObject(text);
    }
    if (typeof this._notificationSystem === 'undefined') {
      return undefined;
    }

    return this._notificationSystem.addNotification({
      message: text,
      level: type,
      position,
    });
  }

  render() {
    return (
      <NotificationSystem ref={node => (this._notificationSystem = node)} />
    );
  }
}

global.NOTIFICATION_SYSTEM = render(<AppNotificationSystem />, document.getElementById('notifications'));
