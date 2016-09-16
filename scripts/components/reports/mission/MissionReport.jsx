import React, { Component } from 'react';
import { connectToStores, HistoryContext, FluxContext, exportable } from 'utils/decorators';
import { Button, Glyphicon } from 'react-bootstrap';
import MissionReportTable from './MissionReportTable.jsx';

@connectToStores(['missions'])
@HistoryContext
@FluxContext
@exportable
export default class MissionReport extends Component {

  constructor(props) {
    super(props);

    this.entity = 'car_odh_travel_report/' + this.props.routeParams.id;
  }

  componentDidMount() {
    const { flux } = this.context;
    flux.getActions('missions').getMissionReportById(this.props.routeParams.id);
  }

  onReportSelect({ props }) {
    const index = props.data.index;
    if (props.data.report_by_odh) {
      this.context.history.pushState(null, '/mission-report/' + this.props.routeParams.id + '/odhs/' + index);
    } else if (props.data.report_by_dt) {
      this.context.history.pushState(null, '/mission-report/' + this.props.routeParams.id + '/dts/' + index);
    } else if (props.data.report_by_point) {
      this.context.history.pushState(null, '/mission-report/' + this.props.routeParams.id + '/points/' + index);
    }
  }

  render() {
    const { selectedReportData = [] } = this.props;

    return (
      <div className="ets-page-wrap">
        <MissionReportTable data={selectedReportData} onRowSelected={this.onReportSelect.bind(this)}>
          <Button bsSize="small" onClick={() => this.export()}><Glyphicon glyph="download-alt" /></Button>
        </MissionReportTable>
      </div>
    );
  }
}
