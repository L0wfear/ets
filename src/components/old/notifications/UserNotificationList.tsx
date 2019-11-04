import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import { staticProps } from 'utils/decorators';
import { isEmpty } from 'utils/functions';
import UNSAFE_CheckableElementsList from 'components/old/program_registry/UNSAFE_CheckableElementsList';
import UserNotificationFormWrap from 'components/old/notifications/UserNotificationFormWrap';
import UserNotificationTable from 'components/old/notifications/UserNotificationTable';
import permissions from 'components/old/notifications/config-data/permissions';
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
import withPreloader from 'components/old/ui/new/preloader/hoc/with-preloader/withPreloader';
import { compose } from 'recompose';
import { EtsDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { ReduxState } from 'redux-main/@types/state';
import { InitialStateSession } from 'redux-main/reducers/modules/session/@types/session';

type StateProps = {
  userData: InitialStateSession['userData'];
} & ReduxState['userNotifications'];
type DispatchProps = {
  dispatch: EtsDispatch;
};
type OwnProps = {};
type Props = (
  StateProps
  & DispatchProps
  & OwnProps
);

type State = any;

@staticProps({
  entity: 'userNotification',
  permissions,
  listName: 'userNotificationList',
  tableComponent: UserNotificationTable,
  formComponent: UserNotificationFormWrap,
  operations: ['LIST', 'READ', 'CHECK'],
})
class UserNotificationList extends UNSAFE_CheckableElementsList<Props, State> {
  async init() {
    const etsName = __DEVELOPMENT__
      ? `__ETS::${process.env.STAND.toUpperCase()}__`
      : 'ЕТС';
    if (document) {
      document.title = `${etsName} Уведомления пользователей`;
    }

    try {
      await Promise.all([
        this.props.dispatch(getNotifications()),
        this.props.dispatch(getAdmNotifications()),
      ]);
    } catch (e) {
      //
    }

    this.updateCounterNotify();
  }

  componentWillUnmount() {
    const etsName = __DEVELOPMENT__
      ? `__ETS::${process.env.STAND.toUpperCase()}__`
      : 'ЕТС';

    if (document) {
      document.title = etsName;
    }
  }

  updateCounterNotify() {
    this.props.dispatch(getUserNotificationInfo());
  }

  handleMarkAllAsRead = () => {
    global.confirmDialog({
      title: 'Внимание!',
      body: 'Вы уверены, что хотите отметить все уведомления как прочитанные?',
    })
      .then(() => this.props.dispatch(markAllAsRead()))
      .then(() => this.updateCounterNotify())
      .catch(() => {
        //
      });
  };
  handleMarkAsRead = (checkedItems) => {
    this.props.dispatch(markAsRead(checkedItems)).then(() => this.updateCounterNotify());
  };
  /**
   * @override
   */
  getButtons() {
    const { userNotificationList = [] } = this.props;
    const { checkedElements = {} } = this.state;

    const baseButtons = super.getButtons();
    const checkedItems = Object.entries(checkedElements).reduce(
      (obj, [key, el]: any) => {
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
        <EtsBootstrap.Button
          key="makeIsRead"
          onClick={this.handleMarkAsRead.bind(null, checkedItems)}>
          Отметить как прочитанное
        </EtsBootstrap.Button>,
      );
    }
    buttons.push(
      <EtsBootstrap.Button
        disabled={allNotIsRead}
        key="makeIsReadAll"
        onClick={this.handleMarkAllAsRead}>
        Отметить все как прочитанные
      </EtsBootstrap.Button>,
    );
    buttons.push(...baseButtons);

    return buttons;
  }

  /**
   * @override
   */
  selectElement = ({ props }) => {
    const DOUBLECLICK_TIMEOUT = 300;

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
            this.setState({
              showForm: true,
            });
          }
        }
        this.clicks = 0;
      }, DOUBLECLICK_TIMEOUT);
    }
  };
}

export default compose(
  connect<StateProps, DispatchProps, OwnProps, ReduxState>(
    (state: ReduxState) => ({
      ...getUserNotificationsState(state),
      userData: getSessionState(state).userData,
    }),
  ),
  withPreloader({
    page: 'notification-registry',
    typePreloader: 'mainpage',
  }),
)(UserNotificationList);
