import * as React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Button from 'react-bootstrap/lib/Button';

import { makeDate } from 'utils/dates';
import * as orderNotifiyMp3 from 'components/modal_notification/audio/orderNotifiy.mp3';
import * as orderNotifiyOgg from 'components/modal_notification/audio/orderNotifiy.ogg';
import { setMakeReadOrderNotification } from 'redux-main/reducers/modules/user_notifications/actions-user_notifications';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { getUserNotificationsState } from 'redux-main/reducers/selectors';
import { DivNone } from 'global-styled/global-styled';
import { ThunkDispatch } from 'redux-thunk';

import {
  StateNotifiactionOrders,
  StatePropsNotifiactionOrders,
  DispatchPropsNotifiactionOrders,
  OwnPropsNotifiactionOrders,
  PropsNotifiactionOrders,
} from 'components/modal_notification/NotifiactionOrders.h';

class NotifiactionOrders extends React.PureComponent<PropsNotifiactionOrders, StateNotifiactionOrders> {
  refAudio: any;

  onHide = () => {
    const { orderNotReadList: [{ id }] } = this.props;

    this.props.setMakeReadOrderNotification(id);
  }

  render() {
    const { orderNotReadList: [firstOrderNotify] } = this.props;

    if (!firstOrderNotify) {
      return (<DivNone />);
    }

    const {
      created_at = null,
      description = '',
      title = '',
    } = firstOrderNotify;

    return (
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
    );
  }
}

export default connect<StatePropsNotifiactionOrders, DispatchPropsNotifiactionOrders, OwnPropsNotifiactionOrders, ReduxState>(
  (state) => ({
    orderNotReadList: getUserNotificationsState(state).orderNotReadList,
  }),
  (dispatch: ThunkDispatch<ReduxState, {}, any>) => ({
    setMakeReadOrderNotification: (id) => (
      dispatch(
        setMakeReadOrderNotification(id),
      )
    ),
  }),
)(NotifiactionOrders);
