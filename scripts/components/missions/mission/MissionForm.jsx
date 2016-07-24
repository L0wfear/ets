import React, {Component} from 'react';
import connectToStores from 'flummox/connect';
import { Modal, Row, Col, FormControls, Button, DropdownButton, Dropdown, Glyphicon, MenuItem, Input } from 'react-bootstrap';
import RouteInfo from 'components/route/RouteInfo.jsx';
import RouteFormWrap from 'components/route/RouteFormWrap.jsx';
import ODHList from 'components/route/ODHList.jsx';
import Field from 'components/ui/Field.jsx';
import Div from 'components/ui/Div.jsx';
import moment from 'moment';
import cx from 'classnames';
import { isEmpty } from 'utils/functions';
import Form from 'components/compositions/Form.jsx';

export class MissionForm extends Form {

	constructor(props) {
		super(props);

		this.state = {
			selectedRoute: null,
			showRouteForm: false,
			carsList: [],
			routesList: [],
			technicalOperationsList: [],
		};
	}

	handleRouteIdChange(v) {
		this.handleChange('route_id', v);
		const { flux } = this.context;
		if (v) {
			flux.getActions('routes').getRouteById(v, true).then(r => {
				this.setState({selectedRoute: r});
			});
		} else {
			this.setState({selectedRoute: null});
		}
	}

	async handleCarIdChange(v) {
		this.handleChange('car_id', v);

		if (!!!this.props.formState.status) {

		} else { // в режиме редактирования по ТС сортируются тех.операции
			this.handleChange('technical_operation_id', undefined);
			this.handleRouteIdChange(undefined);
			try {
				let technicalOperationsList = await this.context.flux.getActions('technicalOperation')
																														 .getTechnicalOperationsByCarId(v);
				this.setState({technicalOperationsList});
			} catch (e) {
				console.error(e);
			}
		}
	}

	async handleTechnicalOperationChange(v) {
		this.handleChange('technical_operation_id', v);
		this.handleRouteIdChange(undefined);

		if (!!!this.props.formState.status && !this.props.fromWaybill) {
			this.handleChange('car_id', undefined);
			let carsList = await this.context.flux.getActions('cars')
																						.getCarsByTechnicalOperation(v);
					this.setState({carsList});
		} else {

		}

		try {
			let routesList = await this.context.flux.getActions('routes')
																							.getRoutesByTechnicalOperation(v);
			if (routesList.length === 1) {
				this.handleRouteIdChange(routesList[0].id);
			}
			this.setState({routesList});
		} catch (e) {
			console.error(e);
		}
	}

	async componentDidMount() {
		const mission = this.props.formState;
		const { flux } = this.context;
		let objectsActions = flux.getActions('objects')
		let technicalOperationsActions = flux.getActions('technicalOperation');
		let routesActions = flux.getActions('routes');
		let missionsActions = flux.getActions('missions');

		let { selectedRoute } = this.state;
		let { technicalOperationsList, routesList, carsList } = this.props;

		if (!isEmpty(mission.route_id)) {
			selectedRoute = await routesActions.getRouteById(mission.route_id, true);
		}

		if (!isEmpty(mission.technical_operation_id)){
			//routesList = await routesActions.getRoutesByTechnicalOperation(mission.technical_operation_id);
			routesList = await routesActions.getRoutesByMissionId(mission.id);
		}

		technicalOperationsList = await technicalOperationsActions.getTechnicalOperationsByCarId(mission.car_id);
		let carsListResponse = await objectsActions.getCars();
		carsList = carsListResponse.result;
		missionsActions.getMissionSources();

		this.setState({
			carsList,
			technicalOperationsList,
			routesList,
			selectedRoute,
		});
	}

	createNewRoute() {
		this.context.flux.getActions('geoObjects').getGeozones().then(v => {
			let newR = {
				name: '',
				polys: this.props.geozonePolys,
				technical_operation_id: this.props.formState.technical_operation_id,
				object_list: []
			};
			this.setState({
				showRouteForm: true,
				selectedRoute: newR,
			});
		});
	}

	async onFormHide(isSubmitted, result) {
		const { flux } = this.context;
		let routesActions = flux.getActions('routes');

		let stateChangeObject = {};
		if (isSubmitted === true) {
			let createdRouteId = result.createdRoute.result[0].id;
			this.handleChange('route_id', createdRouteId);
			let selectedRoute = await routesActions.getRouteById(createdRouteId, true);
			let routesList = await routesActions.getRoutesByTechnicalOperation(this.props.formState.technical_operation_id);
			Object.assign(stateChangeObject, {
				showRouteForm: false,
				selectedRoute,
				routesList,
			});
		} else {
			Object.assign(stateChangeObject, {
				showRouteForm: false,
				selectedRoute: null
			});
		}

		this.setState(stateChangeObject);
	}

	render() {

		let state = this.props.formState;
		let errors = this.props.formErrors;

		const { missionSourcesList = [] } = this.props;
		const { technicalOperationsList = [], routesList = [], carsList = [] } = this.state;

    const TECH_OPERATIONS = technicalOperationsList.map(({id, name}) => ({value: id, label: name}));
    const MISSION_SOURCES = missionSourcesList.map(({id, name}) => ({value: id, label: name}));
		const CARS = carsList.map( c => ({value: c.asuods_id, label: `${c.gov_number} [${c.special_model_name || ''}${c.special_model_name ? '/' : ''}${c.model_name || ''}]`}));
    const ROUTES = routesList.map(({id, name}) => ({value: id, label: name}));

    console.log('form state is ', state);
		// является ли задание отложенным
		let isDeferred = moment(state.date_start).toDate().getTime() > moment().toDate().getTime();

		let IS_CREATING = !!!state.status;
		let IS_COMPLETED = (state.status === 'complete' || state.status === 'fail');
    let IS_POST_CREATING_NOT_ASSIGNED = state.status === 'not_assigned' || this.props.fromWaybill;
    let IS_POST_CREATING_ASSIGNED = state.status === 'assigned' && isDeferred;
		let IS_DISPLAY = !IS_CREATING && !(IS_POST_CREATING_NOT_ASSIGNED || IS_POST_CREATING_ASSIGNED);//(!!state.status && state.status !== 'not_assigned') || (!isDeferred && !IS_CREATING);
    let title = `Задание № ${state.number || ''} ${state.comment ? '(Не выполнено)' : ''}`;

    if (IS_CREATING) {
      title = "Создание задания"
    }

		let route = this.state.selectedRoute;
		let odh_list = route ? route.odh_list || route.object_list : [];

		return (
			<Modal {...this.props} bsSize="large" backdrop="static">

				<Modal.Header closeButton>
					<Modal.Title id="contained-modal-title-lg">{title}</Modal.Title>
				</Modal.Header>

	      <Modal.Body>

					<Row>
						<Col md={6}>
							<Field type="select" label="Транспортное средство" error={errors['car_id']}
									className="white-space-pre-wrap"
									disabled={IS_POST_CREATING_ASSIGNED ||
										IS_POST_CREATING_NOT_ASSIGNED ||
										IS_DISPLAY ||
										this.props.fromWaybill ||
									(IS_CREATING && isEmpty(state.technical_operation_id))}
									options={CARS}
									value={state.car_id}
									onChange={this.handleCarIdChange.bind(this)}/>

						</Col>

				 		<Col md={3}>
				   		<label>Время выполнения:</label>
				 			<Div>
								<Field
										type="date"
										label="с"
										error={errors['date_start']}
										date={state.date_start}
										disabled={IS_DISPLAY}
										min={this.props.fromWaybill && this.props.waybillStartDate ? this.props.waybillStartDate : null}
										max={this.props.fromWaybill && this.props.waybillEndDate ? this.props.waybillEndDate : null}
										onChange={this.handleChange.bind(this, 'date_start')}
									/>
							</Div>
				   	</Col>
				   	<Col md={3}>
              <label style={{minHeight: 15}}></label>
				 			<Div>
								<Field
										type="date"
										label="по"
										error={errors['date_end']}
										date={state.date_end}
										disabled={IS_DISPLAY}
										min={state.date_start}
										max={this.props.fromWaybill && this.props.waybillEndDate ? this.props.waybillEndDate : null}
										onChange={this.handleChange.bind(this, 'date_end')}
										/>
							</Div>
				   	</Col>
					</Row>

					<Row>
						<Col md={6}>
							<Field type="string"
									label="Комментарий"
									disabled={IS_COMPLETED}
									value={state.comment}
									onChange={this.handleChange.bind(this, 'comment')}
									error={errors['comment']} />
						</Col>
						<Col md={3}>
							<Field type="select"
									label="Источник получения задания"
									error={errors['mission_source_id']}
									disabled={IS_POST_CREATING_ASSIGNED || IS_DISPLAY}
									options={MISSION_SOURCES}
									value={state.mission_source_id}
									onChange={this.handleChange.bind(this, 'mission_source_id')}/>
						</Col>
						<Col md={3}>
							<Field type="number" label="Количество проходов" error={errors['passes_count']}
									disabled={IS_POST_CREATING_ASSIGNED || IS_DISPLAY}
									value={state.passes_count} onChange={this.handleChange.bind(this, 'passes_count')}
									min={0} />
						</Col>
					</Row>

	      	<Row>
						<Col md={12}>
							<Field type="select"
									label="Технологическая операция"
									error={errors['technical_operation_id']}
									disabled={!IS_CREATING && (IS_POST_CREATING_ASSIGNED || IS_DISPLAY || isEmpty(state.car_id))}
									options={TECH_OPERATIONS}
									value={state.technical_operation_id}
									onChange={this.handleTechnicalOperationChange.bind(this)}/>
								</Col>
						</Row>

	      	<Row>
            <Col md={6}>
              <Field type="select" label="Маршрут" error={errors['route_id']}
									disabled={IS_POST_CREATING_ASSIGNED || IS_DISPLAY || !!!state.technical_operation_id}
									options={ROUTES}
									value={state.route_id}
									onChange={this.handleRouteIdChange.bind(this)}/>
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
						<Dropdown id="waybill-print-dropdown" dropup disabled={!state.status || !this.props.canSave || !state.route_id} onSelect={this.props.handlePrint}>
							<Dropdown.Toggle  disabled={!state.status || !this.props.canSave || !state.route_id}>
								<Glyphicon glyph="print" />
							</Dropdown.Toggle>
							<Dropdown.Menu>
								<MenuItem eventKey={1}>Экспорт в файл</MenuItem>
								<MenuItem eventKey={2}>Печать</MenuItem>
							</Dropdown.Menu>
						</Dropdown>
		      	<Button onClick={this.handleSubmit.bind(this)} disabled={!this.props.canSave || IS_DISPLAY}>Сохранить</Button>
					</Div>
	      </Modal.Footer>

				<RouteFormWrap element={route}
											 onFormHide={this.onFormHide.bind(this)}
											 showForm={this.state.showRouteForm}
											 fromMission={true}/>
			</Modal>
		)
	}
}

export default connectToStores(MissionForm, ['objects', 'employees', 'missions', 'routes', 'geoObjects']);
