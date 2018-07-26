import { Store } from 'flummox';
import {
  diffDates,
} from 'utils/dates';
import uniqBy from 'lodash/uniqBy';

const TYPE_GROUP = {
  personal: {
    arr: 'orderNotReadList',
    dependent: 'commonNotificationList',
  },
  common: {
    arr: 'admNotReadNotificationsList',
    dependent: 'admNotificationList',
  },
};

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

    this.register(userNotificationActions.setMakeReadOrderNotification, this.handlesetMakeReadOrderNotification);

    this.register(userNotificationActions.setMakeReadAdmNotification, this.handleSetMakeReadAdmNotification);


    this.register(userNotificationActions.getUserNotificationInfo, this.handleGetUserNotificationInfo);
    this.register(userNotificationActions.setNotifyFromWs, this.handleSetNotifyFromWs);

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
  handleSetNotifyFromWs(notify) {
    const { group } = notify;

    let {
      [TYPE_GROUP[group].arr]: [...newArr],
      [TYPE_GROUP[group].dependent]: [...newDependent],
    } = this.state;

    newArr.push(notify);
    newDependent.push(notify);

    newArr = uniqBy(newArr, 'id');
    newDependent = uniqBy(newArr, 'id');
    const calculateData = {
      admNotificationList: this.state.admNotificationList,
      commonNotificationList: this.state.commonNotificationList,
      [TYPE_GROUP[group].dependent]: newDependent,
    };

    this.setState({
      [TYPE_GROUP[group].arr]: newArr,
      [TYPE_GROUP[group].dependent]: newDependent,
      userNotificationList: getUserNotificationList(calculateData.commonNotificationList, calculateData.admNotificationList),
    });
  }
  handleGetNotifications({ result: { rows } }) {
    const changedState = {
      commonNotificationList: [],
    };
    let hasChangeInOrder = false;
    const { orderNotReadList: [...orderNotReadList] } = this.state;

    rows.forEach((notification) => {
      changedState.commonNotificationList.push({
        ...notification,
        front_type: 'common',
      });

      if (notification.type_id === 6 && !notification.is_read) {
        hasChangeInOrder = true;
        orderNotReadList.push(notification);
      }
    });

    if (hasChangeInOrder) {
      changedState.orderNotReadList = uniqBy(orderNotReadList, 'id').sort((a, b) => a.id - b.id);
    }

    this.setState({
      ...changedState,
      userNotificationList: getUserNotificationList(changedState.commonNotificationList, this.state.admNotificationList),
    });
  }
  handleGetAdmNotifications({ result: { rows } }) {
    const changedState = {
      admNotificationList: [],
    };
    let hasChangeInAdm = false;
    const { admNotReadNotificationsList: [...admNotReadNotificationsList] } = this.state;

    rows.forEach((notification) => {
      changedState.admNotificationList.push({
        ...notification,
        front_type: 'adm',
      });

      if (!notification.is_read) {
        hasChangeInAdm = true;
        admNotReadNotificationsList.push(notification);
      }
    });

    if (hasChangeInAdm) {
      changedState.admNotReadNotificationsList = uniqBy(admNotReadNotificationsList, 'id').sort((a, b) => a.id - b.id);
    }

    this.setState({
      ...changedState,
      userNotificationList: getUserNotificationList(this.state.commonNotificationList, changedState.admNotificationList),
    });
  }

  handlesetMakeReadOrderNotification(id) {
    const orderNotReadList = this.state.orderNotReadList.filter(notifyData => notifyData.id !== id).sort((a, b) => a.id - b.id);
    const commonNotificationList = this.state.commonNotificationList.map(common => ({ ...common, is_read: common.id === id ? true : common.is_read }));
    const userNotificationList = getUserNotificationList(commonNotificationList, this.state.admNotificationList);

    this.setState({
      orderNotReadList,
      commonNotificationList,
      userNotificationList,
      countNotRead: this.state.countNotRead - 1,
    });
  }

  handleSetMakeReadAdmNotification(id) {
    const admNotReadNotificationsList = this.state.admNotReadNotificationsList.filter(notifyData => notifyData.id !== id).sort((a, b) => a.id - b.id);
    const admNotificationList = this.state.admNotificationList.map(common => ({ ...common, is_read: common.id === id ? true : common.is_read }));
    const userNotificationList = getUserNotificationList(admNotificationList, this.state.commonNotificationList);

    this.setState({
      admNotReadNotificationsList,
      admNotificationList,
      userNotificationList,
      countNotRead: this.state.countNotRead - 1,
    });
  }

  handleMarkAsRead([commonAns, admAns]) {
    const { result: { rows: commonNotificationList = [], notUpdate: commonNotUpdate } } = commonAns;
    const { result: { rows: admNotificationList = [], notUpdate: admNotUpdate } } = admAns;

    const changedObj = {};
    if (!commonNotUpdate) {
      changedObj.commonNotificationList = commonNotificationList;
      changedObj.orderNotReadList = this.state.orderNotReadList.filter(({ id }) => (
        (commonNotificationList.find(common => common.id === id) || {}).not_read
      ));
    }
    if (!admNotUpdate) {
      changedObj.admNotificationList = admNotificationList;
      changedObj.admNotReadNotificationsList = this.state.admNotReadNotificationsList.filter(({ id }) => (
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
