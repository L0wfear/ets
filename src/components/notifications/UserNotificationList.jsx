import * as React from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';
import map from 'lodash/map';

import { connectToStores, staticProps } from 'utils/decorators';
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
      title: 'Внимание',
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
    const baseButtons = super.getButtons();
    const checkedItems = Object.entries(this.state.checkedElements).reduce((obj, [key, el]) => {
      if (!el.is_read) {
        obj.push(parseInt(key, 10));
      }

      return obj;
    }, []);

    const buttons = [
      <ButtonToolbar key={baseButtons.length}>
        {checkedItems.length > 0 && <Button onClick={this.handleMarkAsRead.bind(null, checkedItems)}>Отметить как прочитанное</Button>}
        <Button onClick={this.handleMarkAllAsRead}>Отметить все как прочитанные</Button>
      </ButtonToolbar>,
      ...baseButtons,
    ];

    return buttons;
  }
}
