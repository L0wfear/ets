import React, { Component } from 'react';
import { Button, Glyphicon, Row, Col } from 'react-bootstrap';

import Div from 'components/ui/Div.jsx';
import { connectToStores, FluxContext, HistoryContext, exportable } from 'utils/decorators';
import Datepicker from 'components/ui/DatePicker.jsx';
import MapModal from '../MapModal.jsx';
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
    const payload = {
      company_id: this.props.routeParams.company_id,
      event_type: this.props.routeParams.event_type,
      date_start: this.props.routeParams.date_start,
      date_end: this.props.routeParams.date_end,
    };
    flux.getActions('reports').getTrackEventsReport(payload);
  }

  printReport() {
    const payload = {
      company_id: this.props.routeParams.company_id,
      event_type: this.props.routeParams.event_type,
      date_start: this.props.routeParams.date_start,
      date_end: this.props.routeParams.date_end,
    };
    this.props.export(payload);
  }

  mapView(coords) {
    const coordinates = [coords[1], coords[0]];
    this.setState({ coords: coordinates, showMap: true });
  }

  pushBack() {
    const query = {
      date_start: this.props.routeParams.date_start,
      date_end: this.props.routeParams.date_end,
    }
    this.context.history.pushState(null, '/track-events-reports', query);
  }

  renderHeader() {
    return (
      <Div>
        <Row>
          <Col md={4} />
          <Col md={5}>
            <Div><label>Период формирования</label></Div>
            <Div className="inline-block reports-date">
              <Datepicker disabled time={false} date={this.props.routeParams.date_start} />
            </Div>
            <Div className="inline-block reports-date">
              <Datepicker disabled time={false} date={this.props.routeParams.date_end} />
            </Div>
          </Col>
          <Col md={3}>
            <Button style={{position: 'relative', top: 30}} bsSize="small" onClick={() => this.pushBack()}>Назад</Button>
          </Col>
        </Row>
      </Div>
    );
  }

  render() {
    const { trackEventsReport = [] } = this.props;

    return (
      <div className="ets-page-wrap">
        {this.renderHeader()}
        <ReportTable data={trackEventsReport} mapView={coords => this.mapView(coords)}>
          <Button bsSize="small" onClick={() => this.printReport()}><Glyphicon glyph="download-alt" /></Button>
        </ReportTable>
        <MapModal coords={this.state.coords} showForm={this.state.showMap} onFormHide={() => this.setState({ showMap: false })} />
      </div>
    );
  }
}
