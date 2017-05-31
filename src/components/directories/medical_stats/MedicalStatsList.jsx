import React from 'react';
import { staticProps, exportable, connectToStores } from 'utils/decorators';
import ElementsList from 'components/ElementsList.jsx';
import Datepicker from 'components/ui/DatePicker.jsx';
import { getToday0am, getToday2359, createValidDateTime } from 'utils/dates';
import MedicalStatsTable from './MedicalStatsTable.jsx';

@connectToStores(['objects', 'session'])
@exportable({ entity: 'medical_stats' })
@staticProps({
  entity: 'medical_stats',
  listName: 'medicalStatsList',
  tableComponent: MedicalStatsTable,
  operations: ['LIST'],
})
export default class MedicalStatsList extends ElementsList {

  state = {
    date_from: getToday0am(),
    date_to: getToday2359(),
  }

  exportPayload = {
    date_from: createValidDateTime(this.state.date_from),
    date_to: createValidDateTime(this.state.date_to),
  };

  async componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    await flux.getActions('objects').getMedicalStats(this.state);
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.date_from !== nextState.date_from || this.state.date_to !== nextState.date_to) {
      this.exportPayload = {
        date_from: createValidDateTime(nextState.date_from),
        date_to: createValidDateTime(nextState.date_to),
      };
      this.context.flux.getActions('objects').getMedicalStats(nextState);
    }
  }

  additionalRender() {
    const { date_from, date_to } = this.state;
    return (
      <div className="log-interval-picker">
        <div className="inline-block faxogramms-date">
          <Datepicker date={date_from} onChange={v => this.setState({ date_from: v })} />
        </div>
        <div className="date-divider">—</div>
        <div className="inline-block">
          <Datepicker date={date_to} onChange={v => this.setState({ date_to: v })} />
        </div>
      </div>
    );
  }
}
