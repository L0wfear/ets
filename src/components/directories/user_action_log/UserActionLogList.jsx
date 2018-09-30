import React from 'react';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import ElementsList from 'components/ElementsList';
import Datepicker from 'components/ui/input/date-picker/DatePicker';
import { getToday0am, getToday2359, createValidDateTime } from 'utils/dates';
import UserActionLogTable from 'components/directories/user_action_log/UserActionLogTable';
import permissions from 'components/directories/user_action_log/config-data/permissions';

@connectToStores(['objects', 'session'])
@exportable({ entity: 'user_action_log' })
@staticProps({
  entity: 'user_action_log',
  permissions,
  listName: 'userActionLogList',
  tableComponent: UserActionLogTable,
  operations: ['LIST'],
})
export default class UserActionLogList extends ElementsList {

  init() {
    const state = {
      date_start: getToday0am(),
      date_end: getToday2359(),
    };
    this.setState(state);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.date_start !== prevState.date_start || this.state.date_end !== prevState.date_end) {
      this.exportPayload = {
        date_start: createValidDateTime(this.state.date_start),
        date_end: createValidDateTime(this.state.date_end),
      };
      this.context.flux.getActions('objects').getMedicalStats(this.state);
    }
  }

  getUserActionLog(state) {
    this.context.flux.getActions('objects').getUserActionLog(state);
  }

  additionalRender() {
    const { date_start, date_end } = this.state;
    return (
      <div className="log-interval-picker">
        <div className="inline-block faxogramms-date">
          <Datepicker date={date_start} onChange={v => this.setState({ date_start: v })} />
        </div>
        <div className="date-divider">—</div>
        <div className="inline-block">
          <Datepicker date={date_end} onChange={v => this.setState({ date_end: v })} />
        </div>
      </div>
    );
  }
}
