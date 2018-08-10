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

    this.register(userNotificationActions.setMakeReadOrderNotification, this.handleSetMakeReadOrderNotification);

    this.register(userNotificationActions.setMakeReadAdmNotification, this.handleSetMakeReadAdmNotification);


    this.register(userNotificationActions.getUserNotificationInfo, this.handleGetUserNotificationInfo);

    this.register(userNotificationActions.getOrderNotRead, this.handleSetNotifyFromArr);
    this.register(userNotificationActions.getAdmNotReadNotifications, this.handleSetNotifyFromArr);
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

  handleSetNotifyFromArr({ result: { rows }, group }) {
    this.handleSetNotifyFromWs(rows.map(r => ({ ...r, group })));
  }
  handleSetNotifyFromWs(props) {
    let notifyArr = props;
    if (!Array.isArray(notifyArr)) {
      notifyArr = [notifyArr];
    }

    const {
      commonNotificationList: [...commonNotificationList],
      admNotificationList: [...admNotificationList],
      orderNotReadList: [...orderNotReadList],
      admNotReadNotificationsList: [...admNotReadNotificationsList],
    } = this.state;

    const changedState = {
      commonNotificationList,
      admNotificationList,
      orderNotReadList,
      admNotReadNotificationsList,
    };

    notifyArr.forEach((notify) => {
      const { group } = notify;
      if (TYPE_GROUP[group]) {
        changedState[TYPE_GROUP[group].arr].push(notify);
        changedState[TYPE_GROUP[group].dependent].push(notify);

        changedState[TYPE_GROUP[group].arr] = uniqBy(changedState[TYPE_GROUP[group].arr], 'id');
        changedState[TYPE_GROUP[group].dependent] = uniqBy(changedState[TYPE_GROUP[group].dependent], 'id');
      } else {
        throw new Error(`type ${group} not found in TYPE_GROUP`);
      }
    });

    this.setState({
      ...changedState,
      userNotificationList: getUserNotificationList(changedState.commonNotificationList, changedState.admNotificationList),
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

    changedState.userNotificationList = getUserNotificationList(changedState.commonNotificationList, this.state.admNotificationList);

    this.setState(changedState);
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

    changedState.userNotificationList = getUserNotificationList(this.state.commonNotificationList, changedState.admNotificationList);

    this.setState(changedState);
  }

  handleSetMakeReadOrderNotification(id) {
    const orderNotReadList = this.state.orderNotReadList.filter(notifyData => notifyData.id !== id).sort((a, b) => a.id - b.id);
    const commonNotificationList = this.state.commonNotificationList.map(common => ({ ...common, is_read: common.id === id ? true : common.is_read }));
    const userNotificationList = getUserNotificationList(commonNotificationList, this.state.admNotificationList);

    this.setState({
      orderNotReadList,
      commonNotificationList,
      userNotificationList,
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
    });
  }

  handleMarkAsRead([commonAns, admAns]) {
    const { result: { rows: commonNotificationList = [], notUpdate: commonNotUpdate } } = commonAns;
    const { result: { rows: admNotificationList = [], notUpdate: admNotUpdate } } = admAns;

    const changedObj = {};
    if (!commonNotUpdate) {
      changedObj.commonNotificationList = commonNotificationList.map(notification => ({
        ...notification,
        front_type: 'common',
      }));
      changedObj.orderNotReadList = this.state.orderNotReadList.filter(({ id }) => (
        !(commonNotificationList.find(common => common.id === id) || {}).is_read
      ));
    }
    if (!admNotUpdate) {
      changedObj.admNotificationList = admNotificationList.map(notification => ({
        ...notification,
        front_type: 'adm',
      }));
      changedObj.admNotReadNotificationsList = this.state.admNotReadNotificationsList.filter(({ id }) => (
        !(admNotificationList.find(common => common.id === id) || {}).is_read
      ));
    }

    changedObj.userNotificationList = getUserNotificationList(changedObj.admNotificationList || this.state.admNotificationList, changedObj.commonNotificationList || this.state.commonNotificationList)

    this.setState(changedObj);
  }

  handleGetUserNotificationInfo({ result: { rows: { not_read_num: countNotRead } } }) {
    this.setState({
      countNotRead,
    });
  }
}
