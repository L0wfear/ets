import { createPath } from 'redux-main/redux-utils';
import { IStateUserNotifications } from 'redux-main/reducers/modules/user_notifications/@types/user_notifications.h';

const USER_NOTIFICATIONS = createPath('USER_NOTIFICATIONS');

export const SESSION_SET_DATA = USER_NOTIFICATIONS`SET_DATA`;
export const SESSION_CHANGE_SOME_DATA = USER_NOTIFICATIONS`CHANGE_SOME_DATA`;

const initialState: IStateUserNotifications = {
  commonNotificationList: [],
  userNotificationList: [],
  admNotificationList: [],
  orderNotReadList: [],
  admNotReadNotificationsList: [],
  countNotRead: 0,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SESSION_CHANGE_SOME_DATA: {
      return {
        ...state,
        ...payload,
      };
    }
    default: {
      return state;
    }
  }
};
