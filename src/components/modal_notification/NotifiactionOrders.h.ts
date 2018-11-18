import { IStateUserNotifications } from 'redux-main/reducers/modules/user_notifications/@types/user_notifications.h';

export type StateNotifiactionOrders = {
  timerGetNot: any;
};

export type StatePropsNotifiactionOrders = {
  orderNotReadList: IStateUserNotifications['orderNotReadList'];
};
export type DispatchPropsNotifiactionOrders = {
  setMakeReadOrderNotification: (id: number) => any;
};
export type OwnPropsNotifiactionOrders = {
};
export type PropsNotifiactionOrders = (
  StatePropsNotifiactionOrders
  & DispatchPropsNotifiactionOrders
  & OwnPropsNotifiactionOrders
);
