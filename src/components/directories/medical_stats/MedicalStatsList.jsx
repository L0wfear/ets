import React from 'react';
import { staticProps, exportable, connectToStores } from 'utils/decorators';
import ElementsList from 'components/ElementsList';
import Datepicker from 'components/ui/input/date-picker/DatePicker';
import { getToday0am, getToday2359, createValidDateTime } from 'utils/dates';
import MedicalStatsTable from 'components/directories/medical_stats/MedicalStatsTable';
import permissions from 'components/directories/medical_stats/config-data/permissions';
import { getSessionState } from 'redux-main/reducers/selectors';
import { compose } from 'recompose';
import { connect } from 'react-redux';

@connectToStores(['objects'])
@exportable({ entity: 'medical_stats' })
@staticProps({
  entity: 'medical_stats',
  permissions,
  listName: 'medicalStatsList',
  tableComponent: MedicalStatsTable,
  operations: ['LIST'],
})
class MedicalStatsList extends ElementsList {
  state = {
    date_from: getToday0am(),
    date_to: getToday2359(),
  }

  exportPayload = {
    date_from: createValidDateTime(this.state.date_from),
    date_to: createValidDateTime(this.state.date_to),
  };

  init() {
    const { flux } = this.context;
    flux.getActions('objects').getMedicalStats(this.state);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.date_from !== prevState.date_from || this.state.date_to !== prevState.date_to) {
      this.exportPayload = {
        date_from: createValidDateTime(this.state.date_from),
        date_to: createValidDateTime(this.state.date_to),
      };
      this.context.flux.getActions('objects').getMedicalStats(this.state);
    }
  }

  additionalRender() {
    const { date_from, date_to } = this.state;
    return (
      <div className="log-interval-picker">
        <div className="datepicker-range">
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

export default compose(
  connect(
    state => ({
      userData: getSessionState(state).userData,
    }),
  ),
)(MedicalStatsList);
