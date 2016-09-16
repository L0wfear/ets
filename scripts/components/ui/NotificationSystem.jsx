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
class AppNotificationSystem extends NotificationSystem {

  constructor(props) {
    super(props)
    this._notify = this.notify.bind(this);
  }


  addNotification(notification) {
    this._notificationSystem.addNotification(notification)
  }

  /**
   * показать обычное сообщение
   * @param text
   * @param type success|error|warning|info
   */
  notify(text, type = 'success') {

    if (typeof this._notificationSystem === 'undefined') {
      return
    }

    this._notificationSystem.addNotification({
      message: text,
      level: type,
      position: 'tc'
    });
  }

  componentDidMount() {
    this._notificationSystem = this.refs.notificationSystem;
  }

  render() {
    return (
      <NotificationSystem ref="notificationSystem"/>
    );
  }
}

global.NOTIFICATION_SYSTEM = render(<AppNotificationSystem/>, document.getElementById('notifications'));
