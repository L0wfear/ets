import React, { Component } from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import { getToday9am, getTomorrow9am, createValidDateTime } from 'utils/dates';
import { connectToStores, FluxContext, HistoryContext, exportable } from 'utils/decorators';
import TrackEventsReportsTable from './TrackEventsReportTable.jsx';
import TrackEventsReportsHeader from './TrackEventsReportHeader.jsx';

@connectToStores(['reports'])
@exportable({ entity: 'track_events/aggregate' })
@FluxContext
@HistoryContext
export default class TrackEventsReports extends Component {

  constructor(props) {
    super(props);

    this.state = {
      date_start: getToday9am(),
      date_end: getTomorrow9am(),
    };
  }

  componentWillUnmount() {
    this.context.flux.getActions('reports').clearStateList('trackEventsReports');
  }

  handleChange = (field, value) => {
    this.setState({ [field]: value });
  }

  createReport = () => {
    const { flux } = this.context;
    flux.getActions('reports').getTrackEventsReports(this.state);
  }

  printReport = () => {
    const payload = {};
    payload.date_start = createValidDateTime(this.state.date_start);
    payload.date_end = createValidDateTime(this.state.date_end);
    this.props.export(payload);
  }

  onReportSelect = ({ props }) => {
    const query = {
      company_id: props.data.company_id,
      event_type: props.data.event_type,
      date_start: createValidDateTime(this.state.date_start),
      date_end: createValidDateTime(this.state.date_end),
    };
    this.context.history.pushState(null, '/track-events-reports/level/2', query);
  }

  render() {
    const { trackEventsReports = [] } = this.props;
    const isFirstLevel = Object.keys(this.props.location.query).length === 0;

    const mainTable = (
      <TrackEventsReportsTable data={trackEventsReports} onRowSelected={this.onReportSelect}>
        <Button bsSize="small" onClick={this.printReport}><Glyphicon glyph="download-alt" /></Button>
      </TrackEventsReportsTable>
    );
    return (
      <div className="ets-page-wrap">
        <TrackEventsReportsHeader
          handleChange={this.handleChange}
          onClick={this.createReport}
          readOnly={!isFirstLevel}
          {...this.state}
        />
        {isFirstLevel && mainTable}
        {this.props.children}
      </div>
    );
  }
}
