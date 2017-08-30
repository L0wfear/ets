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

    this.state = {
      userNotificationList: [],
    };
  }
  handleGetNotifications({ result }) {
    this.setState({ userNotificationList: result.rows });
  }
}
