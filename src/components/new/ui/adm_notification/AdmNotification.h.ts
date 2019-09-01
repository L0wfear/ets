import { IStateUserNotifications } from 'redux-main/reducers/modules/user_notifications/@types/user_notifications.h';
import { HandleThunkActionCreator } from 'react-redux';
import { setMakeReadAdmNotification } from 'redux-main/reducers/modules/user_notifications/actions-user_notifications';

export type StateAdmNotification = {
  idInterval: any;
};

export type StatePropsAdmNotification = {
  admNotReadNotificationsList: IStateUserNotifications['admNotReadNotificationsList'];
};
export type DispatchPropsAdmNotification = {
  setMakeReadAdmNotification: HandleThunkActionCreator<typeof setMakeReadAdmNotification>;
};
export type OwnPropsAdmNotification = {};
export type PropsAdmNotification = (
  StatePropsAdmNotification
  & DispatchPropsAdmNotification
  & OwnPropsAdmNotification
);
