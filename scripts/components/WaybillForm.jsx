import React, {Component} from 'react';
import connectToStores from 'flummox/connect';
import { Modal, Input, Label, Row, Col, FormControls, Button, DropdownButton, Dropdown, MenuItem, Glyphicon } from 'react-bootstrap';
import EtsSelect from './ui/EtsSelect.jsx';
import Datepicker from './ui/DatePicker.jsx';
import Span from './ui/Span.jsx';
import Div from './ui/Div.jsx';
import moment from 'moment';
import ROUTES, { getRouteById } from '../../mocks/routes.js';
//import WORK_TYPES, {getWorkTypeById} from '../../mocks/work_types.js';
import getFuelTypes, { getFuelTypeById } from '../stores/FuelTypes.js';
import { monthes } from '../utils/dates.js';
import Taxi from './waybill/Taxi.jsx';
import { getFuelOperations, getFuelRatesByCarModel } from '../adapter.js';
import cx from 'classnames';

//const FUEL_TYPES = getFuelTypes();

let getInitialDate = (date) => {
	date = new Date(date);
	return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 9, 0);
};

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

let DriversSelect = (props) => {
	const options = props.drivers.map( d => ({value: d.id, label: `[${d.personnel_number}] ${d.last_name} ${d.first_name} ${d.middle_name}`}));
	return <EtsSelect options={options}
										clearable={true}
										searchable={true}
										{...props}/>
};

class WaybillForm extends Component {

	constructor(props) {
		super(props);

		this.state = {
			operations: [],
			fuelRates: [],
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
			console.log(car);
			const fuel_correction_rate = car.fuel_correction_rate || null;
			getFuelRatesByCarModel(car_model_id).then(r => {
				const fuelRates = r.result.map( ({operation_id, rate_on_date}) => ({operation_id, rate_on_date: fuel_correction_rate ? parseFloat(rate_on_date * fuel_correction_rate).toFixed(2) : rate_on_date}) );
				getFuelOperations().then( fuelOperations => {
					const operations =  _.filter(fuelOperations.result, op => _.find(fuelRates, fr => fr.operation_id === op.ID));
					this.setState({fuelRates, operations});
				});
			});
		} else if (this.props.formStage === 'display') {
			getFuelOperations().then( fuelOperations => {
				this.setState({operations: fuelOperations.result});
			});
		}
		this.context.flux.getActions('employees').getEmployees();
	}

	onMasterChange(v) {
		this.handleChange('responsible_person_id', v);
		//this.handleChange('company_id', _.find(this.props.employeesList, e => e.id === v).company_id);
	}

	onDriverChange(v) {
		this.handleChange('driver_id', v);
		const prefer_car = _.find(this.props.driversList, d => d.id === v).prefer_car || null;
		if (!this.props.formState.car_id && prefer_car) {
			this.handleChange('car_id', prefer_car);
		}
		if (prefer_car) {
			const waybillsListSorted = _(this.props.waybillsList).filter(w => w.status === 'closed').sortBy('id').value().reverse();
			const lastCarUsedWaybill = _.find(waybillsListSorted, w => w.car_id === prefer_car);
			if (lastCarUsedWaybill) {
				if (typeof lastCarUsedWaybill.fuel_end !== 'undefined') {
					this.handleChange('fuel_start', lastCarUsedWaybill.fuel_end);
				}

				if (typeof lastCarUsedWaybill.odometr_end !== 'undefined') {
					this.handleChange('odometr_start', lastCarUsedWaybill.odometr_end);
				}

				if (typeof lastCarUsedWaybill.motohours_end !== 'undefined') {
					this.handleChange('motohours_start', lastCarUsedWaybill.motohours_end);
				}
			}
		}
	}

	onCarChange(v) {
		this.handleChange('car_id', v);
		// const car = _.find(this.props.carsList, c => c.asuods_id === v) || {};
		// const car_model_id = car.model_id;
		// getFuelRatesByCarModel(car_model_id).then(r => console.log(r));
		const waybillsListSorted = _(this.props.waybillsList).filter(w => w.status === 'closed').sortBy('id').value().reverse();
		const lastCarUsedWaybill = _.find(waybillsListSorted, w => w.car_id === v);
		console.log(lastCarUsedWaybill);
		if (lastCarUsedWaybill) {
			if (typeof lastCarUsedWaybill.fuel_end !== 'undefined' && lastCarUsedWaybill.fuel_end !== null) {
				this.handleChange('fuel_start', lastCarUsedWaybill.fuel_end);
			}

			if (typeof lastCarUsedWaybill.odometr_end !== 'undefined' && lastCarUsedWaybill.odometr_end !== null) {
				this.handleChange('odometr_start', lastCarUsedWaybill.odometr_end);
			}

			if (typeof lastCarUsedWaybill.motohours_end !== 'undefined' && lastCarUsedWaybill.motohours_end !== null) {
				this.handleChange('motohours_start', lastCarUsedWaybill.motohours_end);
			}
		} else {
			this.handleChange('fuel_start', 0);
			this.handleChange('odometr_start', 0);
			this.handleChange('motohours_start', 0);
		}
	}

	render() {

		let state = this.props.formState;
    let stage = this.props.formStage;
		let errors = this.props.formErrors;

		const { carsList = [], driversList = [], employeesList = [], fuelTypes = [] } = this.props;
		const CARS = carsList.map( c => ({value: c.asuods_id, label: c.gov_number + ' [' + c.model + ']'}));
		const FUEL_TYPES = fuelTypes.map(({ID, NAME}) => ({value: ID, label: NAME}));

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
							<label>Ответственное лицо</label><br/>
							<Div hidden={!(IS_CREATING || IS_POST_CREATING)}>
								<MastersSelect  value={state.responsible_person_id} employees={employeesList} onChange={this.onMasterChange.bind(this)}/>
							</Div>
							<Div hidden={IS_CREATING || IS_POST_CREATING}>
								{getFIOById(employeesList, state.responsible_person_id, true)}
							</Div>
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
					 			<Datepicker date={ getDateWithoutTZ(state.plan_departure_date) } disabled={true}/>
					   		<label>Выезд факт</label>
					 			<Datepicker date={ getDateWithoutTZ(state.fact_departure_date) } onChange={this.handleChange.bind(this, 'fact_departure_date')}/>
					   	</Col>
					  	<Col md={3}>
								<label>Возвращение план</label>
					 			<Datepicker date={ getDateWithoutTZ(state.plan_arrival_date) } disabled={true}/>
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
		          <Div hidden={!(IS_CREATING || IS_POST_CREATING)}>
		      			<label>Водитель (возможен поиск по табельному номеру)</label><br/>
		      			<DriversSelect className={errors['driver_id'] ? 'has-error' : ''} value={state.driver_id} drivers={driversList} onChange={this.onDriverChange.bind(this)}/>
		      		</Div>
		      		<Div hidden={IS_CREATING || IS_POST_CREATING}>
	      				<label>Водитель</label><br/>
	      				{getFIOById(driversList, state.driver_id, true)}
	            </Div>
	          </Col>
	      		<Col md={6}>
	            <Div hidden={!(IS_CREATING || IS_POST_CREATING)}>
	        			<label>Транспортное средство (поиск по госномеру)</label>
	        			<EtsSelect className={errors['car_id'] && 'has-error'} options={CARS} disabled={IS_POST_CREATING} value={state.car_id} onChange={this.onCarChange.bind(this)}/>
	            </Div>
	            <Div hidden={IS_CREATING || IS_POST_CREATING}>
	              <label style={{paddingTop:5}}>Транспортное средство</label><br/>
	              {getCarById(carsList, state.car_id).label}
	            </Div>
	      		</Col>
	      	</Row>

	      	<Row>
	      		<Col md={4}>
		      		<h4>Одометр</h4>
		      		<label>Выезд, км</label>
		      		<Input type="number" disabled={IS_CLOSING || IS_DISPLAY}  onChange={this.handleChange.bind(this, 'odometr_start')} value={state.odometr_start}/>
	            <Div hidden={!(IS_CLOSING || IS_DISPLAY )}>
	          		<label>Возврат, км</label>
	          		<Input type="number" className={errors['odometr_end'] && 'has-error'} disabled={IS_DISPLAY} value={state.odometr_end} onChange={this.handleChange.bind(this, 'odometr_end')}/>
	          		<label>Пробег, км</label>
	          		<Input type="number" value={state.odometr_diff} disabled/>
	            </Div>
	      		</Col>
	      		<Col md={4}>
		      		<h4>Счетчик моточасов</h4>
		      		<label>Выезд, м/ч</label>
		      		<Input type="number" disabled={IS_CLOSING || IS_DISPLAY} onChange={this.handleChange.bind(this, 'motohours_start')} value={state.motohours_start}/>
		          <Div hidden={!(IS_CLOSING || IS_DISPLAY )}>
			      		<label>Возврат, м/ч</label>
			      		<Input type="number" className={errors['motohours_end'] && 'has-error'} disabled={IS_DISPLAY} value={state.motohours_end} onChange={this.handleChange.bind(this, 'motohours_end')}/>
			      		<label>Пробег, м/ч</label>
			      		<Input type="number" value={state.motohours_diff} disabled/>
		          </Div>
	      		</Col>
	      		<Col md={4}>
		      		<h4>Счетчик моточасов обор-ния</h4>
		      		<label>Выезд, м/ч</label>
		      		<Input type="number" value={state.motohours_equip_start} onChange={this.handleChange.bind(this, 'motohours_equip_start')} disabled={IS_CLOSING || IS_DISPLAY}/>
		          <Div hidden={!(IS_CLOSING || IS_DISPLAY )}>
			      		<label>Возврат, м/ч</label>
			      		<Input type="number" className={errors['motohours_equip_end'] && 'has-error'} value={state.motohours_equip_end}  onChange={this.handleChange.bind(this, 'motohours_equip_end')} disabled={IS_DISPLAY}/>
			      		<label>Пробег, м/ч</label>
			      		<Input type="number" value={state.motohours_equip_diff} disabled/>
		          </Div>
	      		</Col>
	      	</Row>

	      	<Row>
	      		<Col md={4}>
		      		<h4> Топливо </h4>
		      		<label>Тип топлива</label>
		          <EtsSelect className={errors['fuel_type_id'] ? 'has-error' : ''} disabled={IS_CLOSING || IS_DISPLAY} options={FUEL_TYPES} value={state.fuel_type_id} onChange={this.handleChange.bind(this, 'fuel_type_id')}/>
		      		<label>Выезд, л</label>
		      		<Input type="number" className="hui" className={errors['fuel_start'] && 'has-error'} value={state.fuel_start} disabled={IS_CLOSING || IS_DISPLAY} onChange={this.handleChange.bind(this, 'fuel_start')}/>
							<Div hidden={true} className="error">{errors['fuel_start']}</Div>
		      		<label>Выдать, л</label>
		      		<Input type="number" className={errors['fuel_to_give'] && 'has-error'}  value={state.fuel_to_give}  disabled={IS_CLOSING || IS_DISPLAY} onChange={this.handleChange.bind(this, 'fuel_to_give')}/>
		          <Div hidden={!(IS_CLOSING || IS_DISPLAY )}>
			          <label>Выдано, л</label>
			          <Input type="number" value={state.fuel_given} onChange={this.handleChange.bind(this, 'fuel_given')} disabled={IS_CREATING || IS_DISPLAY}/>
			      		<label>Возврат, л</label>
			      		<Input type="number" className={errors['fuel_end'] && 'has-error'} value={state.fuel_end}  onChange={this.handleChange.bind(this, 'fuel_end')} disabled={IS_CREATING || IS_DISPLAY}/>
		          </Div>
	      		</Col>
	      		<Col md={8}>
							<Taxi hidden={!(IS_DISPLAY || IS_CLOSING) || state.status === 'draft'}
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
