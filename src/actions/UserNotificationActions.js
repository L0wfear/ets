import { Actions } from 'flummox';

import {
  UserNotificationService,
  UserNotificationInfoService,
  UserAdmNotificationService,
} from 'api/Services';


const getFrontType = (group) => {
  switch (group) {
    case 'personal':
      return 'common';
    case 'common':
      return 'adm';
    default:
      return '';
  }
};

export default class UserNotificationActions extends Actions {
  getOrderNotRead() {
    return UserNotificationService.get({ is_read: false, type_id: 6 }).then(ans => ({ ...ans, group: 'personal' }));
  }
  setMakeReadOrderNotification(id) {
    return UserNotificationService.put({ read_ids: [id] }, false, 'json').then(() => id);
  }

  getAdmNotReadNotifications() {
    return UserAdmNotificationService.get({ is_read: false }).then(ans => ({ ...ans, group: 'common' }));
  }
  setMakeReadAdmNotification(id) {
    return UserAdmNotificationService.put({ read_ids: [id] }, false, 'json').then(() => id);
  }
  getNotifications(payload = {}) {
    return UserNotificationService.get(payload);
  }
  getAdmNotifications(payload = {}) {
    return UserAdmNotificationService.get(payload);
  }

  getUserNotificationInfo() {
    return UserNotificationInfoService.get();
  }

  markAsRead(readData = []) {
    const payload = {
      common: {
        read_ids: [],
      },
      adm: {
        read_ids: [],
      },
    };

    readData.forEach(({ id, front_type }) =>
      payload[front_type] && payload[front_type].read_ids.push(id)
    );

    return Promise.all([
      (payload.common.read_ids.length ? UserNotificationService.put({ ...payload.common }, false, 'json') : Promise.reject())
        .then(() => this.getNotifications())
        .catch(() => ({ result: { notUpdate: true } })),
      (payload.adm.read_ids.length ? UserAdmNotificationService.put({ ...payload.adm }, false, 'json') : Promise.reject())
        .then(() => this.getAdmNotifications())
        .catch(() => ({ result: { notUpdate: true } })),
    ]);
  }

  markAllAsRead() {
    const payload = {
      is_read_all: true,
    };

    return Promise.all([
      UserNotificationService.put(payload, false, 'json'),
      UserAdmNotificationService.put(payload, false, 'json'),
    ]).then(() => {
      this.getNotifications();
      this.getAdmNotifications();
    });
  }

  setNotifyFromWs(notify) {
    return Promise.resolve({
      ...notify,
      front_type: getFrontType(notify.group),
    });
  }
}
