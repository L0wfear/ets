import React, {Component} from 'react';
import connectToStores from 'flummox/connect';
import { Modal, Input, Label, Row, Col, FormControls, Button, DropdownButton, Dropdown, MenuItem, Glyphicon } from 'react-bootstrap';
import EtsSelect from './ui/EtsSelect.jsx';
import Datepicker from './ui/DatePicker.jsx';
import Field from './ui/Field.jsx';
import Div from './ui/Div.jsx';
import moment from 'moment';
import { monthes } from '../utils/dates.js';
import Taxes from './waybill/Taxes.jsx';
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

let MastersSelect = (props) => {
	let options = props.employees.filter( e => [2, 4, 5, 7, 14].indexOf(e.position_id) > -1);
			options = options.map( m => ({value: m.id, data: m, label: `${m.last_name} ${m.first_name} ${m.middle_name}`}));
	return 	<EtsSelect options={options}
										 clearable={true}
										 searchable={true}
										 {...props} />
};

class WaybillForm extends Component {

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
    console.log('submitting waybill form', this.props.formState);
    this.props.onSubmit(this.props.formState);
  }

	componentDidMount() {
		console.log(this.props);
		if (this.props.formStage === 'closing') {
			const car = _.find(this.props.carsList, c => c.asuods_id === this.props.formState.car_id) || {}
			const car_model_id = car.model_id;
			const fuel_correction_rate = car.fuel_correction_rate || null;
			getFuelRatesByCarModel(car_model_id).then(r => {
				const fuelRates = r.result.map( ({operation_id, rate_on_date}) => ({operation_id, rate_on_date}) );
				getFuelOperations().then( fuelOperations => {
					const operations =  _.filter(fuelOperations.result, op => _.find(fuelRates, fr => fr.operation_id === op.ID));
					this.setState({fuelRates, operations, fuel_correction_rate});
				});
			});
		} else if (this.props.formStage === 'display') {
			getFuelOperations().then( fuelOperations => {
				this.setState({operations: fuelOperations.result});
			});
		}
		this.context.flux.getActions('employees').getEmployees();
	}

	onDriverChange(v) {
		this.handleChange('driver_id', v);
		const driver = _.find(this.props.driversList, d => d.id === v) || {};
		const prefer_car = driver.prefer_car || null;
		if (prefer_car) {
			this.handleChange('car_id', prefer_car);
			const waybillsListSorted = _(this.props.waybillsList).filter(w => w.status === 'closed').sortBy('id').value().reverse();
			const lastCarUsedWaybill = _.find(waybillsListSorted, w => w.car_id === prefer_car);
			if (isNotNull(lastCarUsedWaybill)) {
				if (isNotNull(lastCarUsedWaybill.fuel_end)) {
					this.handleChange('fuel_start', lastCarUsedWaybill.fuel_end);
				}
				if (isNotNull(lastCarUsedWaybill.odometr_end)) {
					this.handleChange('odometr_start', lastCarUsedWaybill.odometr_end);
				}
				if (isNotNull(lastCarUsedWaybill.motohours_end)) {
					this.handleChange('motohours_start', lastCarUsedWaybill.motohours_end);
				}
				if (isNotNull(lastCarUsedWaybill.motohours_equip_end)) {
					this.handleChange('motohours_equip_start', lastCarUsedWaybill.motohours_equip_end);
				}
			}
		}
	}

	onCarChange(v) {
		this.handleChange('car_id', v);
		const waybillsListSorted = _(this.props.waybillsList).filter(w => w.status === 'closed').sortBy('id').value().reverse();
		const lastCarUsedWaybill = _.find(waybillsListSorted, w => w.car_id === v);
		console.log(lastCarUsedWaybill);
		if (isNotNull(lastCarUsedWaybill)) {
			if (isNotNull(lastCarUsedWaybill.fuel_end)) {
				this.handleChange('fuel_start', lastCarUsedWaybill.fuel_end);
			}
			if (isNotNull(lastCarUsedWaybill.odometr_end)) {
				this.handleChange('odometr_start', lastCarUsedWaybill.odometr_end);
			}
			if (isNotNull(lastCarUsedWaybill.motohours_end)) {
				this.handleChange('motohours_start', lastCarUsedWaybill.motohours_end);
			}
			if (isNotNull(lastCarUsedWaybill.motohours_equip_end)) {
				this.handleChange('motohours_equip_start', lastCarUsedWaybill.motohours_equip_end);
			}
		} else {
			this.handleChange('fuel_start', 0);
			this.handleChange('odometr_start', 0);
			this.handleChange('motohours_start', 0);
			this.handleChange('motohours_equip_start', 0);
		}
	}

	render() {

		let state = this.props.formState;
    let stage = this.props.formStage;
		let errors = this.props.formErrors;

		const { carsList = [], driversList = [], employeesList = [], fuelTypes = [] } = this.props;
		const CARS = carsList.map( c => ({value: c.asuods_id, label: c.gov_number + ' [' + c.model + ']'}));
		const FUEL_TYPES = fuelTypes.map(({ID, NAME}) => ({value: ID, label: NAME}));
		const DRIVERS = driversList.map( d => ({value: d.id, label: `[${d.personnel_number}] ${d.last_name} ${d.first_name} ${d.middle_name}`}));
		const MASTERS = employeesList.filter( e => [2, 4, 5, 7, 14].indexOf(e.position_id) > -1).map( m => ({value: m.id, data: m, label: `${m.last_name} ${m.first_name} ${m.middle_name}`}));

    console.log('form stage is ', stage, 'form state is ', state);

		let IS_CREATING = stage === 'creating';
		let IS_CLOSING = stage === 'closing';
    let IS_POST_CREATING = stage === 'post-creating'
		let IS_DISPLAY = stage === 'display';

    let title = '';

    if (IS_CREATING) {
      title = "Создать новый путевой лист"
    }

    if (IS_CLOSING) {
      title = "Закрыть путевой лист"
    }

    if (IS_DISPLAY) {
      title = "Просмотр путевого листа "
    }

    if (IS_POST_CREATING) {
      title = "Создание нового путевого листа"
    }

		return (
			<Modal {...this.props} bsSize="large">

				<Modal.Header closeButton>
	          <Modal.Title id="contained-modal-title-lg">{title} { IS_POST_CREATING && '(возможна корректировка)'}</Modal.Title>
				</Modal.Header>

	      <Modal.Body>

		      <Row>
		      	<Col md={6}>
		      		{/*Организация: АвД Жилищник "Крылатское" <br/>*/}
		      	</Col>
		      </Row>

					<Row>
						<Col md={6}>
							<Field type="select" label="Ответственное лицо" error={errors['responsible_person_id']}
										 hidden={!(IS_CREATING || IS_POST_CREATING)}
										 options={MASTERS}
										 value={state.responsible_person_id}
										 onChange={this.handleChange.bind(this, 'responsible_person_id')}/>

							<Field type="string" label="Ответственное лицо" readOnly={true} hidden={IS_CREATING || IS_POST_CREATING}
										 value={getFIOById(employeesList, state.responsible_person_id, true)}/>
						</Col>


						<Div hidden={!(IS_CREATING || IS_POST_CREATING)}>
					 		<Col md={3}>
					   		<label>Выезд план</label>
					 			<Datepicker date={ getDateWithoutTZ(state.plan_departure_date) } onChange={this.handleChange.bind(this, 'plan_departure_date')}/>
					   	</Col>
					 	</Div>
						<Div hidden={!(IS_CREATING || IS_POST_CREATING)}>
					   	<Col md={3}>
					 			<label>Возвращение план</label>
					 			<Datepicker date={ getDateWithoutTZ(state.plan_arrival_date) } onChange={this.handleChange.bind(this, 'plan_arrival_date')}/>
					   	</Col>
						</Div>
						<Div hidden={!IS_CLOSING}>
					   	<Col md={3}>
								<label>Выезд план</label>
					 			<Datepicker date={ getDateWithoutTZ(state.plan_departure_date) } disabled={true} onChange={() => true}/>
					   		<label>Выезд факт</label>
					 			<Datepicker date={ getDateWithoutTZ(state.fact_departure_date) } onChange={this.handleChange.bind(this, 'fact_departure_date')}/>
					   	</Col>
					  	<Col md={3}>
								<label>Возвращение план</label>
					 			<Datepicker date={ getDateWithoutTZ(state.plan_arrival_date) } disabled={true} onChange={() => true}/>
					 			<label>Возвращение факт</label>
					 			<Datepicker date={ getDateWithoutTZ(state.fact_arrival_date) } onChange={this.handleChange.bind(this, 'fact_arrival_date')}/>
					   	</Col>
						</Div>
					  <Div hidden={!IS_DISPLAY}>
					    <Col md={3}>
					      <label>Выезд план</label><br/>{moment.utc(state.plan_departure_date).format('YYYY-MM-DD HH:mm')}<br/>
					      <label>Выезд факт</label><br/>{moment.utc(state.fact_departure_date).format('YYYY-MM-DD HH:mm')}
					    </Col>
					    <Col md={3}>
					      <label>Возвращение план</label><br/>{moment.utc(state.plan_arrival_date).format('YYYY-MM-DD HH:mm')}<br/>
					      <label>Возвращение факт</label><br/>{moment.utc(state.fact_arrival_date).format('YYYY-MM-DD HH:mm')}
					    </Col>
					  </Div>
					</Row>

	      	<Row>
	      		<Col md={6}>
							<Field type="select" label="Водитель (возможен поиск по табельному номеру)" error={errors['driver_id']}
										 hidden={!(IS_CREATING || IS_POST_CREATING)}
										 options={DRIVERS}
										 value={state.driver_id}
										 onChange={this.onDriverChange.bind(this)}/>

							<Field type="string" label="Водитель" readOnly={true} hidden={IS_CREATING || IS_POST_CREATING}
										 value={getFIOById(driversList, state.driver_id, true)}/>
	          </Col>
	      		<Col md={6}>
							<Field type="select" label="Транспортное средство (поиск по госномеру)" error={errors['car_id']}
										 hidden={!(IS_CREATING || IS_POST_CREATING)}
										 options={CARS}
										 value={state.car_id}
										 onChange={this.onCarChange.bind(this)}/>

							<Field type="string" label="Транспортное средство" readOnly={true} hidden={IS_CREATING || IS_POST_CREATING}
										 value={getCarById(carsList, state.car_id).label}/>
	      		</Col>
	      	</Row>

	      	<Row>
	      		<Col md={4}>
		      		<h4>Одометр</h4>
							<Field type="number" label="Выезд, км" error={errors['odometr_start']}
										 value={state.odometr_start} disabled={IS_CLOSING || IS_DISPLAY} onChange={this.handleChange.bind(this, 'odometr_start')} />

 							<Field type="number" label="Возврат, км" error={errors['odometr_end']}
 										 value={state.odometr_end} hidden={!(IS_CLOSING || IS_DISPLAY )} disabled={IS_DISPLAY} onChange={this.handleChange.bind(this, 'odometr_end')} />

 							<Field type="number" label="Пробег, км"
 										 value={state.odometr_diff} hidden={!(IS_CLOSING || IS_DISPLAY )} disabled />
	      		</Col>
	      		<Col md={4}>
		      		<h4>Счетчик моточасов</h4>
							<Field type="number" label="Выезд, м/ч" error={errors['motohours_start']}
										 value={state.motohours_start} disabled={IS_CLOSING || IS_DISPLAY} onChange={this.handleChange.bind(this, 'motohours_start')} />

							<Field type="number" label="Возврат, м/ч" error={errors['motohours_end']}
 										 value={state.motohours_end} hidden={!(IS_CLOSING || IS_DISPLAY )} disabled={IS_DISPLAY} onChange={this.handleChange.bind(this, 'motohours_end')} />

							<Field type="number" label="Пробег, м/ч"
 										 value={state.motohours_diff} hidden={!(IS_CLOSING || IS_DISPLAY )} disabled />
	      		</Col>
	      		<Col md={4}>
		      		<h4>Счетчик моточасов обор-ния</h4>
							<Field type="number" label="Выезд, м/ч" error={errors['motohours_equip_start']}
										 value={state.motohours_equip_start} disabled={IS_CLOSING || IS_DISPLAY} onChange={this.handleChange.bind(this, 'motohours_equip_start')} />

							<Field type="number" label="Возврат, м/ч" error={errors['motohours_equip_end']}
 										 value={state.motohours_equip_end} hidden={!(IS_CLOSING || IS_DISPLAY )} disabled={IS_DISPLAY} onChange={this.handleChange.bind(this, 'motohours_equip_end')} />

							<Field type="number" label="Пробег, м/ч"
 										 value={state.motohours_equip_diff} hidden={!(IS_CLOSING || IS_DISPLAY )} disabled />
	      		</Col>
	      	</Row>

	      	<Row>

	      		<Col md={4}>
		      		<h4> Топливо </h4>

							<Field type="select" label="Тип топлива" error={errors['fuel_type_id']}
										 disabled={IS_CLOSING || IS_DISPLAY}
										 options={FUEL_TYPES}
										 value={state.fuel_type_id}
										 onChange={this.handleChange.bind(this, 'fuel_type_id')} />

							<Field type="number" label="Выезд, л" error={errors['fuel_start']}
										 value={state.fuel_start} disabled={IS_CLOSING || IS_DISPLAY} onChange={this.handleChange.bind(this, 'fuel_start')} />

						  <Field type="number" label="Выдать, л" error={errors['fuel_to_give']}
										 value={state.fuel_to_give} disabled={IS_CLOSING || IS_DISPLAY} onChange={this.handleChange.bind(this, 'fuel_to_give')} />

							<Field type="number" label="Выдано, л" error={errors['fuel_given']}
									 	 value={state.fuel_given} hidden={!(IS_CLOSING || IS_DISPLAY )} disabled={IS_DISPLAY} onChange={this.handleChange.bind(this, 'fuel_given')} />

							<Field type="number" label="Возврат, л" error={errors['fuel_end']}
									 	 value={state.fuel_end} hidden={!(IS_CLOSING || IS_DISPLAY )} disabled={IS_DISPLAY} onChange={this.handleChange.bind(this, 'fuel_end')} />

	      		</Col>

	      		<Col md={8}>
							<Taxes hidden={!(IS_DISPLAY || IS_CLOSING) || state.status === 'draft'}
										readOnly={!IS_CLOSING}
										car={getCarById(carsList, state.car_id)}
										taxes={state.taxes}
										operations={this.state.operations}
										fuelRates={this.state.fuelRates}
										onChange={this.handleChange.bind(this, 'taxes')}
										correctionRate={this.state.fuel_correction_rate}
										availableOperations={this.state.availableOperations}/>
	      		</Col>
	      	</Row>

	      </Modal.Body>

	      <Modal.Footer>
					<Div hidden={state.status === 'closed'}>
						<Div hidden={state.status !== 'draft' && !IS_CREATING} className="inline-block">
			    		<Dropdown id="waybill-print-dropdown" disabled={!this.props.canSave} onSelect={this.props.handlePrint}>
			        	<Dropdown.Toggle  disabled={!this.props.canSave}>
			          	<Glyphicon glyph="print" /> Выдать
			          </Dropdown.Toggle>
			          <Dropdown.Menu>
				          <MenuItem eventKey={1}>Форма 3-С</MenuItem>
				          <MenuItem eventKey={2}>Форма 4-П</MenuItem>
			          </Dropdown.Menu>
			        </Dropdown>&nbsp;
						</Div>
		      	<Button onClick={this.handleSubmit.bind(this)} disabled={!this.props.canSave}>{this.props.formStage === 'closing' ? 'Закрыть ПЛ' : 'Сохранить'}</Button>
					</Div>
	      </Modal.Footer>

			</Modal>
		)
	}
}

WaybillForm.contextTypes = {
	flux: React.PropTypes.object,
};

export default connectToStores(WaybillForm, ['objects', 'employees', 'waybills']);
