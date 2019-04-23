import * as React from 'react';
import * as Button from 'react-bootstrap/lib/Button';

import { staticProps } from 'utils/decorators';
import { isEmpty } from 'utils/functions';
import UNSAFE_CheckableElementsList from 'components/program_registry/UNSAFE_CheckableElementsList';
import UserNotificationFormWrap from 'components/notifications/UserNotificationFormWrap';
import UserNotificationTable from 'components/notifications/UserNotificationTable';
import permissions from 'components/notifications/config-data/permissions';
import { connect } from 'react-redux';
import {
  getUserNotificationInfo,
  getNotifications,
  getAdmNotifications,
  markAllAsRead,
  markAsRead,
} from 'redux-main/reducers/modules/user_notifications/actions-user_notifications';
import {
  getUserNotificationsState,
  getSessionState,
} from 'redux-main/reducers/selectors';
import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';
import { compose } from 'recompose';

@staticProps({
  entity: 'userNotification',
  permissions,
  listName: 'userNotificationList',
  tableComponent: UserNotificationTable,
  formComponent: UserNotificationFormWrap,
  operations: ['LIST', 'READ', 'CHECK'],
})
class UserNotificationList extends UNSAFE_CheckableElementsList {
  async init() {
    try {
      await Promise.all([
        this.props.getNotifications(),
        this.props.getAdmNotifications(),
      ]);
    } catch (e) {
      //
    }

    this.updateCounterNotify();
  }

  updateCounterNotify() {
    this.props.getUserNotificationInfo();
  }

  handleMarkAllAsRead = () => {
    confirmDialog({
      title: 'Внимание!',
      body: 'Вы уверены, что хотите отметить все уведомления как прочитанные?',
    })
      .then(() => {
        this.props.markAllAsRead();
      })
      .then(() => this.updateCounterNotify())
      .catch(() => {});
  };
  handleMarkAsRead = (checkedItems) => {
    this.props.markAsRead(checkedItems).then(() => this.updateCounterNotify());
  };
  /**
   * @override
   */
  getButtons() {
    const { userNotificationList = [] } = this.props;
    const { checkedElements = {} } = this.state;

    const baseButtons = super.getButtons();
    const checkedItems = Object.entries(checkedElements).reduce(
      (obj, [key, el]) => {
        if (!el.is_read) {
          obj.push({ id: parseInt(key, 10), front_type: el.front_type });
        }

        return obj;
      },
      [],
    );
    const allNotIsRead
      = !isEmpty(checkedItems)
      && !userNotificationList.some((oneN) => !oneN.is_read);
    const buttons = [];

    if (checkedItems.length > 0) {
      buttons.push(
        <Button
          key="makeIsRead"
          onClick={this.handleMarkAsRead.bind(null, checkedItems)}>
          Отметить как прочитанное
        </Button>,
      );
    }
    buttons.push(
      <Button
        disabled={allNotIsRead}
        key="makeIsReadAll"
        onClick={this.handleMarkAllAsRead}>
        Отметить все как прочитанные
      </Button>,
    );
    buttons.push(...baseButtons);

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
    const {
      data: { ...data },
    } = props;

    const { is_read, id, front_type } = data;
    if (!is_read) {
      this.handleMarkAsRead([{ id, front_type }]);
    }
    data.is_read = false;

    if (props.fromKey) {
      const selectedElement = this.state.elementsList.find(
        (el) => el.id === id,
      );
      if (selectedElement) {
        this.setState({ selectedElement });
      }
      return;
    }

    this.clicks += 1;

    if (this.clicks === 1) {
      const selectedElement = this.state.elementsList.find(
        (el) => el.id === id,
      );

      this.setState({ selectedElement });
      setTimeout(() => {
        // В случае если за DOUBLECLICK_TIMEOUT (мс) кликнули по одному и тому же элементу больше 1 раза
        if (this.clicks !== 1) {
          if (
            this.state.selectedElement
            && id === this.state.selectedElement[this.selectField]
            && this.state.readPermission
          ) {
            onDoubleClick.call(this);
          }
        }
        this.clicks = 0;
      }, DOUBLECLICK_TIMEOUT);
    }
  };
}

export default compose(
  connect(
    (state) => ({
      ...getUserNotificationsState(state),
      userData: getSessionState(state).userData,
    }),
    (dispatch) => ({
      getUserNotificationInfo: () => dispatch(getUserNotificationInfo()),
      getNotifications: () => dispatch(getNotifications()),
      getAdmNotifications: () => dispatch(getAdmNotifications()),
      markAllAsRead: () => dispatch(markAllAsRead()),
      markAsRead: (id) => dispatch(markAsRead(id)),
    }),
  ),
  withPreloader({
    page: 'notification-registry',
    typePreloader: 'mainpage',
  }),
)(UserNotificationList);
