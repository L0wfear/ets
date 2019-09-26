import * as React from 'react';
import { connect } from 'react-redux';

import { makeReactMessage } from 'utils/helpMessangeWarning';
import { ReduxState } from 'redux-main/@types/state';
import { getUserNotificationsState } from 'redux-main/reducers/selectors';
import { IStateUserNotifications } from 'redux-main/reducers/modules/user_notifications/@types/user_notifications.h';
import { setMakeReadAdmNotification } from 'redux-main/reducers/modules/user_notifications/actions-user_notifications';
import { EtsDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

type StateProps = {
  admNotReadNotificationsList: IStateUserNotifications['admNotReadNotificationsList'];
};
type DispatchProps = {
  dispatch: EtsDispatch;
};
type OwnProps = {};
type PropsAdmNotification = (
  StateProps
  & DispatchProps
  & OwnProps
);

class AdmNotification extends React.PureComponent<PropsAdmNotification> {
  componentDidUpdate(prevProps: PropsAdmNotification) {
    const { props } = this;

    prevProps.admNotReadNotificationsList
      .filter(({ id }) => (
        !props.admNotReadNotificationsList.find((admN) => admN.id === id)
      ))
      .forEach(({ id }) => {
        global.NOTIFICATION_SYSTEM.removeNotification(id);
      });

    props.admNotReadNotificationsList.forEach((notify) => (
      global.NOTIFICATION_SYSTEM.notify({
        title: notify.title,
        message: makeReactMessage(notify.description),
        level: 'info',
        position: 'tr',
        autoDismiss: 0,
        uid: notify.id,
        dismissible: false,
        action: {
          label: 'Прочитано',
          callback: () => {
            this.props.dispatch(
              setMakeReadAdmNotification(notify.id),
            ).catch(({ error_text }) => {
              // tslint:disable-next-line
              console.warn(error_text);
            });
          },
        },
      })
    ));
  }

  render() {
    return null;
  }
}

export default connect<StateProps, DispatchProps, OwnProps, ReduxState>(
  (state) => ({
    admNotReadNotificationsList: getUserNotificationsState(state).admNotReadNotificationsList,
  }),
)(AdmNotification);
