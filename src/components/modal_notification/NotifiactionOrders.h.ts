import { IStateUserNotifications } from 'redux-main/reducers/modules/user_notifications/@types/user_notifications.h';
import { setMakeReadOrderNotification } from 'redux-main/reducers/modules/user_notifications/actions-user_notifications';

export type StateNotifiactionOrders = {
  timerGetNot: any;
};

export type StatePropsNotifiactionOrders = {
  orderNotReadList: IStateUserNotifications['orderNotReadList'];
};
export type DispatchPropsNotifiactionOrders = {
  setMakeReadOrderNotification: typeof setMakeReadOrderNotification;
};
export type OwnPropsNotifiactionOrders = {
};
export type PropsNotifiactionOrders = (
  StatePropsNotifiactionOrders
  & DispatchPropsNotifiactionOrders
  & OwnPropsNotifiactionOrders
);
