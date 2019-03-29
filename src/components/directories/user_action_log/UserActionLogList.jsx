import { connectToStores, staticProps, exportable } from 'utils/decorators';
import ElementsList from 'components/ElementsList';
import { getToday0am, getToday2359 } from 'utils/dates';
import UserActionLogTable from 'components/directories/user_action_log/UserActionLogTable';
import permissions from 'components/directories/user_action_log/config-data/permissions';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { getSessionState } from 'redux-main/reducers/selectors';
import withDatePickerRangeRegistry from 'components/new/ui/date_picker/withDatePickerRangeRegistry';

@connectToStores(['objects'])
@exportable({ entity: 'user_action_log' })
@staticProps({
  entity: 'user_action_log',
  permissions,
  listName: 'userActionLogList',
  tableComponent: UserActionLogTable,
  operations: ['LIST'],
})
class UserActionLogList extends ElementsList {
  constructor(props) {
    super(props);

    const { date_from, date_to } = this.props;

    this.exportPayload = {
      date_start: date_from,
      date_end: date_to,
    };
  }

  init() {
    const { date_from, date_to } = this.props;

    this.getUserActionLog({
      date_start: date_from,
      date_end: date_to,
    });
  }

  componentDidUpdate(prevProps) {
    const { date_from, date_to } = this.props;

    if (date_from !== prevProps.date_from || date_to !== prevProps.date_to) {
      this.exportPayload = {
        date_start: date_from,
        date_end: date_to,
      };
      this.getUserActionLog({
        date_start: date_from,
        date_end: date_to,
      });
    }
  }

  getUserActionLog(state) {
    this.context.flux.getActions('objects').getUserActionLog(state);
  }
}

export default compose(
  withDatePickerRangeRegistry({
    init_date_from: getToday0am(),
    init_date_to: getToday2359(),
  }),
  connect((state) => ({
    userData: getSessionState(state).userData,
  })),
)(UserActionLogList);
