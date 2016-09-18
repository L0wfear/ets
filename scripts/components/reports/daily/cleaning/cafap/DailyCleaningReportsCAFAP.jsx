import React, { Component } from 'react';
import { getToday9am, getTomorrow9am } from 'utils/dates';
import { getReportNotReadyNotification2 } from 'utils/notifications';
import DailyReportHeader from 'components/reports/DailyReportHeader.jsx';
import _ from 'lodash';
import { FluxContext, HistoryContext, staticProps, connectToStores } from 'utils/decorators';
import DailyCleaningReportsCAFAPTable from './DailyCleaningReportsCAFAPTable.jsx';

@connectToStores(['reports'])
@FluxContext
@HistoryContext
@staticProps({
  entity: 'geozone_element_traveled_daily_report__cafap',
})
export default class DailyCleaningReportsCAFAP extends Component {

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
    flux.getActions('reports').getDailyCleaningReportsCAFAP();
  }

  onReportSelect({ props }) {
    const id = props.data.id;
    if (props.data.status !== 'success' && props.data.status !== 'fail') {
      global.NOTIFICATION_SYSTEM.notify(getReportNotReadyNotification2(this.context.flux));
    } else if (props.data.status !== 'fail') {
      this.context.history.pushState(null, `/daily-cleaning-report-cafap/${props.data.element}/${id}`);
    }
  }

  handleChange(field, value) {
    this.setState({ [field]: value });
  }

  createDailyCleaningReportCAFAP() {
    const { flux } = this.context;
    const payload = _.cloneDeep(this.state);
    const { car_type_id_list, geozone_type } = payload;
    let newCarTypeIdList = [];
    if (geozone_type === 'dt') {
      car_type_id_list.map((el) => {
        if (typeof el === 'string') {
          el = el.split(';').map(id => parseInt(id));
        }
        newCarTypeIdList.push(el);
        return el;
      });
      if (newCarTypeIdList.length) {
        newCarTypeIdList = newCarTypeIdList.reduce((a, b) => a.concat(b));
      }
      payload.car_type_id_list = newCarTypeIdList;
    }

    flux.getActions('reports').createDailyCleaningReportCAFAP(payload);
  }

  render() {
    const { dailyCleaningReportsListCAFAP = [] } = this.props;

    return (
      <div className="ets-page-wrap">
        <DailyReportHeader
          handleChange={this.handleChange.bind(this)}
          onClick={this.createDailyCleaningReportCAFAP.bind(this)}
          useCombinations
          {...this.state}
        />
        <DailyCleaningReportsCAFAPTable
          data={dailyCleaningReportsListCAFAP}
          refreshable
          onRefresh={() => this.context.flux.getActions('reports').getDailyCleaningReportsCAFAP()}
          onRowSelected={this.onReportSelect.bind(this)}
        />
      </div>
    );
  }
}
