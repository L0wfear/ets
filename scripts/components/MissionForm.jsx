import React, {Component} from 'react';
import connectToStores from 'flummox/connect';
import { Modal, Input, Label, Row, Col, FormControls, Button, DropdownButton, Dropdown, MenuItem, Glyphicon } from 'react-bootstrap';
import EtsSelect from './ui/EtsSelect.jsx';
import Datepicker from './ui/DatePicker.jsx';
import Field from './ui/Field.jsx';
import Div from './ui/Div.jsx';
import moment from 'moment';
import { getFuelOperations, getFuelRatesByCarModel } from '../adapter.js';
import cx from 'classnames';
import { isNotNull } from '../utils/functions.js';

let getDateWithoutTZ = (date, format = true) => {
	if (typeof date === 'string') date = date.replace('.000000Z', '');
	date = moment(date).toDate();
	return date;
};

let getFIOById = (employees, id, fullFlag = false) => {
	const employee = _.find(employees, d => d.id === id) || null;
	if (!employee) return '';
	let result = employee.last_name + ' ';
	result += fullFlag ? `${employee.first_name} ${employee.middle_name}` : `${employee.first_name[0]}. ${employee.middle_name[0]}.`;
	return result;
}

let getCarById = (cars, id) => {
	const car = _.find(cars, c => c.asuods_id === id) || {};
	if (car.gov_number && car.model) {
		car.label = car.gov_number + ' [' + car.model + ']';
	}
	return car;
};

class MissionForm extends Component {

	constructor(props) {
		super(props);

		this.state = {
			operations: [],
			fuelRates: [],
			fuel_correction_rate: null,
		}
	}

	handleChange(field, e) {
		this.props.handleFormChange(field, e);
	}

  handleSubmit() {
    console.log('submitting mission form', this.props.formState);
    this.props.onSubmit(this.props.formState);
  }

	componentDidMount() {
		console.log(this.props);
		// if (this.props.formStage === 'closing') {
		// 	const car = _.find(this.props.carsList, c => c.asuods_id === this.props.formState.car_id) || {}
		// 	const car_model_id = car.model_id;
		// 	const fuel_correction_rate = car.fuel_correction_rate || null;
		// 	getFuelRatesByCarModel(car_model_id).then(r => {
		// 		const fuelRates = r.result.map( ({operation_id, rate_on_date}) => ({operation_id, rate_on_date}) );
		// 		getFuelOperations().then( fuelOperations => {
		// 			const operations =  _.filter(fuelOperations.result, op => _.find(fuelRates, fr => fr.operation_id === op.ID));
		// 			this.setState({fuelRates, operations, fuel_correction_rate});
		// 		});
		// 	});
		// } else if (this.props.formStage === 'display') {
		// 	getFuelOperations().then( fuelOperations => {
		// 		this.setState({operations: fuelOperations.result});
		// 	});
		// }
		// this.context.flux.getActions('employees').getEmployees();
	}

	render() {

		let state = this.props.formState;
    let stage = this.props.formStage;
		let errors = this.props.formErrors;

		const { workKindsList = [], techOperationsList = [], missionSourcesList = [], routesList = [] } = this.props;

    const WORK_KINDS = workKindsList.map(({id, name}) => ({value: id, label: name}));
    const TECH_OPERATIONS = techOperationsList.map(({id, name}) => ({value: id, label: name}));
    const MISSION_SOURCES = missionSourcesList.map(({id, name}) => ({value: id, label: name}));
    const ROUTES = routesList.map(({id, name}) => ({value: id, label: name}));

    console.log('form stage is ', stage, 'form state is ', state);

		let IS_CREATING = stage === 'creating';
		let IS_CLOSING = stage === 'closing';
    let IS_POST_CREATING = stage === 'post-creating'
		let IS_DISPLAY = stage === 'display';

    let title = `Задание № ${state.number || ''}`;

    if (IS_CREATING) {
      title = "Создание задания"
    }

    // if (IS_CLOSING) {
    //   title = "Закрыть путевой лист"
    // }
    //
    // if (IS_DISPLAY) {
    //   title = "Просмотр путевого листа "
    // }
    //
    // if (IS_POST_CREATING) {
    //   title = "Создание нового путевого листа"
    // }

    // description: "desAAAAe"
    // id: 1
    // mission_source_id: 1
    // name: "test_mission_111"
    // passes_count: 778
    // technical_operation_id: 8

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
							<Field type="select" label="Вид работ" error={errors['work_kind_id']}
										 options={WORK_KINDS}
										 value={state.work_kind_id}
										 onChange={this.handleChange.bind(this, 'work_kind_id')}/>
						</Col>

				 		<Col md={3}>
				   		<label>Выезд план</label>
				 			<Datepicker date={ getDateWithoutTZ(state.plan_departure_date) } onChange={this.handleChange.bind(this, 'plan_departure_date')}/>
				   	</Col>
				   	<Col md={3}>
				 			<label>Возвращение план</label>
				 			<Datepicker date={ getDateWithoutTZ(state.plan_arrival_date) } onChange={this.handleChange.bind(this, 'plan_arrival_date')}/>
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
              <Field type="select" label="Источник получения задания" error={errors['mission_source_id']}
                     options={MISSION_SOURCES}
                     value={state.mission_source_id}
                     onChange={this.handleChange.bind(this, 'mission_source_id')}/>
	      		</Col>
	      	</Row>

	      	<Row>
            <Col md={6}>
              <Field type="number" label="Количество проходов" error={errors['passes_count']}
  									 value={state.passes_count} onChange={this.handleChange.bind(this, 'passes_count')} />
              <Field type="select" label="Маршрут" error={errors['route_id']}
                     options={ROUTES}
                     value={state.route_id}
                     onChange={this.handleChange.bind(this, 'route_id')}/>
            </Col>
            <Col md={6}>
            {/*КАРТА*/}
            </Col>
	      	</Row>

	      </Modal.Body>

	      <Modal.Footer>
					<Div hidden={state.status === 'closed'}>
		      	<Button onClick={this.handleSubmit.bind(this)} disabled={false/*!this.props.canSave*/}>{this.props.formStage === 'closing' ? 'Закрыть ПЛ' : 'Сохранить'}</Button>
					</Div>
	      </Modal.Footer>

			</Modal>
		)
	}
}

MissionForm.contextTypes = {
	flux: React.PropTypes.object,
};

export default connectToStores(MissionForm, ['objects', 'employees', 'missions']);
