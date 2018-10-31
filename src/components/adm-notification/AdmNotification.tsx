import * as React from 'react';
import { connectToStores, FluxContext } from 'utils/decorators';
import { makeReactMessange } from 'utils/helpMessangeWarning';

type propsAdmNotification = {
  admNotReadNotificationsList: any[];
};

type stateAdmNotification = {
  idInterval: any;
};

@connectToStores(['userNotifications'])
@FluxContext
class AdmNotification extends React.Component<propsAdmNotification, stateAdmNotification> {
  componentDidUpdate(prevProps) {
    const { props } = this;

    prevProps.admNotReadNotificationsList.filter(({ id }) => !props.admNotReadNotificationsList.find(admN => admN.id === id)).forEach(({ id }) => {
      global.NOTIFICATION_SYSTEM.removeNotification(id);
    });

    props.admNotReadNotificationsList.forEach(notify => (
      global.NOTIFICATION_SYSTEM.notify({
        title: notify.title,
        message: makeReactMessange(notify.description),
        level: 'info',
        position: 'tr',
        autoDismiss: 0,
        uid: notify.id,
        dismissible: false,
        action: {
          label: 'Прочитано',
          callback: () => {
            this.context.flux.getActions('userNotifications').setMakeReadAdmNotification(notify.id)
              .then(() => this.updateCounterNotify())
              .catch(({ error_text }) => console.warn(error_text));
          },
        },
      })
    ));
  }

  updateCounterNotify() {
    this.context.flux.getActions('userNotifications').getUserNotificationInfo();
  }

  render() {
    return <div></div>;
  }
}

export default AdmNotification;
