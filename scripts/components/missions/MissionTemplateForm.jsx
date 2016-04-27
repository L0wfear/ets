import React, {Component} from 'react';
import connectToStores from 'flummox/connect';
import { Modal, Row, Col, FormControls, Button, DropdownButton, Dropdown, MenuItem, Glyphicon } from 'react-bootstrap';
import Field from '../ui/Field.jsx';
import Div from '../ui/Div.jsx';
import RouteInfo from '../route/RouteInfo.jsx';
import RouteFormWrap from '../route/RouteFormWrap.jsx';
import ODHList from '../route/ODHList.jsx';
import { isEmpty } from 'utils/functions';
import { MissionForm } from './MissionForm.jsx';

class MissionTemplateForm extends MissionForm {

	constructor(props) {
		super(props);
	}

	async componentDidMount() {
		const mission = this.props.formState;
		const { flux } = this.context;
		let objectsActions = flux.getActions('objects')
		let technicalOperationsActions = flux.getActions('technical_operation');
		let routesActions = flux.getActions('routes');
		let missionsActions = flux.getActions('missions');

		let { selectedRoute } = this.state;
		let { technicalOperationsList, routesList, carsList } = this.props;

		if (!isEmpty(mission.route_id)) {
			let route = await routesActions.getRouteById(mission.route_id, true);
					selectedRoute = route.result.length ? route.result[0] : null;
		}

		if (!isEmpty(mission.technical_operation_id)){
			routesList = await routesActions.getRoutesByTechnicalOperation(mission.technical_operation_id);
		}

		technicalOperationsList = await technicalOperationsActions.getTechnicalOperationsByCarId(mission.car_id);
		let carsListResponse = await objectsActions.getCars(mission.technical_operation_id);
		carsList = carsListResponse.result;
		missionsActions.getMissionSources();

		this.setState({
			carsList,
			technicalOperationsList,
			routesList,
			selectedRoute,
		});
	}

	render() {

		let state = this.props.formState;
		let errors = this.props.formErrors;

		const { missionSourcesList = [] } = this.props;
		const { technicalOperationsList = [], routesList = [], carsList = [] } = this.state;

    const TECH_OPERATIONS = technicalOperationsList.map(({id, name}) => ({value: id, label: name}));
    const MISSION_SOURCES = missionSourcesList.map(({id, name}) => ({value: id, label: name}));
    const ROUTES = routesList.map(({id, name}) => ({value: id, label: name}));
		const CARS = carsList.map( c => ({value: c.asuods_id, label: `${c.gov_number} [${c.special_model_name || ''}${c.special_model_name ? '/' : ''}${c.model_name || ''}]`}));

    console.log('form state is ', state);

		let IS_CREATING = true;

    let title = `Задание`;

    if (IS_CREATING) {
      title = "Создание шаблона задания"
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
									options={TECH_OPERATIONS}
									disabled={!!state.route_id}
									value={state.technical_operation_id}
									onChange={this.handleTechnicalOperationChange.bind(this)}/>
              <Field type="number" label="Количество проходов" error={errors['passes_count']}
  									 value={state.passes_count} onChange={this.handleChange.bind(this, 'passes_count')} min="0"/>
						</Col>

				 		<Col md={6}>
							<Field type="select" label="Транспортное средство" error={errors['car_id']}
									options={CARS}
									disabled={isEmpty(state.technical_operation_id)}
									value={state.car_id}
									onChange={this.handleChange.bind(this, 'car_id')}/>
							<Field type="string"
								label="Комментарий"
								value={state.comment}
								onChange={this.handleChange.bind(this, 'comment')}
								error={errors['comment']} />
				   	</Col>
					</Row>

	      	<Row>
            <Col md={6}>
              <Field type="select" label="Маршрут" error={errors['route_id']}
                     options={ROUTES}
                     value={state.route_id}
										 disabled={!!!state.technical_operation_id}
                     onChange={this.handleRouteIdChange.bind(this)}
										 clearable={true}/>
							<Div hidden={state.route_id}>
								<Button onClick={this.createNewRoute.bind(this)} disabled={!state.technical_operation_id}>Создать новый</Button>
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
		      	<Button onClick={this.handleSubmit.bind(this)} disabled={!this.props.canSave}>{'Сохранить'}</Button>
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

export default connectToStores(MissionTemplateForm, ['objects', 'employees', 'missions', 'routes']);
