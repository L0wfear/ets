import React, {Component} from 'react';
import connectToStores from 'flummox/connect';
import { Modal, Row, Col, FormControls, Button, DropdownButton, Dropdown, MenuItem, Glyphicon } from 'react-bootstrap';
import Field from '../ui/Field.jsx';
import Div from '../ui/Div.jsx';
import RouteInfo from '../route/RouteInfo.jsx';
import RouteFormWrap from '../route/RouteFormWrap.jsx';
import ODHList from '../route/ODHList.jsx';
import { isEmpty } from 'utils/functions';
import { DutyMissionForm } from './DutyMissionForm.jsx';

class MissionTemplateForm extends DutyMissionForm {

	constructor(props) {
		super(props);
	}

	render() {

		let state = this.props.formState;
		let errors = this.props.formErrors;

		const { missionSourcesList = [], carsList = [] } = this.props;
		const { technicalOperationsList = [], routesList = [] } = this.state;

    const TECH_OPERATIONS = technicalOperationsList.map(({id, name}) => ({value: id, label: name}));
    const MISSION_SOURCES = missionSourcesList.map(({id, name}) => ({value: id, label: name}));
    let ROUTES = routesList.map(({id, name}) => ({value: id, label: name}));
		const CARS = carsList.map( c => ({value: c.asuods_id, label: `${c.gov_number} [${c.model_name}]`}));

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
						</Col>

            <Col md={6}>
              <Field type="string" label="Комментарий" value={state.comment} onChange={this.handleChange.bind(this, 'comment')} error={errors['comment']} />
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

						  <Div className="route-odhs-list" hidden={this.state.selectedRoute === null}>
								{/*<ODHList showSelectable={true} odh_list={odh_list} />*/}
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
