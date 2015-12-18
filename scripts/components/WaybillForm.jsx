import React, {Component} from 'react';
import { Modal, Input, Label, Row, Col, FormControls, Button, DropdownButton, MenuItem } from 'react-bootstrap';
import EtsSelect from './ui/EtsSelect.jsx';
import Datepicker from './ui/DatePicker.jsx';
import moment from 'moment';
import { getMasters, getDrivers, getFIOById, getDriverByCode } from './../stores/EmployeesStore.js';
import ROUTES from '../../mocks/routes.js';
import WORK_TYPES from '../../mocks/work_types.js';
import CARS, { getCarById } from '../../mocks/krylatskoe_cars.js';
import getFuelTypes, {getFuelTypeById } from '../stores/FuelTypes.js';
import { monthes } from '../utils/dates.js';

const FUEL_TYPES = getFuelTypes();
const MASTERS = getMasters();
const DRIVERS = getDrivers();


let MastersSelect = (props) => {

	//let renderOption = (option) => <span>{option['Имя']}</span>

	return 	<EtsSelect 
			options={MASTERS} 
			clearable={true} 
			searchable={true} 
			{...props}
			//optionRenderer={renderOption}
			/>

};

let DriversSelect = (props) => {
	return <EtsSelect
		options={DRIVERS}
		clearable={true}
		searchable={true}
			{...props}/>
}

let DriversSelectByCode = (props) => {

	let renderOption = (v) => <span>{v['Табельный номер']}</span>
	let renderValue = (v) => v['Табельный номер'];

	return <Select
		options={DRIVERS}
		clearable={true}
		optionRenderer={renderOption}
		valueRenderer={renderValue}
		searchable={true}
		onChange={(v,a)=>console.log('driver selected', v,a)}/>
}

let CarSelect = () => {

	return <Select
		options={DRIVERS}
		clearable={true}
		//optionRenderer={renderOption}
		//valueRenderer={renderValue}
		searchable={true}
		onChange={(v,a)=>console.log('car selected', v,a)}/>
}

export default class WaybillForm extends Component {

	handleChange(field, e) {
		this.props.handleFormChange(field, e);
	}

  handleSubmit() {

    console.log('submitting waybill form', this.props.formState);
    this.props.onSubmit(this.props.formState)
  }


  renderDisplay() {

  }

  renderCreating() {

  }

  renderClosing() {

  }

	render () {

		let state = this.props.formState;
    let stage = this.props.formStage;

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

    if (IS_POST_CREATING){
      title = "Создание нового путевого листа"
    }
		return <Modal {...this.props} bsSize="large">
			<Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{title} № {state.NUMBER} { IS_POST_CREATING && '(возможна корректировка)'}</Modal.Title>
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
      		<MastersSelect disabled={!!state.STATUS} value={state.RESPONSIBLE_PERSON_ID} onChange={this.handleChange.bind(this, 'RESPONSIBLE_PERSON_ID')}/>
      		:
      		getFIOById(state.RESPONSIBLE_PERSON_ID, true)
      		}
      	</Col>
       	{ (IS_CREATING || IS_POST_CREATING) && 
       		<Col md={3}>
	       		<label>Выезд план</label>
		   			<Datepicker date={ state.PLAN_DEPARTURE_DATE } onChange={this.handleChange.bind(this, 'PLAN_DEPARTURE_DATE')}/>
	       	</Col> }
	       { (IS_CREATING || IS_POST_CREATING) && 
	       	<Col md={3}>
		   			<label>Возвращение план</label>
		   			<Datepicker date={ state.PLAN_ARRIVAL_DATE } onChange={this.handleChange.bind(this, 'PLAN_ARRIVAL_DATE')}/>
	       	</Col>
	       }
	       { IS_CLOSING &&
		       	<Col md={3}>
		       		<label>Выезд факт</label>
			   			<Datepicker date={ state.FACT_DEPARTURE_DATE } onChange={this.handleChange.bind(this, 'FACT_DEPARTURE_DATE')}/>
		       	</Col>}
		      { IS_CLOSING &&
		      	<Col md={3}>
			   			<label>Возвращение факт</label>
			   			<Datepicker date={ state.FACT_ARRIVAL_DATE } onChange={this.handleChange.bind(this, 'FACT_ARRIVAL_DATE')}/>
		       	</Col>
		       }
       </Row>

      	<Row>	
      		<Col md={6}>

        { (IS_CREATING || IS_POST_CREATING) ? 
          <span>
      			<label>Водитель (возможен поиск по табельному номеру)</label><br/>
      				<DriversSelect value={state.DRIVER_ID} onChange={this.handleChange.bind(this, 'DRIVER_ID')}/>
      		</span>
      		: <span>
      				<label>Водитель</label><br/>
      				{getFIOById(state.DRIVER_ID, true)}
            </span>
      		}
          </Col>
      		<Col md={6}>
          { (IS_CREATING && !IS_POST_CREATING) ?
            <span>
        			<label>Транспортное средство (поиск по госномеру)</label>
        			<EtsSelect options={CARS} value={state.CAR_ID} onChange={this.handleChange.bind(this, 'CAR_ID')}/>
            </span>
            : 
            <span>
              <label>Транспортное средство</label><br/>
              {getCarById(state.CAR_ID).label}
            </span>
            }
      		</Col>
      	</Row>
      	{/*<Select.Async multi={false} value={this.props.master}*/}

        <h4>Задание</h4>
      	<Row>
      	<Col md={5}>
      		<label>Маршрут</label>
      		<EtsSelect options={ROUTES} value={state.ROUTE_ID} onChange={this.handleChange.bind(this, 'ROUTE_ID')}/>
    		</Col>	
    		<Col md={4}>
    			<label>Вид работ</label>
    			<EtsSelect options={WORK_TYPES} value={state.WORK_TYPE_ID} onChange={this.handleChange.bind(this, 'WORK_TYPE_ID')}/>
    		</Col>
    		<Col md={3}>
    		  <label>Количество прохождений</label>
    		  <Input type="number" disabled={IS_CLOSING} value={state.PASSES_COUNT} onChange={this.handleChange.bind(this, 'PASSES_COUNT')}/>
    		</Col>
      	</Row>

      	<Row>
      		<Col md={4}>
      		<h4>Одометр</h4>
      		<label>Начало, км</label>
      		<Input type="number" disabled={IS_CLOSING}  onChange={this.handleChange.bind(this, 'ODOMETR_START')} value={state.ODOMETR_START}/>
          { IS_CLOSING &&
            <div>
          		<label>Конец, км</label>
          		<Input type="number" value={state.ODOMETR_END} onChange={this.handleChange.bind(this, 'ODOMETR_END')} disabled={IS_CREATING}/>
          		<label>Пробег, км</label>
          		<Input type="number" value={state.ODOMETR_DIFF} disabled/>
            </div>
          }
      		</Col>
      		<Col md={4}>
      		<h4>Счетчик моточасов</h4>
      		<label>Начало, м/ч</label>
      		<Input type="number"  disabled={IS_CLOSING} onChange={this.handleChange.bind(this, 'MOTOHOURS_START')} value={state.MOTOHOURS_START}/>
          { IS_CLOSING &&
            <div>
      		<label>Конец, м/ч</label>
      		<Input type="number" value={state.MOTOHOURS_END} onChange={this.handleChange.bind(this, 'MOTOHOURS_END')} disabled={IS_CREATING}/>
      		<label>Пробег, м/ч</label>
      		<Input type="number" value={state.MOTOHOURS_DIFF} disabled/>
          </div>}
      		</Col>
      		<Col md={4}>
      		<h4>Счетчик моточасов обор-ния</h4>
      		<label>Начало, м/ч</label>
      		<Input type="number" value={state.MOTOHOURS_EQUIP_START}  onChange={this.handleChange.bind(this, 'MOTOHOURS_EQUIP_START')} disabled={IS_CLOSING}/>
          { IS_CLOSING &&
            <div>
      		<label>Конец, м/ч</label>
      		<Input type="number" value={state.MOTOHOURS_EQUIP_END}  onChange={this.handleChange.bind(this, 'MOTOHOURS_EQUIP_END')} disabled={IS_CREATING}/>
      		<label>Пробег, м/ч</label>
      		<Input type="number" value={state.MOTOHOURS_EQUIP_DIFF} disabled/>
          </div>}
      		</Col>
      	</Row>
      	<Row>
      		<Col md={4}>
      		<h4> Топливо </h4>
      		<label>Тип топлива</label>
          { IS_CLOSING ? <span><br/>
            {getFuelTypeById(state.FUEL_TYPE_ID).label}<br/>
            </span>
            :
            <EtsSelect disabled={IS_CLOSING} options={FUEL_TYPES} value={state.FUEL_TYPE_ID} onChange={this.handleChange.bind(this, 'FUEL_TYPE_ID')}/>
          }
      		<label>Начало, л</label>
      		<Input type="number" value={state.FUEL_START} disabled={IS_CLOSING} onChange={this.handleChange.bind(this, 'FUEL_START')}/>
      		<label>Выдать, л</label>
      		<Input type="number" value={state.FUEL_TO_GIVE}  disabled={IS_CLOSING} onChange={this.handleChange.bind(this, 'FUEL_TO_GIVE')}/>
          { IS_CLOSING &&
            <div>
          <label>Выдано, л</label>
          <Input type="number" value={state.FUEL_GIVEN}  onChange={this.handleChange.bind(this, 'FUEL_GIVEN')} disabled={IS_CREATING}/>
      		<label>Конец, л</label>
      		<Input type="number" value={state.FUEL_END}  onChange={this.handleChange.bind(this, 'FUEL_END')} disabled={IS_CREATING}/>
          </div>}
      		</Col>
      		<Col md={4}>
      		</Col>
      		<Col md={4}>
      		</Col>
      	</Row>
      </Modal.Body>	
      <Modal.Footer>
    		<DropdownButton disabled={!this.props.canPrint} title="Распечатать" onSelect={this.props.handlePrint}>
          <MenuItem eventKey={1}>Форма 3-С</MenuItem>
          <MenuItem eventKey={2}>Форма 4-П</MenuItem>
        </DropdownButton>&nbsp;
      	<Button onClick={this.handleSubmit.bind(this)} disabled={!this.props.canSave}>{this.props.formStage === 'closing' ? 'Закрыть ПЛ' : 'Сохранить'}</Button>
      </Modal.Footer>
		</Modal>
	}
}