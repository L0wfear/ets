import React, {Component} from 'react';
import connectToStores from 'flummox/connect';
import { Modal, Row, Col, FormControls, Button, DropdownButton, Dropdown, Glyphicon, MenuItem } from 'react-bootstrap';
import Datepicker from '../ui/DatePicker.jsx';
import Field from '../ui/Field.jsx';
import Div from '../ui/Div.jsx';
import moment from 'moment';
import cx from 'classnames';
import { isEmpty } from '../../utils/functions.js';
import Form from '../compositions/Form.jsx';
import Map from '../map/HybridMap.jsx';
import FluxComponent from 'flummox/component';
import MissionReportByODH from '../reports/MissionReportByODH.jsx';

const MAP_INITIAL_CENTER = [-6240.212982145856, 9358.852595460314];
const MAP_INITIAL_ZOOM = 6;

export class MissionInfoForm extends Form {

	constructor(props) {
		super(props);

		this.state = {
      object_list: [],
      missionReport: []
		};
	}

  componentDidMount() {
    let { formState } = this.props;
    this.context.flux.getActions('points').createConnection();
    this.context.flux.getActions('points').setSingleCarTrack(formState.car_gov_number);
    this.context.flux.getActions('points').setSingleCarTrackDates([formState.waybill_fact_departure_date, formState.waybill_fact_arrival_date]);
    this.context.flux.getActions('missions').getMissionLastReport(formState.mission_id).then(r => {
      this.setState({missionReport: r.result ? r.result.report_by_odh : []});
    });
    this.context.flux.getActions('routes').getRouteById(formState.route_id, true).then(r => {
      this.setState({object_list: r.result && r.result[0] ? r.result[0].object_list : []});
    })
  }

  componentWillUnmount() {
    this.context.flux.getActions('points').closeConnection();
    this.context.flux.getActions('points').setSingleCarTrack(null);
    delete global.olmap;
    console.warn('UNMOUNT MISSION INFO FORM');
  }

	render() {

		let state = this.props.formState;
    let { object_list = []} = this.state;
    const polys = object_list.map(({shape, name, state, begin, end}) => {
      if (!shape && begin) {
        manual = true;
        shape = {
          type: "LineString",
          coordinates: [[begin.x_msk, begin.y_msk], [end.x_msk, end.y_msk]]
        };
      }
      return {
        shape,//: JSON.parse(shape),
        name,
        state,
      }
    });
    if (!this.props.formState.car_gov_number) return <div/>

		return (
			<Modal {...this.props} bsSize="large" className="mission-info-modal">

				<Modal.Header closeButton>
	          <Modal.Title id="contained-modal-title-lg">Информация о задании</Modal.Title>
				</Modal.Header>

	      <Modal.Body>

          <Row>

            <Col md={6} style={{height: 400}}>
              <FluxComponent connectToStores={{
                points: store => ({
                  points: store.state.points,
                  selected: store.getSelectedPoint(),
                  showPlates: store.state.showPlates
                })
              }}>

                <Map zoom={MAP_INITIAL_ZOOM}
                     center={MAP_INITIAL_CENTER}
                     polys={polys}
                     car_gov_number={this.props.formState.car_gov_number}/>

              </FluxComponent>
            </Col>

            <Col md={6}>
              <MissionReportByODH noFilter={true} selectedReportDataODHS={this.state.missionReport} />
              <Div hidden={this.state.missionReport.length > 0}>
                <h5>Нет данных о прохождении задания</h5>
              </Div>
            </Col>

          </Row>

	      </Modal.Body>

	      <Modal.Footer>
					<Div>
		      	<Button onClick={this.handleSubmit.bind(this)} >{'Закрыть'}</Button>
					</Div>
	      </Modal.Footer>

			</Modal>
		)
	}
}

export default connectToStores(MissionInfoForm, ['objects', 'employees', 'missions', 'routes']);
