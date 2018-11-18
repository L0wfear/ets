import { IStateUserNotifications } from 'redux-main/reducers/modules/user_notifications/@types/user_notifications.h';

export type StateNotificationBadge = {
  socketIsWork: boolean,
  checkUsNotifInterval: any,
};

export type StatePropsNotificationBadge = {
  countNotRead: IStateUserNotifications['countNotRead'];
};
export type DispatchPropsNotificationBadge = {
  getUserNotificationInfo: () => any;
};
export type OwnPropsNotificationBadge = {
};
export type PropsNotificationBadge = (
  StatePropsNotificationBadge
  & DispatchPropsNotificationBadge
  & OwnPropsNotificationBadge
);
