import { staticProps, exportable, connectToStores } from 'utils/decorators';
import ElementsList from 'components/ElementsList';
import { getToday0am, getToday2359, createValidDateTime } from 'utils/dates';
import MedicalStatsTable from 'components/directories/medical_stats/MedicalStatsTable';
import permissions from 'components/directories/medical_stats/config-data/permissions';
import { getSessionState } from 'redux-main/reducers/selectors';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import withDatePickerRangeRegistry from 'components/new/ui/date_picker/withDatePickerRangeRegistry';

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
  exportPayload = {
    date_from: createValidDateTime(this.props.date_from),
    date_to: createValidDateTime(this.props.date_to),
  };

  init() {
    const { flux } = this.context;
    flux.getActions('objects').getMedicalStats(this.state);
  }

  componentDidUpdate(prevProps) {
    const { date_from, date_to } = this.props;

    if (date_from !== prevProps.date_from || date_to !== prevProps.date_to) {
      this.exportPayload = {
        date_from,
        date_to,
      };
      this.context.flux.getActions('objects').getMedicalStats({
        date_from,
        date_to,
      });
    }
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
)(MedicalStatsList);
