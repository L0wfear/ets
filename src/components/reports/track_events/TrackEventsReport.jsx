import React, { Component } from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import _ from 'lodash';
import { getToday9am, getTomorrow9am, createValidDateTime } from 'utils/dates';
import { connectToStores, FluxContext, HistoryContext, staticProps, exportable } from 'utils/decorators';
import TrackEventsReportTable from './TrackEventsReportTable.jsx';
import TrackEventsReportHeader from './TrackEventsReportHeader.jsx';
import MapModal from '../MapModal.jsx';

@connectToStores(['reports'])
@exportable({ entity: 'track_events' })
@FluxContext
@HistoryContext
@staticProps({
  entity: 'track_events_report',
})
export default class TrackEventsReport extends Component {

  constructor(props) {
    super(props);

    this.state = {
      date_start: getToday9am(),
      date_end: getTomorrow9am(),
    };
  }

  handleChange(field, value) {
    this.setState({ [field]: value });
  }

  createReport() {
    const { flux } = this.context;
    flux.getActions('reports').getTrackEventsReport(this.state);
  }

  printReport() {
    const payload = {};
    payload.date_start = createValidDateTime(this.state.date_start);
    payload.date_end = createValidDateTime(this.state.date_end);
    this.props.export(payload);
  }

  mapView(coords) {
    this.setState({ coords, showMap: true });
  }

  render() {
    const { trackEventsReport = [] } = this.props;

    return (
      <div className="ets-page-wrap">
        <TrackEventsReportHeader handleChange={this.handleChange.bind(this)} onClick={this.createReport.bind(this)} {...this.state} />
        <TrackEventsReportTable data={trackEventsReport} mapView={coords => this.mapView(coords)}>
          <Button bsSize="small" onClick={this.printReport.bind(this)}><Glyphicon glyph="download-alt" /></Button>
        </TrackEventsReportTable>
        <MapModal coords={this.state.coords} showForm={this.state.showMap} onFormHide={() => this.setState({ showMap: false })} />
      </div>
    );
  }
}
