import {
  diffDates,
} from 'components/@next/@utils/dates/dates';

export const TYPE_GROUP = {
  personal: {
    arr: 'orderNotReadList',
    dependent: 'commonNotificationList',
    front_type: 'common',
  },
  common: {
    arr: 'admNotReadNotificationsList',
    dependent: 'admNotificationList',
    front_type: 'adm',
  },
};

export const getUserNotificationList = (commonNotificationList, admNotificationList) => (
  [
    ...commonNotificationList,
    ...admNotificationList,
  ].sort(({ created_at: created_at_first }, { created_at: created_at_second }) => (
    diffDates(created_at_second, created_at_first)
  ))
);

export const filterAdmNotReadNotifyByIdArr = (admNotReadNotificationsList, notifyIdsAsArr) => (
  admNotReadNotificationsList
    .filter((notifyData) => !notifyIdsAsArr.includes(notifyData.id))
    .sort((a, b) => a.id - b.id)
);

export const mapAdmNotifyToSetReadByIdArr = (admNotificationList, notifyIdsAsArr) => (
  admNotificationList
    .map((common) => ({
      ...common,
      is_read: notifyIdsAsArr.includes(common.id) || common.is_read,
    }))
);
