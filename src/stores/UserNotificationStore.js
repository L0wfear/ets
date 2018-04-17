import { Store } from 'flummox';

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

export default class UserNotificationStore extends Store {

  constructor(flux) {
    super();

    const userNotificationActions = flux.getActions('userNotifications');

    this.register(userNotificationActions.getNotifications, this.handleGetNotifications);
    this.register(userNotificationActions.getNotificationsPopup, this.handleGetNotificationsPopup);
    this.register(userNotificationActions.decNotificationsPopup, this.handleDecNotificationsPopup);
    this.register(userNotificationActions.getUserNotificationInfo, this.handleGetUserNotificationInfo);
    this.register(userNotificationActions.changesUserNotificationsCount, this.handleChangesUserNotificationsCount)
    this.state = {
      notificationPopupList: [],
      userNotificationList: [],
      countNotRead: 0,
      hasNewOrderNotifications: false,
    };
  }
  handleGetNotificationsPopup({ result: { rows = [] } }) {
    const { notificationPopupList: notificationPopupListOld } = this.state;
    const notificationPopupIndexOld = notificationPopupListOld.reduce((newObj, { id, ...other }) => ({ ...newObj, [id]: { ...other } }), {});
    const notificationPopupList = rows;

    this.setState({
      notificationPopupList,
      notificationPopupLast: notificationPopupList.slice(-1),
      hasNewOrderNotifications: notificationPopupList.some(({ id }) => !notificationPopupIndexOld[id]),
    });
  }
  handleDecNotificationsPopup() {
    const notificationPopupList = [...this.state.notificationPopupList].slice(0, -1);
    const notificationPopupLast = notificationPopupList.slice(-1);
    this.setState({
      notificationPopupList,
      notificationPopupLast,
      hasNewOrderNotifications: false,
    });
  }
  handleGetNotifications({ result }) {
    this.setState({ userNotificationList: result.rows });
  }

  handleGetUserNotificationInfo({ result }) {
    const { rows: { not_read_num = 0 } } = result;
    this.setState({
      countNotRead: not_read_num,
    });
  }

  handleChangesUserNotificationsCount({ count = 0 }) {
    const { countNotRead } = this.state;
    const newCountNotReadNumPrev = this.changeNotification(count, countNotRead);
    const newCountNotReadNum = newCountNotReadNumPrev < 0 ? 0 : newCountNotReadNumPrev;

    this.setState({
      countNotRead: newCountNotReadNum,
    });
  }

  changeNotification(count, countNotRead) {
    if (count === 'is_read_all') return 0;
    return countNotRead + count;
  }
}
