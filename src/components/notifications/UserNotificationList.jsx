import * as React from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';

import { connectToStores, staticProps } from 'utils/decorators';
import { isEmpty } from 'utils/functions';
import CheckableElementsList from 'components/CheckableElementsList';
import UserNotificationFormWrap from './UserNotificationFormWrap';
import UserNotificationTable from './UserNotificationTable';

@connectToStores(['userNotifications'])
@staticProps({
  entity: 'userNotification',
  listName: 'userNotificationList',
  tableComponent: UserNotificationTable,
  formComponent: UserNotificationFormWrap,
  operations: ['LIST', 'READ', 'CHECK'],
})
export default class UserNotificationList extends CheckableElementsList {
  async componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;

    flux.getActions('userNotifications').getNotifications();
  }
  handleMarkAllAsRead = () => {
    confirmDialog({
      title: 'Внимание!',
      body: 'Вы уверены, что хотите отметить все уведомления как прочитанные?',
    })
    .then(() => {
      this.context.flux.getActions('userNotifications').markAllAsRead();
    })
    .catch(() => {});
  }
  handleMarkAsRead = (checkedItems) => {
    this.context.flux.getActions('userNotifications').markAsRead(
      checkedItems,
    );
  }
  /**
   * @override
   */
  getButtons() {
    const { userNotificationList = [] } = this.props;
    const {
      checkedElements = {},
    } = this.state;

    const baseButtons = super.getButtons();
    const checkedItems = Object.entries(checkedElements).reduce((obj, [key, el]) => {
      if (!el.is_read) {
        obj.push(parseInt(key, 10));
      }

      return obj;
    }, []);
    const allNotIsRead = !isEmpty(checkedItems) && !userNotificationList.some(oneN => !oneN.is_read);

    const buttons = [
      <ButtonToolbar key={baseButtons.length}>
        {checkedItems.length > 0 && <Button onClick={this.handleMarkAsRead.bind(null, checkedItems)}>Отметить как прочитанное</Button>}
        <Button disabled={allNotIsRead} onClick={this.handleMarkAllAsRead}>Отметить все как прочитанные</Button>
      </ButtonToolbar>,
      ...baseButtons,
    ];

    return buttons;
  }
}
