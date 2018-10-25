import * as React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Button from 'react-bootstrap/lib/Button';

import { connectToStores, FluxContext } from 'utils/decorators';
import { makeDate } from 'utils/dates';
import * as orderNotifiyMp3 from 'assets/audio/orderNotifiy.mp3';
import * as orderNotifiyOgg from 'assets/audio/orderNotifiy.ogg';

type PropsNotifiactionOrders = {
  orderNotReadList: any[];
};

type StateNotifiactionOrders = {
  timerGetNot: any;
};

/* ETS2 */
@connectToStores(['userNotifications'])
@FluxContext
class NotifiactionOrders extends React.PureComponent<PropsNotifiactionOrders, StateNotifiactionOrders> {
  refAudio: any;

  onHide = () => {
    const { orderNotReadList: [{ id }] } = this.props;

    this.context.flux.getActions('userNotifications').setMakeReadOrderNotification(id)
      .then(() => this.updateCounterNotify());
  }

  updateCounterNotify() {
    this.context.flux.getActions('userNotifications').getUserNotificationInfo();
  }

  render() {
    const { orderNotReadList: [firstOrderNotify = { notShow: true }] } = this.props;

    const {
      created_at = null,
      description = '',
      title = '',
      notShow,
    } = firstOrderNotify;

    return (
      !notShow ?
        <Modal show onHide={this.onHide} backdrop="static">
          <Modal.Header closeButton>
            <div className="flex-space-between">
              <span>{title}</span>
              <span>{created_at ? makeDate(created_at) : ''}</span>
            </div>
          </Modal.Header>
          <Modal.Body>
            <label key="0">{description}</label>
            <audio autoPlay>
              <source src={orderNotifiyMp3} type={'audio/mpeg; codecs="mp3"'} />
              <source src={orderNotifiyOgg} type={'audio/mpeg; codecs="ogg"'} />
            </audio>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.onHide}>Закрыть</Button>
          </Modal.Footer>
        </Modal>
      :
        <div></div>
    )
  }
}

export default NotifiactionOrders;
