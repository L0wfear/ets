import * as React from 'react';
import {
  Modal,
  Button,
} from 'react-bootstrap';

import { isEmpty } from 'lodash';
import { connectToStores } from 'utils/decorators';

import NotificationModal from '../../components/modal_notification/NotificationModal';

@connectToStores(['userNotifications'])
class NotifiactionOrders extends NotificationModal {
  constructor(props) {
    super(props);

    const timerGetNot = setInterval(this.updateNotificationPopup, 30 * 1000);
    this.state = {
      show: false,
      timerGetNot,
    };
  }
  componentDidMount() {
    this.updateNotificationPopup();
  }
  componentWillUnmount() {
    clearInterval(this.state.timerGetNot);
  }

  updateNotificationPopup = () => {
    const { flux } = this.context;
    const payload = {
      type_id: 6,
      is_read: false,
    };

    flux.getActions('userNotifications').getNotificationsPopup(payload);
  }

  componentWillReceiveProps(props) {
    const { notificationPopupLast = [] } = props;

    if (isEmpty(notificationPopupLast)) {
      this.setState({ show: false });
    } else {
      this.setState({ show: true });
    }
  }
  /**
   * @override
   */
  onHide = () => {
    const { flux } = this.context;
    const { notificationPopupLast = [] } = this.props;

    flux.getActions('userNotifications').decNotificationsPopup(notificationPopupLast.map(d => d.id));
  }

  /**
   * @override
   */
  getHeader = () => (
    <Modal.Header>
     Уведомление
    </Modal.Header>
  )
  /**
   * @override
   */
  getBody = () => {
    const { notificationPopupLast = [] } = this.props;

    return (
      <Modal.Body>
        {notificationPopupLast.map(d => <label key="0">{d.description}</label>)}
      </Modal.Body>
    );
  }
  /**
   * @override
   */
  getFooter = () => {
    return (
      <Modal.Footer>
        <Button onClick={this.onHide}>Закрыть</Button>
      </Modal.Footer>
    );
  }
}

export default NotifiactionOrders;
