import { Store } from 'flummox';
import {
  diffDates,
} from 'utils/dates';

const mock = `{
    "result": {
        "rows": [
            {
                "data": {
                    "days_left": 3,
                    "insurance_type_id": 2,
                    "car_id": 6502,
                    "insurance_type_name": "КАСКО",
                    "car_gov_number": "0049ВТ77"
                },
                "type_id": 1,
                "id": 1742,
                "is_read": false,
                "type_name": "Страховки",
                "title": "Истекает срок действия КАСКО",
                "type_code": "insurance_policy",
                "description": "У ТС с гос. номером 0049ВТ77 истекает срок действия КАСКО через 3 дня.",
                "priority": "alert",
                "created_at": "2017-08-17T16:32:48"
            },
            {
                "data": {
                    "days_left": 1,
                    "insurance_type_id": 2,
                    "car_id": 2265,
                    "insurance_type_name": "КАСКО",
                    "car_gov_number": "9495АЕ77"
                },
                "type_id": 1,
                "id": 1682,
                "is_read": false,
                "type_name": "Страховки",
                "title": "Истекает срок действия КАСКО",
                "type_code": "insurance_policy",
                "description": "У ТС с гос. номером 9495АЕ77 истекает срок действия КАСКО через 1 день.",
                "priority": "alert",
                "created_at": "2017-08-17T16:32:47"
            }
        ],
        "meta": {},
        "extra": {}
    }
}`;


const getUserNotificationList = (commonNotificationList, admNotificationList) => [
  ...commonNotificationList,
  ...admNotificationList,
].sort(({ created_at: created_at_first }, { created_at: created_at_second }) =>
    diffDates(created_at_second, created_at_first)
);

export default class UserNotificationStore extends Store {

  constructor(flux) {
    super();

    const userNotificationActions = flux.getActions('userNotifications');

    this.register(userNotificationActions.getNotifications, this.handleGetNotifications);
    this.register(userNotificationActions.getAdmNotifications, this.handleGetAdmNotifications);
    this.register(userNotificationActions.getNotReadAdmNotifications, this.handleGetNotReadAdmNotifications);
    this.register(userNotificationActions.markAsRead, this.handleMarkAsRead);
    this.register(userNotificationActions.markAllAsRead, this.handleMarkAllAsRead);

    this.state = {
      userNotificationList: [],
      commonNotificationList: [],
      admNotificationList: [],

      notReadAdmNotificationList: [],

      dateUpdate: {
        userNotificationList: null,
        commonNotificationList: null,
        notReadAdmNotificationList: null,
      },
    };
  }
  handleGetNotifications({ result: { rows } }) {
    const commonNotificationList = rows.map(notification => ({
      ...notification,
      front_type: 'common',
    }));

    this.setState({
      commonNotificationList,
      userNotificationList: getUserNotificationList(commonNotificationList, this.state.admNotificationList),
      dateUpdate: {
        ...this.state.dateUpdate,
        commonNotificationList: new Date(),
      },
    });
  }
  handleGetAdmNotifications({ result: { rows } }) {
    const admNotificationList = rows.map(notification => ({
      ...notification,
      front_type: 'adm',
    }));

    this.setState({
      admNotificationList,
      userNotificationList: getUserNotificationList(admNotificationList, this.state.commonNotificationList),
      dateUpdate: {
        ...this.state.dateUpdate,
        admNotificationList: new Date(),
      },
    });
  }

  handleGetNotReadAdmNotifications({ result: { rows: notReadAdmNotificationList } }) {
    this.setState({
      notReadAdmNotificationList,
      dateUpdate: {
        ...this.state.dateUpdate,
        notReadAdmNotificationList: new Date(),
      },
    });
  }

  handleMarkAsRead(readData) {
    const date = new Date();

    let {
      commonNotificationList: [...commonNotificationList],
      admNotificationList: [...admNotificationList],

      notReadAdmNotificationList: [...notReadAdmNotificationList],
    } = this.state;
    const { dateUpdate: { ...dateUpdate } } = this.state;

    const needUpdate = {
      commonNotificationList: false,
      admNotificationList: false,
      notReadAdmNotificationList: false,
    };

    if (dateUpdate.notReadAdmNotificationList && diffDates(date, dateUpdate.notReadAdmNotificationList) > 0) {
      needUpdate.notReadAdmNotificationList = true;
      dateUpdate.notReadAdmNotificationList = date;
    }
    if (dateUpdate.admNotificationList && diffDates(date, dateUpdate.admNotificationList) > 0) {
      needUpdate.admNotificationList = true;
      dateUpdate.admNotificationList = date;
    }
    if (dateUpdate.commonNotificationList && diffDates(date, dateUpdate.commonNotificationList) > 0) {
      needUpdate.commonNotificationList = true;
      dateUpdate.commonNotificationList = date;
    }

    readData.forEach(({ id, front_type }) => {
      if (front_type === 'adm') {
        if (needUpdate.notReadAdmNotificationList) {
          notReadAdmNotificationList = notReadAdmNotificationList.filter(({ id: notReadId }) => notReadId !== id);
        }
        if (needUpdate.notReadAdmNotificationList) {
          admNotificationList = admNotificationList.map(notification => ({
            ...notification,
            not_read: id === notification.id ? false : notification.not_read,
          }));
        }
      } else if (front_type === 'common') {
        if (needUpdate.notReadAdmNotificationList) {
          commonNotificationList = commonNotificationList.map(notification => ({
            ...notification,
            not_read: id === notification.id ? false : notification.not_read,
          }));
        }
      }
    });

    this.setState({
      notReadAdmNotificationList,

      admNotificationList,
      commonNotificationList,
      userNotificationList: getUserNotificationList(admNotificationList, commonNotificationList),
      dateUpdate,
    });
  }

  handleMarkAllAsRead() {
    const date = new Date();
    const { dateUpdate } = this.state;

    if (dateUpdate.notReadAdmNotificationList && diffDates(date, dateUpdate.notReadAdmNotificationList) > 0) {
      this.setState({
        notReadAdmNotificationList: [],
        dateUpdate: {
          ...this.state.dateUpdate,
          notReadAdmNotificationList: date,
        },
      });
    }
  }
}
