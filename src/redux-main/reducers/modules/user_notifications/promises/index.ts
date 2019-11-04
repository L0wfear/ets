import {
  UserAdmNotificationService,
  UserNotificationInfoService,
  UserNotificationService,
} from 'api/Services';
import { get } from 'lodash';
import { isArray, isBoolean, isNumber } from 'util';

export const makeReadAdmNotification = (read_ids) => (
  UserAdmNotificationService.put(
    {
      read_ids: isArray(read_ids) ? read_ids : [read_ids],
    },
    false,
    'json',
  )
);

export const makeReadAllAdmNotification = () => (
  UserAdmNotificationService.put(
    {
      is_read_all: true,
    },
    false,
    'json',
  )
);

export const makeUserNotificationRead = (read_ids) => (
  UserNotificationService.put(
    {
      read_ids: isArray(read_ids) ? read_ids : [read_ids],
    },
    false,
    'json',
  )
);

export const makeUserNotificationReadAll = () => (
  UserNotificationService.put(
    {
      is_read_all: true,
    },
    false,
    'json',
  )
);

export const getCountNotRead = () => (
  UserNotificationInfoService.get()
    .catch((error) => {
      // tslint:disable-next-line
      console.warn(error);

      return {
        result: {
          rows: {
            not_read_num: 0,
          },
        },
      };
    })
    .then((ans) => ({
      countNotRead: get(ans, ['result', 'rows', 'not_read_num'], 0),
    }))
);

export type NotifyAns = {
  notify: Array<any>;
};

export const getNotify = (ownPayload: { is_read?: boolean; type_id?: number; }): any => {
  const payload: typeof ownPayload = {};

  if (isBoolean(ownPayload.is_read)) {
    payload.is_read = ownPayload.is_read;
  }

  if (isNumber(ownPayload.type_id)) {
    payload.type_id = ownPayload.type_id;
  }

  return UserNotificationService
    .get(payload)
    .catch((error) => {
      console.warn(error); // tslint:disable-line

      return {
        result: {
          rows: [],
        },
      };
    })
    .then((ans) => ({
      notify: get(ans, ['result', 'rows'], []),
    }));
};

export const getNotifyAdm = (ownPayload) => {
  const payload: any = {};

  if (isBoolean(ownPayload.is_read)) {
    payload.is_read = ownPayload.is_read;
  }

  return UserAdmNotificationService
    .get(payload)
    .catch((error) => {
      // tslint:disable-next-line
      console.warn(error);

      return {
        result: {
          rows: [],
        },
      };
    })
    .then((ans) => ({
      notify: get(ans, ['result', 'rows'], []),
    }));
};
