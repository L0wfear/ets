import * as React from 'react';
import { get } from 'lodash';

import EtsBootstrap from 'components/new/ui/@bootstrap';

import { makeDate, diffDates, createValidDateHM, getDateWithMoscowTz } from 'components/@next/@utils/dates/dates';
import * as orderNotifiyMp3 from 'components/new/ui/modal_notification/audio/orderNotifiy.mp3';
import * as orderNotifiyOgg from 'components/new/ui/modal_notification/audio/orderNotifiy.ogg';
import { setMakeReadOrderNotification } from 'redux-main/reducers/modules/user_notifications/actions-user_notifications';
import { getUserNotificationsState } from 'redux-main/reducers/selectors';
import { DivNone } from 'global-styled/global-styled';

import { etsUseSelector, etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

type OwnProps = {};
const NotifiactionOrders: React.FC<OwnProps> = React.memo(
  () => {
    const firstOrderNotify = etsUseSelector((state) => getUserNotificationsState(state).orderNotReadList[0]);
    const dispatch = etsUseDispatch();
    const onHide = React.useCallback(
      () => {
        const id = get(firstOrderNotify, 'id');
        dispatch(setMakeReadOrderNotification(id));
      },
      [firstOrderNotify],
    );

    if (
      !firstOrderNotify
      || !firstOrderNotify.created_at
      || diffDates(createValidDateHM(getDateWithMoscowTz()), createValidDateHM(firstOrderNotify.created_at)) > 24 * 60 * 60
    ) {
      return (<DivNone />);
    }

    const {
      created_at = null,
      description = '',
      title = '',
    } = firstOrderNotify;

    return (
      <EtsBootstrap.ModalContainer id="notifiaction_orders" show onHide={onHide}>
        <EtsBootstrap.ModalHeader closeButton>
          <div className="flex-space-between" style={{ fontWeight: 'bold' }}>
            <span style={{ marginRight: 10, marginLeft: 4 }}>{title}</span>
            <span>{created_at ? makeDate(created_at) : ''}</span>
          </div>
        </EtsBootstrap.ModalHeader>
        <EtsBootstrap.ModalBody>
          <label key="0">{description}</label>
          <audio autoPlay>
            <source src={orderNotifiyMp3} type={'audio/mpeg; codecs="mp3"'} />
            <source src={orderNotifiyOgg} type={'audio/mpeg; codecs="ogg"'} />
          </audio>
        </EtsBootstrap.ModalBody>
        <EtsBootstrap.ModalFooter>
          <EtsBootstrap.Button onClick={onHide}>Закрыть</EtsBootstrap.Button>
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  },
);

export default NotifiactionOrders;
