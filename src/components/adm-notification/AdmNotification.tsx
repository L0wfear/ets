import * as React from 'react';
import { connectToStores, FluxContext } from 'utils/decorators';
import UserNotificationFormWrap from 'components/notifications/UserNotificationFormWrap';

type propsAdmNotification = {
  notReadAdmNotificationList: any[];
};

type stateAdmNotification = {
  idInterval: NodeJS.Timer | any;
  showForm: boolean;
  notification: any;
};

@connectToStores(['userNotifications'])
@FluxContext
class AdmNotification extends React.Component<propsAdmNotification, stateAdmNotification> {
  constructor(props, context) {
    super(props);

    this.state = {
      idInterval: setInterval(() => this.checkNotReadAdmNotification(), 30 * 1000),
      showForm: false,
      notification: null,
    }
  }
  componentDidMount() {
    this.context.flux.getActions('userNotifications').getNotReadAdmNotifications();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.notReadAdmNotificationList !== this.props.notReadAdmNotificationList
      || nextState.showForm !== this.state.showForm
      || nextState.notification !== this.state.notification
    );
  }

  componentWillReceiveProps(nextProps) {
    this.props.notReadAdmNotificationList.filter(({ id }) => {
      if (!nextProps.notReadAdmNotificationList.find(({ id: id_newList }) => id_newList === id)) {
        global.NOTIFICATION_SYSTEM.removeNotification(id);
      }
    });

    nextProps.notReadAdmNotificationList.map(notification =>
      global.NOTIFICATION_SYSTEM.notify({
        title: notification.title,
        message: notification.description,
        level: notification.priority,
        position: 'tr',
        autoDismiss: 0,
        onRemove: data => this.openModalForm(data),
        uid: notification.id,
      })
    );

    this.setState
  }

  componentWillUnmount() {
    clearInterval(this.state.idInterval);
  }

  checkNotReadAdmNotification() {
    this.context.flux.getActions('userNotifications').getNotReadAdmNotifications();
  }

  openModalForm = ({ uid }) => {
    const notification = this.props.notReadAdmNotificationList.find(({ id }) => id === uid);
    
    this.context.flux.getActions('userNotifications').markAsRead([{ id: uid, front_type: 'adm' }])
    // из-за фичи formWrap
    this.setState({
      showForm: false,
    });
    if (notification) {
      setTimeout(() =>
        this.setState({
          showForm: true,
          notification,
        }),
        0,
      );
    }
  }

  onFormHide = () => (
    this.setState({
      showForm: false,
      notification: null,
    })
  )

  render() {
    return (
      <UserNotificationFormWrap
        element={this.state.notification}
        showForm={this.state.showForm}
        onFormHide={this.onFormHide}
      />
    )
  }
}

export default AdmNotification;
