import React from 'react';
import NotificationSystem from 'react-notification-system';

/*
  INFO
  https://github.com/igorprado/react-notification-system
 */

export default class AppNotificationSystem extends NotificationSystem {

  constructor(props) {
    super(props)
    this._notify = this.notify.bind(this);
  }

  /**
   * показать сообщение
   * @param text
   * @param type success|error|warning|info
   */
  notify(text, type) {

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
      )
  }
}
