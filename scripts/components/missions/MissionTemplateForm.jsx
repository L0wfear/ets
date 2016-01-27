import React, {Component} from 'react';
import connectToStores from 'flummox/connect';
import { Modal, Row, Col, FormControls, Button, DropdownButton, Dropdown, MenuItem, Glyphicon } from 'react-bootstrap';
import Field from '../ui/Field.jsx';
import Div from '../ui/Div.jsx';
import RouteInfo from '../route/RouteInfo.jsx';
import ODHList from '../route/ODHList.jsx';

class MissionForm extends Component {

	constructor(props) {
		super(props);

		this.state = {
			selectedRoute: null,
		};
	}

	handleChange(field, e) {
		this.props.handleFormChange(field, e);
	}

  handleSubmit() {
    console.log('submitting mission template form', this.props.formState);
    this.props.onSubmit(this.props.formState);
  }

	handleRouteIdChange(v) {
		this.handleChange('route_id', v);
		const { flux } = this.context;
		flux.getActions('routes').getRouteById(v).then(r => {
			this.setState({selectedRoute: r.result.length ? r.result[0] : null});
		});
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

	render() {

		let state = this.props.formState;
		let errors = this.props.formErrors;

		const { workKindsList = [], techOperationsList = [], missionSourcesList = [], routesList = [], carsList = [] } = this.props;

    const WORK_KINDS = workKindsList.map(({id, name}) => ({value: id, label: name}));
    const TECH_OPERATIONS = techOperationsList.map(({id, name}) => ({value: id, label: name}));
    const MISSION_SOURCES = missionSourcesList.map(({id, name}) => ({value: id, label: name}));
    const ROUTES = routesList.map(({id, name}) => ({value: id, label: name}));
		const CARS = carsList.map( c => ({value: c.asuods_id, label: c.gov_number + ' [' + c.model + ']'}));

    console.log('form state is ', state);

		let IS_CREATING = true;
    let IS_POST_CREATING = false;
		let IS_DISPLAY = false;

    let title = `Задание № ${state.number || ''}`;

    if (IS_CREATING) {
      title = "Создание шаблона задания"
    }

		return (
			<Modal {...this.props} bsSize="large">

				<Modal.Header closeButton>
	          <Modal.Title id="contained-modal-title-lg">{title}</Modal.Title>
				</Modal.Header>

	      <Modal.Body>

		      <Row>
		      	<Col md={6}>
		      		{/*Организация: АвД Жилищник "Крылатское" <br/>*/}
		      	</Col>
		      </Row>

					<Row>
						<Col md={6}>
							<Field type="select" label="Технологическая операция" error={errors['technical_operation_id']}
											options={TECH_OPERATIONS}
											value={state.technical_operation_id}
											onChange={this.handleChange.bind(this, 'technical_operation_id')}/>
						</Col>

				 		<Col md={6}>
							<Field type="select" label="Транспортное средство" error={errors['car_id']}
											options={CARS}
											value={state.car_id}
											onChange={this.handleChange.bind(this, 'car_id')}/>
				   	</Col>
					</Row>

	      	<Row>
            <Col md={6}>
              <Field type="number" label="Количество проходов" error={errors['passes_count']}
  									 value={state.passes_count} onChange={this.handleChange.bind(this, 'passes_count')} min="0"/>
              <Field type="select" label="Маршрут" error={errors['route_id']}
                     options={ROUTES}
                     value={state.route_id}
                     onChange={this.handleRouteIdChange.bind(this)}/>

						  <Div className="route-odhs-list" hidden={this.state.selectedRoute === null}>
								<h4>Список ОДХ/ДТ</h4>
								<ODHList showSelectable={true} object_list={this.state.selectedRoute ? this.state.selectedRoute.object_list : []} />
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

			</Modal>
		)
	}
}

MissionForm.contextTypes = {
	flux: React.PropTypes.object,
};

export default connectToStores(MissionForm, ['objects', 'employees', 'missions', 'routes']);
