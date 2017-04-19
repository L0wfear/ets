import React, { Component } from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import { getToday9am, getTomorrow9am, createValidDateTime } from 'utils/dates';
import { connectToStores, FluxContext, HistoryContext, exportable } from 'utils/decorators';
import TrackEventsReportsTable from './TrackEventsReportsTable.jsx';
import TrackEventsReportsHeader from './TrackEventsReportsHeader.jsx';

@connectToStores(['reports'])
@exportable({ entity: 'track_events/aggregate' })
@FluxContext
@HistoryContext
export default class TrackEventsReports extends Component {

  constructor(props) {
    super(props);
    const { date_start = getToday9am(), date_end = getTomorrow9am() } = props.location.query;
    this.state = {
      date_start,
      date_end,
    };
  }

  handleChange(field, value) {
    this.setState({ [field]: value });
  }

  createReport() {
    const { flux } = this.context;
    flux.getActions('reports').getTrackEventsReports(this.state);
  }

  printReport() {
    const payload = {};
    payload.date_start = createValidDateTime(this.state.date_start);
    payload.date_end = createValidDateTime(this.state.date_end);
    this.props.export(payload);
  }

  onReportSelect({ props }) {
    const company_id = props.data.company_id;
    const event_type = props.data.event_type;
    const date_start = createValidDateTime(this.state.date_start);
    const date_end = createValidDateTime(this.state.date_end);
    this.context.history.pushState(null, `/track-events-report/${date_start}/${date_end}/${company_id}/${event_type}`);
  }

  render() {
    const { trackEventsReports = [] } = this.props;

    return (
      <div className="ets-page-wrap">
        <TrackEventsReportsHeader handleChange={this.handleChange.bind(this)} onClick={this.createReport.bind(this)} {...this.state} />
        <TrackEventsReportsTable data={trackEventsReports} onRowSelected={this.onReportSelect.bind(this)}>
          <Button bsSize="small" onClick={this.printReport.bind(this)}><Glyphicon glyph="download-alt" /></Button>
        </TrackEventsReportsTable>
      </div>
    );
  }
}
