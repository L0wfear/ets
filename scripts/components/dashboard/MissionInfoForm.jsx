import React, {Component} from 'react';
import connectToStores from 'flummox/connect';
import { Modal, Row, Col, FormControls, Button, DropdownButton, Dropdown, Glyphicon, MenuItem } from 'react-bootstrap';
import Datepicker from '../ui/DatePicker.jsx';
import Field from '../ui/Field.jsx';
import Div from '../ui/Div.jsx';
import moment from 'moment';
import cx from 'classnames';
import { isEmpty } from 'utils/functions';
import Form from '../compositions/Form.jsx';
import Map from '../map/HybridMap.jsx';
import FluxComponent from 'flummox/component';
import MissionReportByODH from '../reports/MissionReportByODH.jsx';
import MissionReportByDT from '../reports/MissionReportByDT.jsx';
import MissionReportByPoints from '../reports/MissionReportByPoints.jsx';

// const MAP_INITIAL_CENTER = [-6040.212982145856, 10358.852595460314];
// const MAP_INITIAL_ZOOM = 6;

export class MissionInfoForm extends Form {

	constructor(props) {
		super(props);

		this.state = {
      object_list: [],
      missionReport: [],
			missionReportFull: {},
			selectedObjects: [],
			selectedElementId: null,
			selectedPoint: null,
		};
	}

  async componentDidMount() {
    let { formState } = this.props;
		console.log(formState);
    this.context.flux.getActions('points').createConnection();
    this.context.flux.getActions('points').setSingleCarTrack(formState.car_gov_number);
    this.context.flux.getActions('points').setSingleCarTrackDates([formState.mission_date_start, formState.mission_date_end]);
    await this.context.flux.getActions('missions').getMissionLastReport(formState.mission_id).then(r => {
			if (r.result) {
				let missionReport = [];
				let selectedObjects = [];
				if (r.result.report_by_odh) {
					missionReport = r.result.report_by_odh;
				} else if (r.result.report_by_dt) {
					missionReport = r.result.report_by_dt;
				} else if (r.result.report_by_point) {
					missionReport = r.result.report_by_point;
					selectedObjects = r.result.report_by_point.filter(p => p.status === 'success');
				}
				if (r.result.route_check_unit) {
					_.each(missionReport, mr => mr.route_check_unit = r.result.route_check_unit)
				}
	      this.setState({missionReport, missionReportFull: r.result, selectedObjects});
			}
    });
    this.context.flux.getActions('routes').getRouteById(formState.route_id, true).then(r => {
      this.setState({object_list: r.result && r.result[0] ? r.result[0].object_list : []});
    })
		this.context.flux.getActions('routes').getGeozones();
	    this.context.flux.getActions('objects').getTypes();
  }

  componentWillUnmount() {
    this.context.flux.getActions('points').closeConnection();
    this.context.flux.getActions('points').setSingleCarTrack(null);
    delete global.olmap;
    console.warn('UNMOUNT MISSION INFO FORM');
  }

	handleSelectedElementChange(id) {
		this.setState({selectedElementId: id});
	}

	handlePointChange(point) {
		this.setState({selectedPoint: point});
	}

	render() {

		let state = this.props.formState;
		let { selectedODHId } = this.state;
		let { geozonePolys = [] } = this.props;
    let object_list = _.cloneDeep(this.state.object_list || []);
		const polys = object_list.map(({shape, name, state, coordinates, isInfo}) => {
			if (!shape) {
				shape = {
					type: "Point",
					coordinates
				};
			}
			let object = {
				shape,
				name,
				state,
				isInfo
			}
			return object;
		});
    if (!this.props.formState.car_gov_number) return <div/>;
		let title = `Информация о задании. Гос. номер ТС: ${this.props.formState.car_gov_number}`;

		return (
			<Modal {...this.props} bsSize="large" className="mission-info-modal">

				<Modal.Header closeButton>
					<Modal.Title id="contained-modal-title-lg">{title}</Modal.Title>
				</Modal.Header>

	      <Modal.Body>

          <Row>

            <Col md={6} style={{height: 400}}>

              <FluxComponent connectToStores={{
							points: store => ({
								points: store.state.points,
								selected: store.getSelectedPoint()
							}),
		          settings: store => ({
								showPlates: store.state.showPlates,
								showTrack: store.state.showTrack,
								showRoute: store.state.showRoute,
								showSelectedElement: store.state.showSelectedElement
		          }),
							session: store => ({
								zoom: store.getCurrentUser().getCompanyMapConfig().zoom,
								center: store.getCurrentUser().getCompanyMapConfig().coordinates,
							})
              }}>

                <Map polys={polys}
										selectedObjects={this.state.selectedObjects}
										selectedPoly={geozonePolys[this.state.selectedElementId]}
										car_gov_number={this.props.formState.car_gov_number}/>

              </FluxComponent>
            </Col>

            <Col md={6}>
							<Div  style={{marginTop: -35}} hidden={this.state.missionReportFull && !this.state.missionReportFull.report_by_odh}>
              	<MissionReportByODH noFilter={true} selectedReportDataODHS={this.state.missionReport} onElementChange={this.handleSelectedElementChange.bind(this)}/>
							</Div>
							<Div  style={{marginTop: -35}} hidden={this.state.missionReportFull && !this.state.missionReportFull.report_by_dt}>
              	<MissionReportByDT noFilter={true} selectedReportDataDTS={this.state.missionReport} onElementChange={this.handleSelectedElementChange.bind(this)}/>
							</Div>
							<Div  style={{marginTop: -35}} hidden={this.state.missionReportFull && !this.state.missionReportFull.report_by_point}>
              	<MissionReportByPoints noFilter={true} selectedReportDataPoints={this.state.missionReport}/>
							</Div>
              <Div hidden={this.state.missionReport && this.state.missionReport.length > 0}>
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
