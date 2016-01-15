import React, {Component} from 'react';
import { Modal, Input, Label, Row, Col, FormControls, Button, DropdownButton, Dropdown, MenuItem, Glyphicon } from 'react-bootstrap';
import EtsSelect from './ui/EtsSelect.jsx';
import Datepicker from './ui/DatePicker.jsx';
import Span from './ui/Span.jsx';
import moment from 'moment';
import { getDrivers, getFIOById, getDriverByCode } from './../stores/EmployeesStore.js';
import ROUTES, {getRouteById} from '../../mocks/routes.js';
import WORK_TYPES, {getWorkTypeById} from '../../mocks/work_types.js';
//import CARS, { getCarById } from '../../mocks/krylatskoe_cars.js';
//import { getCarById } from '../stores/ObjectsStore.js';
import getFuelTypes, {getFuelTypeById } from '../stores/FuelTypes.js';
import { monthes } from '../utils/dates.js';
import Taxi from './waybill/Taxi.jsx';
import { getFuelOperations } from '../adapter.js';
import connectToStores from 'flummox/connect';

const FUEL_TYPES = getFuelTypes();
const DRIVERS = getDrivers();

let getCarById = (cars, id) => {
	return _.find(cars, c => c.asuods_id === id) || {};
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

// let CarSelect = (props) => {
//
// 	return <Select
// 		options={DRIVERS}
// 		clearable={true}
// 		//optionRenderer={renderOption}
// 		//valueRenderer={renderValue}
// 		searchable={true}
// 		onChange={(v,a)=>console.log('car selected', v,a)}/>
// }

class WaybillForm extends Component {

	constructor(props) {
		super(props);

		this.state = {
			operations: []
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
		getFuelOperations().then(r => this.setState({operations: r.result}));
		this.context.flux.getActions('employees').getEmployees();
	}

	onMasterChange(v) {
		this.handleChange('responsible_person_id', v);
		this.handleChange('COMPANY_ID', _.find(this.props.employeesList, e => e.id === v).company_id);
	}

	onDriverChange() {

	}

	render() {

		let state = this.props.formState;
    let stage = this.props.formStage;

		console.log('WAYBILL PROPS', this.props);
		const { carsList = [], driversList = [], employeesList = [] } = this.props;
		const CARS = carsList.map( c => ({value: c.asuods_id, label: c.gov_number + ' [' + c.model + ']'}));

    console.log('form stage is ', stage, 'form state is ', state);


		let IS_CREATING = stage === 'creating';
		let IS_CLOSING = stage === 'closing';
    let IS_POST_CREATING = stage === 'post-creating'
		let IS_DISPLAY = stage === 'display';

    let title = '';

    if ( IS_CREATING ) {
      title = "Создать новый путевой лист"
    }

    if (IS_CLOSING) {
      title = "Закрыть путевой лист"
    }

    if (IS_DISPLAY) {
      title= "Просмотр путевого листа "
    }

    if (IS_POST_CREATING) {
      title = "Создание нового путевого листа"
    }

		return (
			<Modal {...this.props} bsSize="large"
			autoFocus={true}
			enforceFocus={true}>
				<Modal.Header closeButton>
	          <Modal.Title id="contained-modal-title-lg">{title} № {state.number} { IS_POST_CREATING && '(возможна корректировка)'}</Modal.Title>
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
	      		{ (IS_CREATING || IS_POST_CREATING) ?
	      		<MastersSelect  value={state.responsible_person_id} employees={employeesList} onChange={this.onMasterChange.bind(this)}/>
	      		:
	      		getFIOById(state.responsible_person_id, true)
	      		}
	      	</Col>
	       	{ (IS_CREATING || IS_POST_CREATING) &&
	       		<Col md={3}>
		       		<label>Выезд план</label>
			   			<Datepicker date={ state.plan_departure_date } onChange={this.handleChange.bind(this, 'plan_departure_date')}/>
		       	</Col> }
		       { (IS_CREATING || IS_POST_CREATING) &&
		       	<Col md={3}>
			   			<label>Возвращение план</label>
			   			<Datepicker date={ state.plan_arrival_date } onChange={this.handleChange.bind(this, 'plan_arrival_date')}/>
		       	</Col>
		       }
		       { IS_CLOSING &&
			       	<Col md={3}>
			       		<label>Выезд факт</label>
				   			<Datepicker date={ state.fact_departure_date } onChange={this.handleChange.bind(this, 'fact_departure_date')}/>
			       	</Col>}
			      { IS_CLOSING &&
			      	<Col md={3}>
				   			<label>Возвращение факт</label>
				   			<Datepicker date={ state.fact_arrival_date } onChange={this.handleChange.bind(this, 'fact_arrival_date')}/>
			       	</Col>
			       }

	           {IS_DISPLAY &&
	            <span>
	              <Col md={3}>
	                <label>Выезд план</label><br/>{state.plan_departure_date}<br/>
	                <label>Выезд факт</label><br/>{state.fact_departure_date}
	              </Col>
	              <Col md={3}>
	                <label>Возвращение план</label><br/>{state.plan_arrival_date}<br/>
	                <label>Возвращение факт</label><br/>{state.fact_arrival_date}
	              </Col>

	            </span>}
	       </Row>

	      	<Row>
	      		<Col md={6}>

	        { (IS_CREATING || IS_POST_CREATING) ?
	          <span>
	      			<label>Водитель (возможен поиск по табельному номеру)</label><br/>
	      			<DriversSelect value={state.driver_id} drivers={driversList} onChange={this.handleChange.bind(this, 'driver_id')}/>
	      		</span>
	      		: <span>
	      				<label>Водитель</label><br/>
	      				{getFIOById(state.driver_id, true)}
	            </span>
	      		}
	          </Col>
	      		<Col md={6}>
	          { (IS_CREATING || IS_POST_CREATING) ?
	            <span>
	        			<label>Транспортное средство (поиск по госномеру)</label>
	        			<EtsSelect options={CARS} disabled={IS_POST_CREATING} value={state.car_id} onChange={this.handleChange.bind(this, 'car_id')}/>
	            </span>
	            :
	            <span>
	              <label style={{paddingTop:5}}>Транспортное средство</label><br/>
	              {getCarById(carsList, state.car_id).label}
	            </span>
	            }
	      		</Col>
	      	</Row>
	      	{/*<Select.Async multi={false} value={this.props.master}*/}

	        {/*<h4>Задание</h4>
	      	<Row>
	      	<Col md={5}>
	        {!IS_DISPLAY  ?
	            <span></span>

	            :

	            <span></span>

	        }
	        {!IS_DISPLAY  ?
	            <span><label>Маршрут</label>
	              <EtsSelect options={ROUTES} value={state.ROUTE_ID} onChange={this.handleChange.bind(this, 'ROUTE_ID')}/>
	            </span>
	            :
	            <span>
	            <label>Маршрут</label><br/>
	              {getRouteById(state.ROUTE_ID).name}
	            </span>

	        }
	      			</Col>
	    		<Col md={4}>
	    			<label>Вид работ</label>
	           {!IS_DISPLAY  ?
	            <span><EtsSelect options={WORK_TYPES} value={state.WORK_TYPE_ID} onChange={this.handleChange.bind(this, 'WORK_TYPE_ID')}/>
	      </span>

	            :

	            <span><br/>{getWorkTypeById(state.WORK_TYPE_ID).label}</span>

	        }
	    				</Col>
	    		<Col md={3}>
	    		  <label>Количество прохождений</label>
	    		  <Input type="number" disabled={IS_CLOSING || IS_DISPLAY} value={state.PASSES_COUNT} onChange={this.handleChange.bind(this, 'PASSES_COUNT')}/>
	    		</Col>
	      	</Row> */}

	      	<Row>
	      		<Col md={4}>
	      		<h4>Одометр</h4>
	      		<label>Начало, км</label>
	      		<Input type="number" disabled={IS_CLOSING || IS_DISPLAY}  onChange={this.handleChange.bind(this, 'ODOMETR_START')} value={state.ODOMETR_START}/>
	          { (IS_CLOSING || IS_DISPLAY )&&
	            <div>
	          		<label>Конец, км</label>
	          		<Input type="number" disabled={IS_DISPLAY} value={state.odometr_end} onChange={this.handleChange.bind(this, 'odometr_end')}/>
	          		<label>Пробег, км</label>
	          		<Input type="number" value={state.ODOMETR_DIFF} disabled/>
	            </div>
	          }
	      		</Col>
	      		<Col md={4}>
	      		<h4>Счетчик моточасов</h4>
	      		<label>Начало, м/ч</label>
	      		<Input type="number"  disabled={IS_CLOSING || IS_DISPLAY} onChange={this.handleChange.bind(this, 'MOTOHOURS_START')} value={state.MOTOHOURS_START}/>
	          { (IS_CLOSING || IS_DISPLAY )&&
	            <div>
	      		<label>Конец, м/ч</label>
	      		<Input type="number" disabled={IS_DISPLAY} value={state.motohours_end} onChange={this.handleChange.bind(this, 'motohours_end')}/>
	      		<label>Пробег, м/ч</label>
	      		<Input type="number" value={state.MOTOHOURS_DIFF} disabled/>
	          </div>}
	      		</Col>
	      		<Col md={4}>
	      		<h4>Счетчик моточасов обор-ния</h4>
	      		<label>Начало, м/ч</label>
	      		<Input type="number" value={state.MOTOHOURS_EQUIP_START}  onChange={this.handleChange.bind(this, 'MOTOHOURS_EQUIP_START')} disabled={IS_CLOSING || IS_DISPLAY}/>
	          { (IS_CLOSING || IS_DISPLAY )&&
	            <div>
	      		<label>Конец, м/ч</label>
	      		<Input type="number" value={state.MOTOHOURS_EQUIP_END}  onChange={this.handleChange.bind(this, 'MOTOHOURS_EQUIP_END')} disabled={IS_DISPLAY}/>
	      		<label>Пробег, м/ч</label>
	      		<Input type="number" value={state.MOTOHOURS_EQUIP_DIFF} disabled/>
	          </div>}
	      		</Col>
	      	</Row>
	      	<Row>
	      		<Col md={4}>
		      		<h4> Топливо </h4>
		      		<label>Тип топлива</label>
		            <EtsSelect disabled={IS_CLOSING || IS_DISPLAY} options={FUEL_TYPES} value={state.FUEL_TYPE_ID} onChange={this.handleChange.bind(this, 'FUEL_TYPE_ID')}/>

		      		<label>Начало, л</label>
		      		<Input type="number" value={state.FUEL_START} disabled={IS_CLOSING || IS_DISPLAY} onChange={this.handleChange.bind(this, 'FUEL_START')}/>
		      		<label>Выдать, л</label>
		      		<Input type="number" value={state.FUEL_TO_GIVE}  disabled={IS_CLOSING || IS_DISPLAY} onChange={this.handleChange.bind(this, 'FUEL_TO_GIVE')}/>
		          { (IS_CLOSING || IS_DISPLAY )&&
		            <div>
		          <label>Выдано, л</label>
		          <Input type="number" value={state.fuel_given}  onChange={this.handleChange.bind(this, 'fuel_given')} disabled={IS_CREATING || IS_DISPLAY}/>
		      		<label>Конец, л</label>
		      		<Input type="number" value={state.fuel_end}  onChange={this.handleChange.bind(this, 'fuel_end')} disabled={IS_CREATING || IS_DISPLAY}/>
		          </div>}
	      		</Col>
	      		<Col md={8}>
							<Taxi hidden={! (IS_DISPLAY || IS_CLOSING)} readOnly={!IS_CLOSING} car={getCarById(carsList, state.car_id)} operations={this.state.operations}/>
	      		</Col>
	      	</Row>
	      </Modal.Body>
	      <Modal.Footer>
	    		<Dropdown id="waybill-print-dropdown" disabled={!this.props.canPrint} onSelect={this.props.handlePrint}>
	        	<Dropdown.Toggle  disabled={!this.props.canPrint}>
	          	<Glyphicon glyph="print" /> Распечатать
	          </Dropdown.Toggle>
	          <Dropdown.Menu>
		          <MenuItem eventKey={1}>Форма 3-С</MenuItem>
		          <MenuItem eventKey={2}>Форма 4-П</MenuItem>
	          </Dropdown.Menu>
	        </Dropdown>&nbsp;
	      	<Button onClick={this.handleSubmit.bind(this)} disabled={!this.props.canSave}>{this.props.formStage === 'closing' ? 'Закрыть ПЛ' : 'Сохранить'}</Button>
	      </Modal.Footer>
			</Modal>
		)
	}
}

WaybillForm.contextTypes = {
	flux: React.PropTypes.object,
};

export default connectToStores(WaybillForm, ['objects', 'employees']);
