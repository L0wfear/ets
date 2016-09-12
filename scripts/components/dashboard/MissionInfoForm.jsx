import React, {Component} from 'react';
import connectToStores from 'flummox/connect';
import { Modal, Row, Col, FormControls, Button, DropdownButton, Dropdown, Glyphicon, MenuItem } from 'react-bootstrap';
import Datepicker from 'components/ui/DatePicker.jsx';
import Field from 'components/ui/Field.jsx';
import Div from 'components/ui/Div.jsx';
import moment from 'moment';
import cx from 'classnames';
import { isEmpty } from 'utils/functions';
import Form from '../compositions/Form.jsx';
import HybridMap from 'components/map/HybridMap.jsx';
import FluxComponent from 'flummox/component';
import MissionReportByODH from 'components/reports/mission/MissionReportByODH.jsx';
import MissionReportByDT from 'components/reports/mission/MissionReportByDT.jsx';
import MissionReportByPoints from 'components/reports/mission/MissionReportByPoints.jsx';

let getDataTraveledYet = (data) => {
  if (typeof data === 'string') {
    return data;
  }
  return !isNaN(parseInt(data, 10)) ? parseInt(data, 10) : '-';
}

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
    const { flux } = this.context;
    flux.getActions('points').createConnection();
    flux.getActions('points').setSingleCarTrack(formState.car_gov_number);
    flux.getActions('points').setSingleCarTrackDates([formState.mission_date_start, formState.mission_date_end]);
    await flux.getActions('missions').getMissionLastReport(formState.mission_id).then(r => {
			if (r.result) {
				let missionReport = [];
				let selectedObjects = [];
				let routeType = 'simple';
				if (r.result.report_by_odh) {
					missionReport = r.result.report_by_odh;
					routeType = 'odh';
				} else if (r.result.report_by_dt) {
					missionReport = r.result.report_by_dt;
					routeType = 'dt';
				} else if (r.result.report_by_point) {
					missionReport = r.result.report_by_point;
					routeType = 'point';
					selectedObjects = r.result.report_by_point.filter(p => p.status === 'success');
				}
				if (r.result.route_check_unit) {
					_.each(missionReport, mr => mr.route_check_unit = r.result.route_check_unit)
				}
	      this.setState({missionReport, routeType, missionReportFull: r.result, selectedObjects});
			}
    });
    flux.getActions('routes').getRouteById(formState.route_id, true).then(route => {
      this.setState({object_list: route ? route.object_list : []});
    })
		flux.getActions('geoObjects').getGeozones();
	  flux.getActions('objects').getTypes();
	  flux.getActions('objects').getCars();
  }

  componentWillUnmount() {
    this.context.flux.getActions('points').closeConnection();
    this.context.flux.getActions('points').setSingleCarTrack(null);
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
		let { geozonePolys = {} } = this.props;
    let object_list = _.cloneDeep(this.state.object_list || []);
    const polys = _.keyBy(object_list, 'object_id');
    if (!state.car_gov_number) return <div/>;
		let title = `Информация о задании. Рег. номер ТС: ${state.car_gov_number}`;

		return (
			<Modal {...this.props} bsSize="large" className="mission-info-modal" backdrop="static">

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
                  showPolygons: store.state.showPolygons,
									showSelectedElement: store.state.showSelectedElement
								}),
								session: store => ({
									zoom: store.getCurrentUser().getCompanyMapConfig().zoom,
									center: store.getCurrentUser().getCompanyMapConfig().coordinates,
								})
							}}>

								<HybridMap
                    polys={polys}
                    maxSpeed={state.technical_operation_max_speed}
										routeType={this.state.routeType}
										selectedObjects={this.state.selectedObjects}
										selectedPoly={geozonePolys[this.state.selectedElementId]}
										car_gov_number={state.car_gov_number}/>

							</FluxComponent>
            </Col>

            <Col md={6}>
              <Div hidden={!(this.state.missionReport && this.state.missionReport.length > 0)}>
  							<Div style={{marginTop: -35}} hidden={this.state.missionReportFull && !this.state.missionReportFull.report_by_odh}>
                	<MissionReportByODH renderOnly={true} enumerated={false} selectedReportDataODHS={this.state.missionReport} onElementChange={this.handleSelectedElementChange.bind(this)}/>
  							</Div>
  							<Div style={{marginTop: -35}} hidden={this.state.missionReportFull && !this.state.missionReportFull.report_by_dt}>
                	<MissionReportByDT renderOnly={true} enumerated={false} selectedReportDataDTS={this.state.missionReport} onElementChange={this.handleSelectedElementChange.bind(this)}/>
  							</Div>
  							<Div style={{marginTop: -35}} hidden={this.state.missionReportFull && !this.state.missionReportFull.report_by_point}>
                	<MissionReportByPoints renderOnly={true} enumerated={false} selectedReportDataPoints={this.state.missionReport}/>
  							</Div>
              </Div>
              <Div hidden={this.state.missionReport && this.state.missionReport.length > 0}>
                <h5>Нет данных о прохождении задания</h5>
              </Div>
            </Col>

          </Row>

					<Div>
            * - расстояние, учитываемое при прохождении задания<br/>
            ** - пройдено с рабочей скоростью / пройдено с превышением рабочей скорости<br/>
						<b>Пройдено с рабочей скоростью:</b> {getDataTraveledYet(state.route_with_work_speed + state.with_work_speed_time)}<br/>
						<b>Пройдено с превышением рабочей скорости:</b> {getDataTraveledYet(state.route_with_high_speed + state.with_high_speed_time)}
					</Div>

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

export default connectToStores(MissionInfoForm, ['objects', 'employees', 'missions', 'routes', 'geoObjects']);
