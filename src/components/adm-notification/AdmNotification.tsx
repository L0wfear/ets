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
  constructor(props, context) {
    super(props);

    this.state = {
      idInterval: setInterval(() => this.checkNotReadAdmNotification(), 30 * 1000),
    }
  }

  componentDidMount() {
    this.checkNotReadAdmNotification();
  }

  componentWillReceiveProps(nextProps) {
    this.props.admNotReadNotificationsList.filter(({ id }) => (
      !nextProps.admNotReadNotificationsList.find(n => n.id === id)
    )).forEach(({ id }) => (
      global.NOTIFICATION_SYSTEM.removeNotification(id)
    ));

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

  componentWillUnmount() {
    clearInterval(this.state.idInterval);
  }

  checkNotReadAdmNotification() {
    this.context.flux.getActions('userNotifications').getAdmNotReadNotifications();
  }

  render() {
    return <div></div>;
  }
}

export default AdmNotification;
