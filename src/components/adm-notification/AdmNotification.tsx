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
        message: (
          <div>
          {
            notify.description.split('\n').map((text, index) => [
              <div key={index}>{text}</div>,
              <br key={`$1/${index}`} />,
            ])
          }
          </div>
        ),
        level: 'info',
        position: 'tr',
        autoDismiss: 0,
        uid: notify.id,
        dismissible: false,
        action: {
          label: 'Прочитано',
          callback: () => (
            this.context.flux.getActions('userNotifications').setMakeReadAdmNotification(notify.id)
            .catch(({ error_text }) => console.warn(error_text))
          ),
        }
      })
    ))
  }

  render() {
    return <div></div>;
  }
}

export default AdmNotification;
