import * as React from 'react';
import { makeReactMessange } from 'utils/helpMessangeWarning';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { setMakeReadAdmNotification } from 'redux-main/reducers/modules/user_notifications/actions-user_notifications';
import { getUserNotificationsState } from 'redux-main/reducers/selectors';

import {
  StateAdmNotification,
  StatePropsAdmNotification,
  DispatchPropsAdmNotification,
  OwnPropsAdmNotification,
  PropsAdmNotification,
} from 'components/adm-notification/AdmNotification.h';

class AdmNotification extends React.Component<PropsAdmNotification, StateAdmNotification> {
  context!: ETSCore.LegacyContext;

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
        message: makeReactMessange(notify.description),
        level: 'info',
        position: 'tr',
        autoDismiss: 0,
        uid: notify.id,
        dismissible: false,
        action: {
          label: 'Прочитано',
          callback: () => {
            this.props.setMakeReadAdmNotification(notify.id)
              .catch(({ error_text }) => {
                // tslint:disable-next-line
                console.warn(error_text);
              });
          },
        },
      })
    ));
  }

  render() {
    return <div></div>;
  }
}

export default connect<StatePropsAdmNotification, DispatchPropsAdmNotification, OwnPropsAdmNotification, ReduxState>(
  (state) => ({
    admNotReadNotificationsList: getUserNotificationsState(state).admNotReadNotificationsList,
  }),
  (dispatch) => ({
    setMakeReadAdmNotification: (id) => (
      dispatch(
        setMakeReadAdmNotification(id),
      )
    ),
  }),
)(AdmNotification);
