import { IStateUserNotifications } from 'redux-main/reducers/modules/user_notifications/@types/user_notifications.h';

export type StateAdmNotification = {
  idInterval: any;
};

export type StatePropsAdmNotification = {
  admNotReadNotificationsList: IStateUserNotifications['admNotReadNotificationsList'];
};
export type DispatchPropsAdmNotification = {
  setMakeReadAdmNotification: (id: number) => Promise<any>;
};
export type OwnPropsAdmNotification = {};
export type PropsAdmNotification = (
  StatePropsAdmNotification
  & DispatchPropsAdmNotification
  & OwnPropsAdmNotification
);
