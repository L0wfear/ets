import React, { Component, PropTypes } from 'react';
import { connectToStores, HistoryContext, FluxContext, exportable } from 'utils/decorators';
import { Button, Glyphicon } from 'react-bootstrap';
import MissionReportTable from './MissionReportTable.jsx';

@connectToStores(['missions'])
@exportable({ entity: 'car_odh_travel_report' })
@HistoryContext
@FluxContext
export default class MissionReport extends Component {

  static get propTypes() {
    return {
      routeParams: PropTypes.object,
      selectedReportData: PropTypes.array,
    };
  }

  componentDidMount() {
    const { flux } = this.context;
    flux.getActions('missions').getMissionReportById(this.props.routeParams.id);
  }

  onReportSelect({ props }) {
    const index = props.data.index;
    const { id } = this.props.routeParams;
    if (props.data.report_by_odh) {
      this.context.history.pushState(null, `/mission-report/${id}/odhs/${index}`);
    } else if (props.data.report_by_dt) {
      this.context.history.pushState(null, `/mission-report/${id}/dts/${index}`);
    } else if (props.data.report_by_point) {
      this.context.history.pushState(null, `/mission-report/${id}/points/${index}`);
    }
  }

  render() {
    const { selectedReportData = [] } = this.props;

    return (
      <div className="ets-page-wrap">
        <MissionReportTable data={selectedReportData} onRowSelected={this.onReportSelect.bind(this)}>
          <Button bsSize="small" onClick={() => this.props.export({}, true)}><Glyphicon glyph="download-alt" /></Button>
        </MissionReportTable>
      </div>
    );
  }
}
