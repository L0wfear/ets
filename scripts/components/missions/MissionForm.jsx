import React, {Component} from 'react';
import connectToStores from 'flummox/connect';
import { Modal, Row, Col, FormControls, Button, DropdownButton, Dropdown, Glyphicon, MenuItem, Input } from 'react-bootstrap';
import Datepicker from '../ui/DatePicker.jsx';
import RouteInfo from '../route/RouteInfo.jsx';
import RouteFormWrap from '../route/RouteFormWrap.jsx';
import ODHList from '../route/ODHList.jsx';
import Field from '../ui/Field.jsx';
import Div from '../ui/Div.jsx';
import moment from 'moment';
import cx from 'classnames';
import { isEmpty } from 'utils/functions';
import Form from '../compositions/Form.jsx';

export class MissionForm extends Form {

	constructor(props) {
		super(props);

		this.state = {
			selectedRoute: null,
			showRouteForm: false,
			carsList: [],
		};
	}

	handleRouteIdChange(v) {
		this.handleChange('route_id', v);
		const { flux } = this.context;
		if (v) {
			flux.getActions('routes').getRouteById(v, true).then(r => {
				this.setState({selectedRoute: r.result.length ? r.result[0] : null});
			});
		} else {
			this.setState({selectedRoute: null});
		}
	}

	async handleCarIdChange(v) {
		this.handleChange('car_id', v);
		this.handleChange('technical_operation_id', undefined);
		this.handleChange('route_id', undefined);
		this.setState({selectedRoute: null});
		try {
			let technicalOperationsList = await this.context.flux.getActions('technical_operation')
																													 .getTechnicalOperationsByCarId(v);
			this.setState({technicalOperationsList});
		} catch (e) {
			console.error('USER GENERATED EXCEPTION');
			console.error(e);
		}
	}

	async handleTechnicalOperationChange(v) {
		this.handleChange('technical_operation_id', v);
		this.handleChange('route_id', undefined);
		this.setState({selectedRoute: null});
		try {
			let routesList = await this.context.flux.getActions('routes')
																							.getRoutesByTechnicalOperation(v);
			this.setState({routesList});
		} catch (e) {
			console.error('USER GENERATED EXCEPTION');
			console.error(e);
		}
	}

	componentWillUnmount() {
		this.context.flux.getActions('technical_operation').getTechnicalOperations();
	}

	async componentDidMount() {
		const mission = this.props.formState;
		const { flux } = this.context;
		let objectsActions = flux.getActions('objects')
		let technicalOperationsActions = flux.getActions('technical_operation');
		let routesActions = flux.getActions('routes');
		let technicalOperationsList;
		let routesList;
		if (typeof mission.route_id !== 'undefined' && mission.route_id !== null){
			routesActions.getRouteById(mission.route_id, true).then(r => {
				this.setState({selectedRoute: r.result.length ? r.result[0] : null});
			});
		}
		if (mission.car_id){
			technicalOperationsList = await technicalOperationsActions.getTechnicalOperationsByCarId(mission.car_id);
		}
		if (mission.technical_operation_id){
			routesList = await routesActions.getRoutesByTechnicalOperation(mission.technical_operation_id);
		}
		objectsActions.getModels();
		objectsActions.getCars();
		this.setState({
			carsList: this.props.carsList,
			technicalOperationsList: technicalOperationsList || this.props.techOperationsList,
			routesList: routesList || this.props.routesList,
		});
	}

	createNewRoute() {
		this.context.flux.getActions('routes').getGeozones().then(v => {
			let newR = {
				name: '',
				polys: this.props.geozonePolys,
				technical_operation_id: this.props.formState.technical_operation_id,
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
				this.context.flux.getActions('routes').getRouteById(props.lastCreatedRouteId, true).then(r => {
					this.setState({selectedRoute: r.result.length ? r.result[0] : null});
				});
			}, 500);
		}
	}

	render() {

		let state = this.props.formState;
		let errors = this.props.formErrors;

		const { missionSourcesList = [], carsList = [] } = this.props;
		const { technicalOperationsList = [], routesList = [] } = this.state;

    //const WORK_KINDS = workKindsList.map(({id, name}) => ({value: id, label: name}));
    const TECH_OPERATIONS = technicalOperationsList.map(({id, name}) => ({value: id, label: name}));
    const MISSION_SOURCES = missionSourcesList.map(({id, name}) => ({value: id, label: name}));
		const CARS = carsList.map( c => ({value: c.asuods_id, label: c.gov_number + ' [' + c.model + ']'}));
    let ROUTES = routesList.map(({id, name}) => ({value: id, label: name}));

    console.log('form state is ', state);
		let isDeferred = moment(state.date_start).toDate().getTime() > moment().toDate().getTime();

		let IS_CREATING = !!!state.status;
    let IS_POST_CREATING_NOT_ASSIGNED = state.status === 'not_assigned';
    let IS_POST_CREATING_ASSIGNED = state.status === 'assigned' && isDeferred;
		let IS_DISPLAY = !IS_CREATING && !(IS_POST_CREATING_NOT_ASSIGNED || IS_POST_CREATING_ASSIGNED);//(!!state.status && state.status !== 'not_assigned') || (!isDeferred && !IS_CREATING);
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
							<Field type="select" label="Транспортное средство" error={errors['car_id']}
											disabled={IS_POST_CREATING_ASSIGNED || IS_POST_CREATING_NOT_ASSIGNED || IS_DISPLAY}
											options={CARS}
											value={state.car_id}
											onChange={this.handleCarIdChange.bind(this)}/>
						</Col>

				 		<Col md={3}>
				   		<label>Время выполнения</label>
				 			<Div>c <Datepicker date={state.date_start} onChange={this.handleChange.bind(this, 'date_start')} disabled={IS_DISPLAY}/></Div>
				   	</Col>
				   	<Col md={3}>
              <label style={{minHeight: 15}}></label>
				 			<Div>по <Datepicker date={state.date_end} onChange={this.handleChange.bind(this, 'date_end')} disabled={IS_DISPLAY}/></Div>
				   	</Col>
					</Row>

	      	<Row>
	      		<Col md={6}>
							<Field type="select" label="Технологическая операция" error={errors['technical_operation_id']}
											disabled={IS_POST_CREATING_ASSIGNED || IS_DISPLAY || isEmpty(state.car_id)}
											options={TECH_OPERATIONS}
											value={state.technical_operation_id}
											onChange={this.handleTechnicalOperationChange.bind(this)}/>
	          </Col>
	      		<Col md={6}>
              <Field type="select" label="Источник получения задания" error={errors['mission_source_id']}
										 disabled={IS_POST_CREATING_ASSIGNED || IS_DISPLAY}
                     options={MISSION_SOURCES}
                     value={state.mission_source_id}
                     onChange={this.handleChange.bind(this, 'mission_source_id')}/>


	            <Field type="number" label="Количество проходов" error={errors['passes_count']}
										 disabled={IS_POST_CREATING_ASSIGNED || IS_DISPLAY}
										 value={state.passes_count} onChange={this.handleChange.bind(this, 'passes_count')}
										 min={0} />
	      		</Col>
	      	</Row>

	      	<Row>
            <Col md={6}>
              <Field type="select" label="Маршрут" error={errors['route_id']}
										 disabled={IS_POST_CREATING_ASSIGNED || IS_DISPLAY || !!!state.technical_operation_id}
                     options={ROUTES}
                     value={state.route_id}
                     onChange={this.handleRouteIdChange.bind(this)}/>
							<Div className="route-odhs-list" hidden={this.state.selectedRoute === null}>
								{/*<ODHList showSelectable={true} odh_list={odh_list} />*/}
							</Div>
						  <Div hidden={state.route_id}>
							  <Button onClick={this.createNewRoute.bind(this)} disabled={IS_POST_CREATING_ASSIGNED || IS_DISPLAY || !state.technical_operation_id}>Создать новый</Button>
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
          <Div className="inline-block assignToWaybillCheck" hidden={!!state.status || this.props.fromWaybill}>
            <label>Создать черновик ПЛ / Добавить в существующий</label>
            <Input type="checkbox" value={state.assign_to_waybill} onClick={this.handleChange.bind(this, 'assign_to_waybill', !!!state.assign_to_waybill)}/>
          </Div>
					<Div className="inline-block" hidden={state.status === 'complete'}>
			      <Button onClick={this.props.handlePrint} disabled={!state.route_id}>Печать</Button>
		      	<Button onClick={this.handleSubmit.bind(this)} disabled={!this.props.canSave || IS_DISPLAY}>Сохранить</Button>
					</Div>
	      </Modal.Footer>

				<RouteFormWrap element={route}
											 onFormHide={() => {this.setState({showRouteForm: false, selectedRoute: null})}}
											 showForm={this.state.showRouteForm}
											 fromMission={true}/>
			</Modal>
		)
	}
}

export default connectToStores(MissionForm, ['objects', 'employees', 'missions', 'routes']);
