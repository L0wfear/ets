import React, { Component } from 'react';
import { Button, Glyphicon } from 'react-bootstrap';

import { connectToStores, FluxContext, HistoryContext, exportable } from 'utils/decorators';
import MapModal from 'components/reports/MapModal.jsx';
import ReportTable from './TrackEventsReportTable';


@connectToStores(['reports'])
@exportable({ entity: 'track_events' })
@FluxContext
@HistoryContext
export default class TrackEventsReport extends Component {

  state = {
    coords: null,
  }

  componentDidMount() {
    const { flux } = this.context;
    flux.getActions('reports').getTrackEventsReport(this.props.location.query);
  }

  onMapFormHide = () => {
    this.setState({ showMap: false });
  }

  printReport = () => {
    this.props.export(this.props.location.query);
  }

  mapView(coords) {
    const coordinates = [coords[1], coords[0]];
    this.setState({ coords: coordinates, showMap: true });
  }

  pushBack = () => {
    this.context.history.pushState(null, 'track-events-reports');
  }

  render() {
    const { trackEventsReport = [] } = this.props;

    return (
      <div>
        <ReportTable data={trackEventsReport} mapView={coords => this.mapView(coords)}>
          <Button bsSize="small" onClick={this.printReport}><Glyphicon glyph="download-alt" /></Button>
          <Button bsSize="small" onClick={this.pushBack}>Назад</Button>
        </ReportTable>
        <MapModal coords={this.state.coords} showForm={this.state.showMap} onFormHide={this.onMapFormHide} />
      </div>
    );
  }
}
