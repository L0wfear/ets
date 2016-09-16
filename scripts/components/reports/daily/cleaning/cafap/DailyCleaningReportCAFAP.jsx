import React, { Component } from 'react';
import { Input, Button, Glyphicon } from 'react-bootstrap';
import { FluxContext, connectToStores, exportable } from 'utils/decorators';
import { getFormattedDateTime } from 'utils/dates';
import DailyCleaningReportCAFAPTable from './DailyCleaningReportCAFAPTable.jsx';

@connectToStores(['missions'])
@FluxContext
@exportable
export default class DailyCleaningReportCAFAP extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedReportData: [],
      dateFrom: '',
      dateTo: '',
    };

    this.entity = 'geozone_element_traveled_daily_report__cafap/' + this.props.routeParams.id;
  }

  async componentDidMount() {
    const { flux } = this.context;
    const result = await flux.getActions('reports').getDailyCleaningReportByIdCAFAP(this.props.routeParams.id);
    const selectedReportData = result.result.rows;
    const dateFrom = getFormattedDateTime(result.result.meta.date_start);
    const dateTo = getFormattedDateTime(result.result.meta.date_end);
    this.setState({ selectedReportData, dateFrom, dateTo });
  }

  render() {
    const { selectedReportData = [], dateFrom, dateTo } = this.state;
    const element = this.props.routeParams.element;

    return (
      <div className="ets-page-wrap">
        <DailyCleaningReportCAFAPTable data={selectedReportData} element={element}>
          <div className="daily-cleaning-report-period">
            Период формирования:
            <Input type="text" readOnly value={dateFrom} /> —
            <Input type="text" readOnly value={dateTo} />
          </div>
          <Button bsSize="small" onClick={() => this.export()}><Glyphicon glyph="download-alt" /></Button>
        </DailyCleaningReportCAFAPTable>
      </div>
    );
  }
}
