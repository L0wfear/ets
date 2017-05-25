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
    mission_date_start_from: getToday0am(),
    mission_date_end_to: getToday2359(),
  }

  exportPayload = {
    mission_date_start_from: createValidDateTime(this.state.mission_date_start_from),
    mission_date_end_to: createValidDateTime(this.state.mission_date_end_to),
  };

  async componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    await flux.getActions('objects').getMedicalStats(this.state);
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.mission_date_start_from !== nextState.mission_date_start_from || this.state.mission_date_end_to !== nextState.mission_date_end_to) {
      this.exportPayload = {
        mission_date_start_from: createValidDateTime(nextState.mission_date_start_from),
        mission_date_end_to: createValidDateTime(nextState.mission_date_end_to),
      };
      this.context.flux.getActions('objects').getMedicalStats(nextState);
    }
  }

  additionalRender() {
    const { mission_date_start_from, mission_date_end_to } = this.state;
    return (
      <div className="log-interval-picker">
        <div className="inline-block faxogramms-date">
          <Datepicker date={mission_date_start_from} onChange={v => this.setState({ mission_date_start_from: v })} />
        </div>
        <div className="date-divider">—</div>
        <div className="inline-block">
          <Datepicker date={mission_date_end_to} onChange={v => this.setState({ mission_date_end_to: v })} />
        </div>
      </div>
    );
  }
}
