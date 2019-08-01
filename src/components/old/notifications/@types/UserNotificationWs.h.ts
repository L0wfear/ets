import { UserNotification } from 'redux-main/reducers/modules/user_notifications/@types/user_notifications.h';

export type StateUserNotificationWs = {
  getNotReadInterval: any;
};

export type StatePropsUserNotificationWs = {
  token: any;
};
export type DispatchPropsUserNotificationWs = {
  getOrderNotRead: () => any;
  getAdmNotReadNotifications: () => any;
  setNotifyFromWs: (notify: UserNotification) => any;
};
export type OwnPropsUserNotificationWs = {
};
export type PropsUserNotificationWs = (
  StatePropsUserNotificationWs
  & DispatchPropsUserNotificationWs
  & OwnPropsUserNotificationWs
);
