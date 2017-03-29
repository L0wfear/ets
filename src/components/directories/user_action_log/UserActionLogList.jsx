import React from 'react';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import ElementsList from 'components/ElementsList.jsx';
import Datepicker from 'components/ui/DatePicker.jsx';
import { getToday0am, getToday2359, createValidDateTime } from 'utils/dates';
import UserActionLogTable from './UserActionLogTable.jsx';

@connectToStores(['objects', 'session'])
@exportable({ entity: 'user_action_log' })
@staticProps({
  entity: 'user_action_log',
  listName: 'userActionLogList',
  tableComponent: UserActionLogTable,
  operations: ['LIST'],
})
export default class UserActionLogList extends ElementsList {

  state = {
    date_start: getToday0am(),
    date_end: getToday2359(),
  }

  exportPayload = {
    date_start: createValidDateTime(this.state.date_start),
    date_end: createValidDateTime(this.state.date_end),
  };

  async componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    await flux.getActions('objects').getUserActionLog(this.state);
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.date_start !== nextState.date_start || this.state.date_end !== nextState.date_end) {
      this.exportPayload = {
        date_start: createValidDateTime(nextState.date_start),
        date_end: createValidDateTime(nextState.date_end),
      };
      this.context.flux.getActions('objects').getUserActionLog(nextState);
    }
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
