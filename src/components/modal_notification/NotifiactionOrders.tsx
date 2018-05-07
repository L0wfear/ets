import * as React from 'react';
import {
  Modal,
  Button,
} from 'react-bootstrap';

import { isEmpty } from 'lodash';
import { connectToStores } from 'utils/decorators';
import { makeDate } from 'utils/dates';
import * as orderNotifiyMp3 from 'assets/audio/orderNotifiy.mp3';
import * as orderNotifiyOgg from 'assets/audio/orderNotifiy.ogg';

import NotificationModal from 'components/modal_notification/NotificationModal';

@connectToStores(['userNotifications'])
class NotifiactionOrders extends NotificationModal {
  refAudio: any;
  constructor(props) {
    super(props);

    const timerGetNot = setInterval(this.updateNotificationPopup, 30 * 1000);
    this.state = {
      show: false,
      timerGetNot,
      hasAudio: false,
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
    const { notificationPopupLast = [], hasNewOrderNotifications } = props;

    if (isEmpty(notificationPopupLast)) {
      this.setState({ show: false });
    } else {
      if (hasNewOrderNotifications) {
        this.setState({
          show: true,
          hasAudio: true,
          audioTimeout: setTimeout(() => this.setState({ hasAudio: false }), 2000),
        });
      } else {
        this.setState({ show: true });
      }
    }
  }
  /**
   * @override
   */
  onHide = () => {
    const { flux } = this.context;
    const { notificationPopupLast = [] } = this.props;
    this.setState({ hasAudio: false });

    flux.getActions('userNotifications').decNotificationsPopup(notificationPopupLast.map(d => d.id));
  }

  /**
   * @override
   */
  getHeader = () => {
    const { notificationPopupLast } = this.props;
    const [popupData] = notificationPopupLast;
    const { created_at = null } = popupData || {};

    return (
      <Modal.Header closeButton>
        <div className="flex-space-between">
          <span>{'Поступление новой факсограммы'}</span>
          <span>{makeDate(created_at)}</span>
        </div>
      </Modal.Header>
    )
  }
  /**
   * @override
   */
  getBody = () => {
    const { notificationPopupLast = [] } = this.props;

    return (
      <Modal.Body>
        {notificationPopupLast.map(d => <label key="0">{d.description}</label>)}
        {
          this.state.hasAudio && (
          <audio autoPlay>
            <source src={orderNotifiyMp3} type={'audio/mpeg; codecs="mp3"'} />
            <source src={orderNotifiyOgg} type={'audio/mpeg; codecs="ogg"'} />
          </audio>
          )
        }
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
