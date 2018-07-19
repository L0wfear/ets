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
    flux.getActions('userNotifications').getAdmNotifications();
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
    this.context.flux.getActions('userNotifications').markAsRead(checkedItems);
  }
  /**
   * @override
   */
  getButtons() {
    const baseButtons = super.getButtons();
    const checkedItems = map(this.state.checkedElements, ({ front_type }, key) => ({ id: parseInt(key, 10), front_type }));
    const buttons = [
      <ButtonToolbar key={baseButtons.length}>
        {checkedItems.length > 0 && <Button onClick={this.handleMarkAsRead.bind(null, checkedItems)}>Отметить как прочитанное</Button>}
        <Button onClick={this.handleMarkAllAsRead}>Отметить все как прочитанные</Button>
      </ButtonToolbar>,
      ...baseButtons,
    ];

    return buttons;
  }

  /**
   * @override
   */
  selectElement = ({ props }) => {
    const DOUBLECLICK_TIMEOUT = 300;
    function onDoubleClick() {
      return this.setState({
        showForm: true,
      });
    }
    const { data: { ...data } } = props;

    const { is_read, id, front_type } = data;
    if (!is_read) {
      this.handleMarkAsRead([{ id, front_type }]);
    }
    data.is_read = false;

    if (props.fromKey) {
      const selectedElement = this.state.elementsList.find(el => el.id === id);
      if (selectedElement) {
        this.setState({ selectedElement });
      }
      return;
    }

    this.clicks += 1;

    if (this.clicks === 1) {
      const selectedElement = this.state.elementsList.find(el => el.id === id);

      this.setState({ selectedElement });
      setTimeout(() => {
        // В случае если за DOUBLECLICK_TIMEOUT (мс) кликнули по одному и тому же элементу больше 1 раза
        if (this.clicks !== 1) {
          if (this.state.selectedElement && id === this.state.selectedElement[this.selectField] && this.state.readPermission) {
            onDoubleClick.call(this);
          }
        }
        this.clicks = 0;
      }, DOUBLECLICK_TIMEOUT);
    }
  }
}
