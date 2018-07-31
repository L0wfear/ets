import * as React from 'react';
import { connectToStores, FluxContext } from 'utils/decorators';

type propsAdmNotification = {
  admNotReadNotificationsList: any[];
};

type stateAdmNotification = {
  idInterval: any;
};

@connectToStores(['userNotifications'])
@FluxContext
class AdmNotification extends React.Component<propsAdmNotification, stateAdmNotification> {
  componentWillReceiveProps(nextProps) {
    nextProps.admNotReadNotificationsList.forEach(notify => (
      global.NOTIFICATION_SYSTEM.notify({
        title: notify.title,
        message: notify.description,
        level: 'info',
        position: 'tr',
        autoDismiss: 0,
        uid: notify.id,
        dismissible: 'none',
        action: {
          label: 'Прочитано',
          callback: () => this.context.flux.getActions('userNotifications').setMakeReadAdmNotification(notify.id),
        }
      })
    ))
  }

  render() {
    return <div></div>;
  }
}

export default AdmNotification;
