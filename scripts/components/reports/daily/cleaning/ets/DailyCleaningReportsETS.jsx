import React, { Component, PropTypes } from 'react';
import { getToday9am, getTomorrow9am } from 'utils/dates';
import { getReportNotReadyNotification2 } from 'utils/notifications';
import DailyReportHeader from 'components/reports/DailyReportHeader.jsx';
import { FluxContext, HistoryContext, staticProps, connectToStores } from 'utils/decorators';
import DailyCleaningReportsETSTable from './DailyCleaningReportsETSTable.jsx';

@connectToStores(['reports'])
@FluxContext
@HistoryContext
@staticProps({
  entity: 'geozone_element_traveled_daily_report__ets',
})
export default class DailyCleaningReportsETS extends Component {

  static get propTypes() {
    return {
      dailyCleaningReportsListETS: PropTypes.array,
    };
  }

  constructor(props) {
    super(props);

    const [date_start, date_end] = [getToday9am(), getTomorrow9am()];

    this.state = {
      date_start,
      date_end,
      geozone_type: 'odh',
      element: 'roadway',
      car_type_id_list: [],
    };
  }

  componentDidMount() {
    const { flux } = this.context;
    flux.getActions('reports').getDailyCleaningReportsETS();
  }

  onReportSelect({ props }) {
    const id = props.data.id;
    if (props.data.status !== 'success' && props.data.status !== 'fail') {
      global.NOTIFICATION_SYSTEM.addNotification(getReportNotReadyNotification2(this.context.flux));
    } else if (props.data.status !== 'fail') {
      this.context.history.pushState(null, `/daily-cleaning-report-ets/${props.data.element}/${id}`);
    }
  }

  handleChange(field, value) {
    this.setState({ [field]: value });
  }

  createDailyCleaningReportETS() {
    const { flux } = this.context;
    flux.getActions('reports').createDailyCleaningReportETS(this.state);
  }

  render() {
    const { dailyCleaningReportsListETS = [] } = this.props;

    return (
      <div className="ets-page-wrap">
        <DailyReportHeader
          handleChange={this.handleChange.bind(this)}
          onClick={this.createDailyCleaningReportETS.bind(this)}
          {...this.state}
        />
        <DailyCleaningReportsETSTable
          data={dailyCleaningReportsListETS}
          refreshable
          onRefresh={() => this.context.flux.getActions('reports').getDailyCleaningReportsETS()}
          onRowSelected={this.onReportSelect.bind(this)}
        />
      </div>
    );
  }
}
