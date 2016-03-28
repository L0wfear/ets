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
import { TechnicalOperationService } from 'api/Services';


let getTechOperationById = (id) => {
  const { flux } = window.__ETS_CONTAINER__;
  const objectsStore = flux.getStore('objects');
  return objectsStore.getTechOperationById(id);
};

export class DutyMissionForm extends Form {

	constructor(props) {
		super(props);

		this.state = {
			selectedRoute: null,
			showRouteForm: false,
      routesList: [],

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

	async handleTechnicalOperationChange(v) {
		this.handleChange('technical_operation_id', v);
    this.handleChange('route_id', undefined);
    this.handleChange('car_mission_id', 0);
    this.context.flux.getActions('missions').getMissions(v);

    let routesList = await this.context.flux.getActions('routes')
                                            .getRoutesByTechnicalOperation(v);
    this.setState({routesList});
	}

  handleBrigadeIdListChange(v) {
    let data = v.split(',');
    let { employeesList = [] } = this.props;
    let brigade_employee_id_list = employeesList.filter(e => data.indexOf(e.id.toString()) > -1);
    this.props.handleFormChange('brigade_employee_id_list', brigade_employee_id_list);
  }

	async componentDidMount() {
		const mission = this.props.formState;
		const { flux } = this.context;
    let objectsActions = flux.getActions('objects')
		let technicalOperationsActions = flux.getActions('technical_operation');
		let routesActions = flux.getActions('routes');
		let missionsActions = flux.getActions('missions');

		let { selectedRoute } = this.state;
		let { routesList } = this.props;

		if (!isEmpty(mission.route_id)) {
			let route = await routesActions.getRouteById(mission.route_id, true);
					selectedRoute = route.result.length ? route.result[0] : null;
    }

    if (!isEmpty(mission.technical_operation_id)) {
			routesList = await routesActions.getRoutesByTechnicalOperation(mission.technical_operation_id);
		}

  	flux.getActions('missions').getMissions(mission.technical_operation_id);
    const technicalOperationsList = await technicalOperationsActions.getTechnicalOperationsWithBrigades();
    this.setState({
      selectedRoute,
      technicalOperationsList,
      routesList,
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
		const { flux } = this.context;
		let routesActions = flux.getActions('routes');

		if (props.lastCreatedRouteId !== null && props.lastCreatedRouteId !== this.props.lastCreatedRouteId) {
			this.handleChange('route_id', props.lastCreatedRouteId);
			setTimeout(async () => { //no time sry
				let route = await routesActions.getRouteById(props.lastCreatedRouteId, true);
				let selectedRoute = route.result.length ? route.result[0] : null;
				let routesList = await routesActions.getRoutesByTechnicalOperation(props.formState.technical_operation_id);
				this.setState({
					selectedRoute,
					routesList,
				});
			}, 500);
		}
	}

	render() {

		let state = this.props.formState;
		let errors = this.props.formErrors;
    console.info('FORM STATE IS', state);

		const { missionSourcesList = [], employeesList = [], missionsList = [] } = this.props;
    const { technicalOperationsList = [], routesList = [] } = this.state;

    const TECH_OPERATIONS = technicalOperationsList.map(({id, name}) => ({value: id, label: name}));
    const MISSION_SOURCES = missionSourcesList.map(({id, name}) => ({value: id, label: name}));
    const ROUTES = routesList.map(({id, name}) => ({value: id, label: name}));
    const EMPLOYEES = employeesList.map( d => ({value: d.id, label: `${d.last_name} ${d.first_name} ${d.middle_name}`}));
    const MISSIONS = missionsList.map( ({id, number, technical_operation_id}) => {
			const techOperation = getTechOperationById(technical_operation_id);
			return {id, value: id, label: `№${number} (${techOperation.name})`};
		});

		let IS_CREATING = !!!state.number;
    let IS_CLOSING = state.status && state.status === 'assigned';
    let IS_CLOSED = state.status === 'complete' || state.status === 'fail';

    let title = `Наряд-задание № ${state.number || ''}`;

    if (IS_CREATING) {
      title = "Создание наряд-задания"
    }

		let route = this.state.selectedRoute;
		let IS_DISPLAY = !!state.status && state.status !== 'not_assigned';

		return (
			<Modal {...this.props} bsSize="large">

				<Modal.Header closeButton>
	          <Modal.Title id="contained-modal-title-lg">{title}</Modal.Title>
				</Modal.Header>

	      <Modal.Body>

					<Row>

						<Col md={6}>
              <Field type="select" label="Технологическая операция" error={errors['technical_operation_id']}
											disabled={IS_DISPLAY || !!state.route_id}
                      options={TECH_OPERATIONS}
                      value={state.technical_operation_id}
                      onChange={this.handleTechnicalOperationChange.bind(this)}/>
						</Col>

            <Col md={6}>
              <Row>
    				 		<Col md={6}>
    				   		<label>Время выполнения, планируемое</label>
    				 			<Div>c <Datepicker date={state.plan_date_start} onChange={this.handleChange.bind(this, 'plan_date_start')} disabled={IS_DISPLAY}/></Div>
    				   	</Col>
    				   	<Col md={6}>
                  <label style={{minHeight: 15}}></label>
    				 			<Div>по <Datepicker date={state.plan_date_end} onChange={this.handleChange.bind(this, 'plan_date_end')} disabled={IS_DISPLAY}/></Div>
    				   	</Col>

                <Div hidden={!IS_CLOSING}>
      				 		<Col md={6}>
      				   		<label>Время выполнения, фактическое</label>
      				 			<Div>c <Datepicker date={state.fact_date_start} onChange={this.handleChange.bind(this, 'fact_date_start')} disabled={IS_CLOSED}/></Div>
      				   	</Col>
      				   	<Col md={6}>
                    <label style={{minHeight: 15}}></label>
      				 			<Div>по <Datepicker date={state.fact_date_end} onChange={this.handleChange.bind(this, 'fact_date_end')} disabled={IS_CLOSED}/></Div>
      				   	</Col>
                </Div>
              </Row>
            </Col>



					</Row>

          <Row>
            <Col md={6}>
              <Field type="select" label="Бригадир" error={errors['foreman_id']}
                     disabled={IS_DISPLAY}
                     options={EMPLOYEES}
                     value={state.foreman_id}
                     onChange={this.handleChange.bind(this, 'foreman_id')}/>
            </Col>

            <Col md={6}>
              <Field type="select" label="Бригада" error={errors['brigade_employee_id_list']}
                     multi={true}
                     disabled={IS_DISPLAY}
                     options={EMPLOYEES}
                     value={state.brigade_employee_id_list.filter(b => b.id || b.employee_id).map(b => b.id || b.employee_id).join(',')}
                     onChange={this.handleBrigadeIdListChange.bind(this)}/>
            </Col>
          </Row>


	      	<Row>
	      		<Col md={6}>
              <Field type="select" label="Источник получения задания" error={errors['mission_source_id']}
										 disabled={IS_DISPLAY}
                     options={MISSION_SOURCES}
                     value={state.mission_source_id}
                     onChange={this.handleChange.bind(this, 'mission_source_id')}/>
	      		</Col>
            <Col md={6}>
              <Field type="string" label="Комментарий" value={state.comment} onChange={this.handleChange.bind(this, 'comment')} error={errors['comment']} />
            </Col>
	      	</Row>

          <Row>
	      		<Col md={6}></Col>
            <Col md={6}>
              <Field type="select" label="Задание на ТС" error={errors['car_mission_id']}
										 disabled={IS_DISPLAY}
                     options={MISSIONS}
                     value={state.car_mission_id}
                     onChange={this.handleChange.bind(this, 'car_mission_id')}/></Col>
	      	</Row>

	      	<Row>
            <Col md={6}>
              <Field type="select" label="Маршрут" error={errors['route_id']}
										 disabled={IS_DISPLAY || !!!state.technical_operation_id}
                     options={ROUTES}
                     value={state.route_id}
                     onChange={this.handleRouteIdChange.bind(this)}/>
						  <Div hidden={state.route_id}>
							  <Button onClick={this.createNewRoute.bind(this)} disabled={IS_DISPLAY || !state.technical_operation_id}>Создать новый</Button>
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
					<Div className="inline-block" hidden={state.status === 'complete'}>
		      	<Button onClick={this.props.onPrint} disabled={!this.props.canSave || IS_DISPLAY || state.status !== 'not_assigned'}>{'Выдать'}</Button>
		      	<Button onClick={this.handleSubmit.bind(this)} disabled={!this.props.canSave || IS_DISPLAY}>{'Сохранить'}</Button>
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

export default connectToStores(DutyMissionForm, ['objects', 'employees', 'missions', 'routes']);
