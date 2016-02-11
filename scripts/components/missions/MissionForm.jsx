import React, {Component} from 'react';
import connectToStores from 'flummox/connect';
import { Modal, Row, Col, FormControls, Button, DropdownButton, Dropdown, Glyphicon, MenuItem } from 'react-bootstrap';
import Datepicker from '../ui/DatePicker.jsx';
import RouteInfo from '../route/RouteInfo.jsx';
import RouteFormWrap from '../route/RouteFormWrap.jsx';
import ODHList from '../route/ODHList.jsx';
import Field from '../ui/Field.jsx';
import Div from '../ui/Div.jsx';
import moment from 'moment';
import { getFuelOperations, getFuelRatesByCarModel } from '../../adapter.js';
import cx from 'classnames';
import { getDateWithoutTZ } from '../../utils/dates.js';
import { isEmpty } from '../../utils/functions.js';
import Form from '../compositions/Form.jsx';

export class MissionForm extends Form {

	constructor(props) {
		super(props);

		this.state = {
			selectedRoute: null,
			showRouteForm: false,
		};
	}

	handleRouteIdChange(v) {
		this.handleChange('route_id', v);
		const { flux } = this.context;
		flux.getActions('routes').getRouteById(v).then(r => {
			this.setState({selectedRoute: r.result.length ? r.result[0] : null});
		});
	}

	handleTechnicalOperationChange(v) {
		this.handleChange('technical_operation_id', v)
		this.handleChange('car_id', undefined);

    this.context.flux.getActions('objects').getCars(v);
	}

	componentDidMount() {
		const mission = this.props.formState;
		const { flux } = this.context;
		if (typeof mission.route_id !== 'undefined' && mission.route_id !== null){
			flux.getActions('routes').getRouteById(mission.route_id).then(r => {
				this.setState({selectedRoute: r.result.length ? r.result[0] : null});
			});
		}
	}

	createNewRoute() {
		this.context.flux.getActions('routes').getGeozones().then(v => {
			let newR = {
				name: '',
				polys: this.props.geozonePolys,
				object_list: [],
				type: 'vector',
			};
			this.setState({
				showRouteForm: true,
				selectedRoute: newR,
			});
		});
	}

	componentWillReceiveProps(props) {
		if (props.lastCreatedRouteId !== null && props.lastCreatedRouteId !== this.props.lastCreatedRouteId) {
			this.handleChange('route_id', props.lastCreatedRouteId);
			setTimeout(() => { //no time sry
				this.context.flux.getActions('routes').getRouteById(props.lastCreatedRouteId).then(r => {
					this.setState({selectedRoute: r.result.length ? r.result[0] : null});
				});
			}, 500);
		}
	}

	render() {

		let state = this.props.formState;
		let errors = this.props.formErrors;

		const { workKindsList = [], techOperationsList = [], missionSourcesList = [], routesList = [], carsList = [] } = this.props;

    const WORK_KINDS = workKindsList.map(({id, name}) => ({value: id, label: name}));
    const TECH_OPERATIONS = techOperationsList.map(({id, name}) => ({value: id, label: name}));
    const MISSION_SOURCES = missionSourcesList.map(({id, name}) => ({value: id, label: name}));
		const CARS = carsList.map( c => ({value: c.asuods_id, label: c.gov_number + ' [' + c.model + ']'}));
    let ROUTES = routesList.map(({id, name}) => ({value: id, label: name}));

    console.log('form state is ', state);

		let IS_CREATING = !!!state.status;
    let IS_POST_CREATING = false;
		let IS_DISPLAY = !!state.status && state.status !== 'not_assigned';

    let title = `Задание № ${state.number || ''}`;

    if (IS_CREATING) {
      title = "Создание задания"
    }

		let route = this.state.selectedRoute;
		let odh_list = route ? route.odh_list || route.object_list : [];

		return (
			<Modal {...this.props} bsSize="large">

				<Modal.Header closeButton>
	          <Modal.Title id="contained-modal-title-lg">{title}</Modal.Title>
				</Modal.Header>

	      <Modal.Body>

					<Row>
						<Col md={6}>
              <Field type="select" label="Технологическая операция" error={errors['technical_operation_id']}
											disabled={IS_DISPLAY}
                      options={TECH_OPERATIONS}
                      value={state.technical_operation_id}
                      onChange={this.handleTechnicalOperationChange.bind(this)}/>
						</Col>

				 		<Col md={3}>
				   		<label>Время выполнения</label>
				 			<Div>c <Datepicker date={ getDateWithoutTZ(state.date_start) } onChange={this.handleChange.bind(this, 'date_start')} disabled={IS_DISPLAY}/></Div>
				   	</Col>
				   	<Col md={3}>
              <label style={{minHeight: 15}}></label>
				 			<Div>по <Datepicker date={ getDateWithoutTZ(state.date_end) } onChange={this.handleChange.bind(this, 'date_end')} disabled={IS_DISPLAY}/></Div>
				   	</Col>
					</Row>

	      	<Row>
	      		<Col md={6}>
              <Field type="number" label="Количество проходов" error={errors['passes_count']}
										 disabled={IS_DISPLAY}
  									 value={state.passes_count} onChange={this.handleChange.bind(this, 'passes_count')}
										 min={0} />
	          </Col>
	      		<Col md={6}>
              <Field type="select" label="Источник получения задания" error={errors['mission_source_id']}
										 disabled={IS_DISPLAY}
                     options={MISSION_SOURCES}
                     value={state.mission_source_id}
                     onChange={this.handleChange.bind(this, 'mission_source_id')}/>

 							<Field type="select" label="Транспортное средство" error={errors['car_id']}
											disabled={IS_DISPLAY || isEmpty(state.technical_operation_id)}
 											options={CARS}
 											value={state.car_id}
 											onChange={this.handleChange.bind(this, 'car_id')}/>
	      		</Col>
	      	</Row>

	      	<Row>
            <Col md={6}>
              <Field type="select" label="Маршрут" error={errors['route_id']}
										 disabled={IS_DISPLAY}
                     options={ROUTES}
                     value={state.route_id}
                     onChange={this.handleRouteIdChange.bind(this)}
										 clearable={false}/>
							<Div className="route-odhs-list" hidden={this.state.selectedRoute === null}>
								<ODHList showSelectable={true} odh_list={odh_list} />
							</Div>
						  <Div hidden={state.route_id}>
							  <Button onClick={this.createNewRoute.bind(this)}>Создать новый</Button>
						  </Div>
            </Col>
            <Col md={6}>
							<Div hidden={this.state.selectedRoute === null} className="mission-form-map-wrapper">
	            	<RouteInfo route={this.state.selectedRoute} mapOnly={true}/>
							</Div>
            </Col>
	      	</Row>

	      </Modal.Body>

	      <Modal.Footer>
					<Div hidden={state.status === 'closed'}>
						<Dropdown id="waybill-print-dropdown" disabled={!this.props.canSave} onSelect={this.props.handlePrint}>
							<Dropdown.Toggle  disabled={true}>
								<Glyphicon glyph="print" /> Печать
							</Dropdown.Toggle>
							<Dropdown.Menu>
								<MenuItem eventKey={1}>Форма 3-С</MenuItem>
								<MenuItem eventKey={2}>Форма 4-П</MenuItem>
							</Dropdown.Menu>
						</Dropdown>&nbsp;
		      	<Button onClick={this.handleSubmit.bind(this)} disabled={!this.props.canSave || IS_DISPLAY}>{'Сохранить'}</Button>
					</Div>
	      </Modal.Footer>

				<RouteFormWrap element={route}
											 onFormHide={() => {
												 this.setState({showRouteForm: false, selectedRoute: null})
											 }}
											 showForm={this.state.showRouteForm} />
			</Modal>
		)
	}
}

export default connectToStores(MissionForm, ['objects', 'employees', 'missions', 'routes']);
