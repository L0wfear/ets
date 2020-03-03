import { isArray } from 'util';
import { get, uniqBy } from 'lodash';

import {
  makeReadAdmNotification,
  getCountNotRead,
  getNotify,
  getNotifyAdm,
  makeUserNotificationRead,
  makeReadAllAdmNotification,
  makeUserNotificationReadAll,
} from 'redux-main/reducers/modules/user_notifications/promises';
import { getUserNotificationsState } from 'redux-main/reducers/selectors';
import { SESSION_CHANGE_SOME_DATA } from 'redux-main/reducers/modules/user_notifications/user_notifications';
import {
  TYPE_GROUP,
  getUserNotificationList,
  filterAdmNotReadNotifyByIdArr,
  mapAdmNotifyToSetReadByIdArr,
} from 'redux-main/reducers/modules/user_notifications/utils';
import { EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

export const userAdmNotificationPut = (type: string | null, read_ids: number | Array<number>, { page = 'notification-registry', path = null } = {}) => ({
  type,
  payload: makeReadAdmNotification(read_ids),
  meta: {
    promise: true,
    page,
    path,
  },
});

export const readAllAdmNotification = (type, { page = 'notification-registry', path = null } = {}) => ({
  type,
  payload: makeReadAllAdmNotification(),
  meta: {
    promise: true,
    page,
    path,
  },
});

export const userNotificationRead = (type: string | null, read_ids: number | Array<number>, { page = 'notification-registry', path = null } = {}) => ({
  type,
  payload: makeUserNotificationRead(read_ids),
  meta: {
    promise: true,
    page,
    path,
  },
});

export const userNotificationReadAll = (type, { page = 'notification-registry', path = null } = {}) => ({
  type,
  payload: makeUserNotificationReadAll(),
  meta: {
    promise: true,
    page,
    path,
  },
});

export const userNotificationGet = (type: string | null, payload: { is_read?: boolean; type_id?: number; }, { page = 'notification-registry', path = null} = {}) => ({
  type,
  payload: getNotify(payload),
  meta: {
    promise: true,
    page,
    path,
  },
});

export const getOrderNotRead = (): EtsAction<Promise<void>> => async (dispatch) => {
  const { payload: { notify } } = await dispatch(
    userNotificationGet(
      'none',
      {
        is_read: false,
        type_id: 6,
      },
    ),
  );

  dispatch(
    getUserNotificationInfo(),
  );

  dispatch(
    changeUserNotificationsState({
      orderNotReadList: notify,
    }),
  );

  return;
};

export const userNotificationAdmGet = (payload: { is_read?: boolean; }, { page = 'notification-registry', path = null } = {}): EtsAction<Promise<any>> => (dispatch) => (
  etsLoadingCounter(
    dispatch,
    getNotifyAdm(payload),
    {
      page,
      path,
    },
  )
);

export const changeUserNotificationsState = (newSomeState) => ({
  type: SESSION_CHANGE_SOME_DATA,
  payload: newSomeState,
});

export const setMakeReadAdmNotification = (notifyIds: number | Array<number>): EtsAction<Promise<void>> => async (dispatch, getState) => {
  const notifyIdsAsArr = isArray(notifyIds) ? notifyIds : [notifyIds];

  await dispatch(
    userAdmNotificationPut(
      null,
      notifyIdsAsArr,
    ),
  );

  dispatch(
    getUserNotificationInfo(),
  );

  const {
    admNotReadNotificationsList,
    admNotificationList,
    commonNotificationList,
  } = getUserNotificationsState(getState());

  const admNotReadNotificationsListNew = filterAdmNotReadNotifyByIdArr(
    admNotReadNotificationsList,
    notifyIdsAsArr,
  );

  const admNotificationListNew = mapAdmNotifyToSetReadByIdArr(
    admNotificationList,
    notifyIdsAsArr,
  );

  const userNotificationList = getUserNotificationList(
    admNotificationListNew,
    commonNotificationList,
  );

  dispatch(
    changeUserNotificationsState({
      admNotReadNotificationsList: admNotReadNotificationsListNew,
      admNotificationList: admNotificationListNew,
      userNotificationList,
    }),
  );

  return;
};

export const getUserNotificationInfo = (): EtsAction<Promise<any>> => async (dispatch) => {
  const response = await (
    dispatch({
      type: SESSION_CHANGE_SOME_DATA,
      payload: getCountNotRead(),
      meta: {
        promise: true,
        page: 'notification-registry',
      },
    })
  );

  return response;
};

export const setMakeReadOrderNotification = (notifyIds: number | Array<number>): EtsAction<Promise<void>> => async (dispatch, getState) => {
  const notifyIdsAsArr = isArray(notifyIds) ? notifyIds : [notifyIds];

  await dispatch(
    userNotificationRead(
      null,
      notifyIdsAsArr,
    ),
  );

  dispatch(
    getUserNotificationInfo(),
  );

  const {
    orderNotReadList,
    admNotificationList,
    commonNotificationList,
  } = getUserNotificationsState(getState());

  const orderNotReadListNew = filterAdmNotReadNotifyByIdArr(
    orderNotReadList,
    notifyIdsAsArr,
  );

  const admNotificationListNew = mapAdmNotifyToSetReadByIdArr(
    admNotificationList,
    notifyIdsAsArr,
  );

  const userNotificationList = getUserNotificationList(
    admNotificationListNew,
    commonNotificationList,
  );

  dispatch(
    changeUserNotificationsState({
      orderNotReadList: orderNotReadListNew,
      admNotificationList: admNotificationListNew,
      userNotificationList,
    }),
  );
};

export const getNotifications = (): EtsAction<Promise<void>> => async (dispatch, getState) => {
  const { payload: { notify } } = await dispatch(
    userNotificationGet(
      'none',
      {},
    ),
  );

  const changedState: any = {
    commonNotificationList: [],
  };

  const {
    orderNotReadList,
    admNotificationList,
  } = getUserNotificationsState(getState());

  notify.forEach((notification) => {
    changedState.commonNotificationList.push({
      ...notification,
      front_type: 'common',
    });

    if (notification.type_id === 6 && !notification.is_read) {
      changedState.orderNotReadList = [...orderNotReadList];
      orderNotReadList.push(notification);
    }
  });

  if (get(changedState, 'orderNotReadList', []).length) {
    changedState.orderNotReadList = uniqBy(orderNotReadList, 'id').sort((a: any, b: any) => a.id - b.id);
  }

  changedState.userNotificationList = getUserNotificationList(
    changedState.commonNotificationList,
    admNotificationList,
  );

  dispatch(
    changeUserNotificationsState(
      changedState,
    ),
  );

  return notify;
};

export const getAdmNotifications = () => async (dispatch, getState) => {
  const { payload: { notify } } = await dispatch(
    userNotificationAdmGet(
      {},
    ),
  );

  const changedState: any = {
    admNotificationList: [],
  };

  const {
    commonNotificationList,
    admNotReadNotificationsList,
  } = getUserNotificationsState(getState());

  notify.forEach((notification) => {
    changedState.admNotificationList.push({
      ...notification,
      front_type: 'adm',
    });

    if (!notification.is_read) {
      changedState.admNotReadNotificationsList = [...admNotReadNotificationsList];
      admNotReadNotificationsList.push(notification);
    }
  });

  if (get(changedState, 'admNotReadNotificationsList', []).length) {
    changedState.admNotReadNotificationsList = uniqBy(changedState.admNotReadNotificationsList, 'id').sort((a: any, b: any) => a.id - b.id);
  }

  changedState.userNotificationList = getUserNotificationList(
    commonNotificationList,
    changedState.admNotificationList,
  );

  dispatch(
    changeUserNotificationsState(
      changedState,
    ),
  );

  return notify;
};

export const markAllAsRead = () => async (dispatch) => {
  await Promise.all([
    dispatch(readAllAdmNotification('none')),
    dispatch(userNotificationReadAll('none')),
  ]);

  await Promise.all([
    dispatch(getNotifications()),
    dispatch(getAdmNotifications()),
  ]);
};

export const markAsRead = (readData = []) => async (dispatch) => {
  const payload = {
    common: {
      read_ids: [],
    },
    adm: {
      read_ids: [],
    },
  };

  readData.forEach(({ id, front_type }) => {
    if (payload[front_type]) {
      payload[front_type].read_ids.push(id);
    }
  });

  if (payload.common.read_ids.length) {
    await dispatch(
      userNotificationRead(
        'none',
        payload.common.read_ids,
      ),
    );

    dispatch(
      getNotifications(),
    );
  }

  if (payload.adm.read_ids.length) {
    await dispatch(
      userAdmNotificationPut(
        'none',
        payload.adm.read_ids,
      ),
    );

    dispatch(
      getAdmNotifications(),
    );
  }
};

export const getAdmNotReadNotifications = (): EtsAction<Promise<void>> => async (dispatch) => {
  const { payload: { notify } } = await dispatch(
    userNotificationAdmGet(
      {
        is_read: false,
      },
    ),
  );

  dispatch(
    getAdmNotifications(),
  );

  dispatch(
    changeUserNotificationsStateByGroup(
      notify.map((row) => {
        row.group = 'common';

        return row;
      }),
    ),
  );

  return;
};

export const setNotifyFromWs = (notify): EtsAction<Promise<void>> => async (dispatch) => {
  await dispatch(
    changeUserNotificationsStateByGroup({
      ...notify,
      front_type: get(TYPE_GROUP, [notify.group, 'front_type'], ''),
    }),
  );
  dispatch(
    getNotifications(),
  );

  return;
};

export const changeUserNotificationsStateByGroup = (newRowsNotifyArr) => (dispatch, getState) => {
  const notifyArr = isArray(newRowsNotifyArr) ? newRowsNotifyArr : [newRowsNotifyArr];

  const userNotificationsState = getUserNotificationsState(getState());

  const changedState: any = {};

  notifyArr.forEach((notify) => {
    const { group } = notify;
    if (TYPE_GROUP[group]) {
      if (!(TYPE_GROUP[group].arr in changedState)) {
        changedState[TYPE_GROUP[group].arr] = [...userNotificationsState[TYPE_GROUP[group].arr]];
      }
      if (!(TYPE_GROUP[group].dependent in changedState)) {
        changedState[TYPE_GROUP[group].dependent] = [...userNotificationsState[TYPE_GROUP[group].dependent]];
      }
      changedState[TYPE_GROUP[group].arr].push(notify);
      changedState[TYPE_GROUP[group].dependent].push(notify);

      changedState[TYPE_GROUP[group].arr] = uniqBy(changedState[TYPE_GROUP[group].arr], 'id');
      changedState[TYPE_GROUP[group].dependent] = uniqBy(changedState[TYPE_GROUP[group].dependent], 'id');
    }
  });

  changedState.userNotificationList = getUserNotificationList(
    get(changedState, 'commonNotificationList', userNotificationsState.commonNotificationList),
    get(changedState, 'admNotificationList', userNotificationsState.admNotificationList),
  );

  dispatch(
    changeUserNotificationsState(
      changedState,
    ),
  );
};
