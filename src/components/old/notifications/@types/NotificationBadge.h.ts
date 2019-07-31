import { IStateUserNotifications } from 'redux-main/reducers/modules/user_notifications/@types/user_notifications.h';
import { getUserNotificationInfo } from 'redux-main/reducers/modules/user_notifications/actions-user_notifications';

export type StateNotificationBadge = {
  socketIsWork: boolean,
  checkUsNotifInterval: any,
};

export type StatePropsNotificationBadge = {
  countNotRead: IStateUserNotifications['countNotRead'];
};
export type DispatchPropsNotificationBadge = {
  getUserNotificationInfo: typeof getUserNotificationInfo;
};
export type OwnPropsNotificationBadge = {
};
export type PropsNotificationBadge = (
  StatePropsNotificationBadge
  & DispatchPropsNotificationBadge
  & OwnPropsNotificationBadge
);
