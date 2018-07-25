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
    this.register(userNotificationActions.markAsRead, this.handleMarkAsRead);
    this.register(userNotificationActions.markAllAsRead, this.handleMarkAsRead);

    this.register(userNotificationActions.getOrderNotReadNotifications, this.handleGetOrderNotReadNotifications);
    this.register(userNotificationActions.setMakeReadOrderNotification, this.handlesetMakeReadOrderNotification);
    
    this.register(userNotificationActions.getAdmNotReadNotifications, this.handleGetAdmNotReadNotifications);
    this.register(userNotificationActions.setMakeReadAdmNotification, this.handleSetMakeReadAdmNotification);
    

    this.register(userNotificationActions.getUserNotificationInfo, this.handleGetUserNotificationInfo);
    
    this.state = {
      commonNotificationList: [],
      userNotificationList: [],
      admNotificationList: [],

      notReadAdmNotificationList: [],

      orderNotReadList: [],
      admNotReadNotificationsList: [],

      countNotRead: 0,
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
    });
  }

  handleGetOrderNotReadNotifications({ result: { rows } }) {
    const orderNotReadList = rows.sort((a, b) => a.id - b.id);

    this.setState({
      orderNotReadList,
    });
  }
  handlesetMakeReadOrderNotification(id) {
    const orderNotReadList = this.state.orderNotReadList.filter(notifyData => notifyData.id !== id).sort((a, b) => a.id - b.id);
    const commonNotificationList = this.state.commonNotificationList.map((common) => ({ ...common, is_read: common.id === id ? true : common.is_read }));
    const userNotificationList = getUserNotificationList(commonNotificationList, this.state.admNotificationList);

    this.setState({
      orderNotReadList,
      commonNotificationList,
      userNotificationList,
      countNotRead: this.state.countNotRead - 1,
    });
  }
  handleGetAdmNotReadNotifications({ result: { rows } }) {
    const admNotReadNotificationsList = rows.sort((a, b) => a.id - b.id);

    this.setState({
      admNotReadNotificationsList,
    });
  }
  handleSetMakeReadAdmNotification(id) {
    const orderNotReadList = this.state.orderNotReadList.filter(notifyData => notifyData.id !== id).sort((a, b) => a.id - b.id);
    const admNotificationList = this.state.admNotificationList.map((common) => ({ ...common, is_read: common.id === id ? true : common.is_read }));
    const userNotificationList = getUserNotificationList(admNotificationList, this.state.commonNotificationList);

    this.setState({
      orderNotReadList,
      admNotificationList,
      userNotificationList,
      countNotRead: this.state.countNotRead - 1,
    });
  }

  handleMarkAsRead([commonAns, admAns]) {
    console.log(commonAns, admAns)
    const { result: { rows: commonNotificationList = [], notUpdate: commonNotUpdate } } = commonAns;
    const { result: { rows: admNotificationList = [], notUpdate: admNotUpdate } } = admAns;

    const changedObj = {};
    if (!commonNotUpdate) {
      const { orderNotReadList } = this.state;

      changedObj.commonNotificationList;
      changedObj.orderNotReadList = this.state.orderNotReadList.filter(({ id, not_read }) => (
        (commonNotificationList.find(common => common.id === id) || {}).not_read
      ));
    }
    if (!admNotUpdate) {
      changedObj.admNotificationList;
      changedObj.admNotReadNotificationsList = this.state.admNotReadNotificationsList.filter(({ id, not_read }) => (
        (admNotificationList.find(common => common.id === id) || {}).not_read
      ));
    }

    changedObj.userNotificationList = getUserNotificationList(changedObj.admNotificationList || this.state.admNotificationList, changedObj.commonNotificationList || this.state.commonNotificationList)
    changedObj.countNotRead = changedObj.userNotificationList.filter(({ is_read }) => !is_read).length;

    this.setState(changedObj);
  }

  handleGetUserNotificationInfo({ result: { rows: { not_read_num } } }) {
    this.setState({
      countNotRead: not_read_num,
    });
  }
}
