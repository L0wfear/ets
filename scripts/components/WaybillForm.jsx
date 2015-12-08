import React, {Component} from 'react';
import { Modal, Input, Label, Row, Col, FormControls, Button } from 'react-bootstrap';
import Select from 'react-select';
import Datepicker from './ui/DatePicker.jsx';
import moment from 'moment';
import { getMasters, getDrivers, getFIOById, getDriverByCode } from './../stores/EmployeesStore.js';
import ROUTES from '../../mocks/routes.js';
import WORK_TYPES from '../../mocks/work_types.js';
import CARS from '../krylatskoe_cars.js';

const MASTERS = getMasters();
const DRIVERS = getDrivers();
const FUEL_TYPES = [
{
	id:1,
	label: 'Бензин',
	value: 1
},
{
	id:2,
	label: 'Д/т',
	value: 2
}]

let getFuelById = (id) => {
	let result;
	_.each(FUEL_TYPES, type => {
		if (type.id === id ){
			result = type
		}
	})

	return result;
}

let getCarById = (id) => {
	let result;
	_.each(CARS, car => {
		if (car.id === id ){
			result = car
		}
	})

	return result;
}

let getRouteById = (id) => {
	let result;
	_.each(ROUTES, route => {
		if (route.id === id ) {
			result = route
		}
	})

	return result;
}


let EtsSelect = (props) => <Select {...props} placeholder="Выберите..."/>;

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
		this.props.handleFormStateChange( field, e);
	}

  handleSubmit(){

    console.log('submitting waybill form', this.props.formState);
    this.props.onSubmit(this.props.formState)
  }

  handlePrint(){
  	console.log('printing bill', this.props.formState);
  	let f = this.props.formState;
  	let creation_date = moment(f.creation_date);
  	const monthes = [
  		'января',
  		'февраля',
  		'марта',
  		'апреля',
  		'мая',
  		'июня',
  		'июля',
  		'августа',
  		'сентября',
  		'октября',
  		'ноября',
  		'декабря'
  	]
  	let zhzhzh = 'ГБУ г.Москвы "Жилищник района Крылатское"';
  	let driver = getDriverByCode(f.driver_id);
  	let car = getCarById(f.car_id);
  	let route = getRouteById(f.route_id)
  	//console.log( creation_date, creation_date.year(), creation_date.month(), );
  	let linkTo = 'http://ods.mos.ru/ssd/city-dashboard/plate_truck/'+
  		'?registration_number='+f.number+
  		'&waybill_open_day='+creation_date.date() + 
  		'&waybill_open_month='+monthes[creation_date.month()]+
  		'&waybill_open_year='+creation_date.year()+
  		'&organization_data='+zhzhzh+
  		'&automobile_mark='+car.model+
  		'&automobile_number='+car.gov_number+
  		'&driver_fio_full='+getFIOById(driver.id, true)+
  		'&license_number='+(driver["Водительское удостоверение"] == '' ? driver["Специальное удостоверение"] : driver["Водительское удостоверение"])+
  		'&odometer_start=' + f.odometr_nachalo + 
  		'&depart_day=' + f.vyezd_plan.getDate()+
  		'&depart_month='+ (f.vyezd_plan.getMonth()+1) +
  		'&depart_hour='+ f.vyezd_plan.getHours() +
  		'&depart_minute='+f.vyezd_plan.getMinutes() + 
  		'&return_day='+f.vozvr_plan.getDate()+
  		'&return_month='+(f.vozvr_plan.getMonth()+1)+
  		'&return_hour='+f.vozvr_plan.getHours()+
  		'&return_minute='+f.vozvr_plan.getMinutes()+
  		'&fuel_mark='+getFuelById(f.fuel_type).label+
  		'&fuel_start='+f.fuel_nachalo+
  		'&operation_equipment_start_time='+f.motoch_obor_nachalo+
  		'&operation_engine_start_time='+
  		'&trainee_fio='+
  		'&possession_organization_data='+zhzhzh+
  		'&fuel_issue='+f.fuel_vydat+
  		'&dispatcher_last_name='+
  		'&pass_driver_last_name='+driver['Фамилия']+
  		'&receive_driver_last_name='+driver['Фамилия']+
  		'&complete_task_route='+route.name+
  		'&complete_task_odometer_start='+f.odometr_nachalo+
  		'&complete_fuel_mark='+getFuelById(f.fuel_type).label+
  		'&complete_number_trips='+f.ezdok;

  		console.log( 'print url', linkTo, f)

  	window.location = linkTo;
  }

	render () {

		let fState = this.props.formState;
		let IS_NEW = fState.status === null;
		let IS_CLOSING = fState.status;
		let IS_CLOSED = !fState.status;
		let MAY_PRINT = false;

		console.log( 'formstate is', fState);


		if ( IS_NEW ) {
				if ( !!fState.master_id && !!fState.vyezd_plan && !!fState.vozvr_plan
						&& !!fState.driver_id && !!fState.car_id && !!fState.odometr_nachalo) {
					MAY_PRINT = true
				}
		}

		return <Modal {...this.props} bsSize="large">
			<Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">Путевой лист № {fState.number}</Modal.Title>
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
      		{ IS_NEW ? 
      		<MastersSelect disabled={!!fState.status} value={fState.master_id} onChange={this.handleChange.bind(this, 'master_id')}/>
      		:
      		getFIOById(fState.master_id, true)
      		}
      	</Col>
       	{ IS_NEW && 
       		<Col md={3}>
	       		<label>Выезд план</label>
		   			<Datepicker date={ fState.vyezd_plan } onChange={this.handleChange.bind(this, 'vyezd_plan')}/>
	       	</Col> }
	       { IS_NEW && 
	       	<Col md={3}>
		   			<label>Возвращение план</label>
		   			<Datepicker date={ fState.vozvr_plan } onChange={this.handleChange.bind(this, 'vozvr_plan')}/>
	       	</Col>
	       }
	       { IS_CLOSING &&
		       	<Col md={3}>
		       		<label>Выезд факт</label>
			   			<Datepicker date={ fState.vyezd_fakt } onChange={this.handleChange.bind(this, 'vyezd_fakt')}/>
		       	</Col>}
		      { IS_CLOSING &&
		      	<Col md={3}>
			   			<label>Возвращение факт</label>
			   			<Datepicker date={ fState.vozvr_fakt } onChange={this.handleChange.bind(this, 'vozvr_fakt')}/>
		       	</Col>
		       }
       </Row>

      	<Row>	
      	{ IS_NEW ? 
      		<Col md={6}>
      			<label>Водитель (возможен поиск по табельному номеру)</label><br/>
      				<DriversSelect value={fState.driver_id} onChange={this.handleChange.bind(this, 'driver_id')}/>
      		</Col>
      		: 
      		<Col md={6}>
    				<label>Водитель</label><br/>
    				{getFIOById(fState.driver_id, true)}
  				</Col> 
      		}
      		<Col md={6}>
      			<label>Транспортное средство (поиск по госномеру)</label>
      			<EtsSelect options={CARS} value={fState.car_id} onChange={this.handleChange.bind(this, 'car_id')}/>
      		</Col>
      	</Row>
      	{/*<Select.Async multi={false} value={this.props.master}*/}

        <h4>Задание</h4>
      	<Row>
      	<Col md={5}>
      		<label>Маршрут</label>
      		<EtsSelect options={ROUTES} value={fState.route_id} onChange={this.handleChange.bind(this, 'route_id')}/>
    		</Col>	
    		<Col md={4}>
    			<label>Вид работ</label>
    			<EtsSelect options={WORK_TYPES} value={fState.work_type} onChange={this.handleChange.bind(this, 'work_type')}/>
    		</Col>
    		<Col md={3}>
    		  <label>Количество прохождений</label>
    		  <Input type="number" disabled={IS_CLOSING} value={fState.ezdok} onChange={this.handleChange.bind(this, 'ezdok')}/>
    		</Col>
      	</Row>

      	<Row>
      		<Col md={4}>
      		<h4>Одометр</h4>
      		<label>Начало, км</label>
      		<Input type="number" disabled={IS_CLOSING}  onChange={this.handleChange.bind(this, 'odometr_nachalo')} value={fState.odometr_nachalo}/>
          { IS_CLOSING &&
            <div>
          		<label>Конец, км</label>
          		<Input type="number" value={fState.odometr_konec} onChange={this.handleChange.bind(this, 'odometr_konec')} disabled={IS_NEW}/>
          		<label>Пробег, км</label>
          		<Input type="number" value={fState.odometr_probeg} disabled/>
            </div>
          }
      		</Col>
      		<Col md={4}>
      		<h4>Счетчик моточасов</h4>
      		<label>Начало, м/ч</label>
      		<Input type="number"  disabled={IS_CLOSING} onChange={this.handleChange.bind(this, 'motoch_nachalo')} value={fState.motoch_nachalo}/>
          { IS_CLOSING &&
            <div>
      		<label>Конец, м/ч</label>
      		<Input type="number" value={fState.motoch_konec} onChange={this.handleChange.bind(this, 'motoch_konec')} disabled={IS_NEW}/>
      		<label>Пробег, м/ч</label>
      		<Input type="number" value={fState.motoch_probeg} disabled/>
          </div>}
      		</Col>
      		<Col md={4}>
      		<h4>Счетчик моточасов обор-ния</h4>
      		<label>Начало, м/ч</label>
      		<Input type="number" value={fState.motoch_obor_nachalo}  onChange={this.handleChange.bind(this, 'motoch_obor_nachalo')}disabled={IS_CLOSING}/>
          { IS_CLOSING &&
            <div>
      		<label>Конец, м/ч</label>
      		<Input type="number" value={fState.motoch_obor_konec}  onChange={this.handleChange.bind(this, 'motoch_obor_konec')} disabled={IS_NEW}/>
      		<label>Пробег, м/ч</label>
      		<Input type="number" value={fState.motoch_obor_probeg} disabled/>
          </div>}
      		</Col>
      	</Row>
      	<Row>
      		<Col md={4}>
      		<h4> Топливо </h4>
      		<label>Тип топлива</label>
      		<EtsSelect options={FUEL_TYPES} value={fState.fuel_type} onChange={this.handleChange.bind(this, 'fuel_type')}/>
      		<label>Начало, л</label>
      		<Input type="number" value={fState.fuel_nachalo} disabled={IS_CLOSING} onChange={this.handleChange.bind(this, 'fuel_nachalo')}/>
      		<label>Выдать, л</label>
      		<Input type="number" value={fState.fuel_vydat}  disabled={IS_CLOSING} onChange={this.handleChange.bind(this, 'fuel_vydat')}/>
          { IS_CLOSING &&
            <div>
          <label>Выдано, л</label>
          <Input type="number" value={fState.fuel_vydano}  onChange={this.handleChange.bind(this, 'fuel_vydano')} disabled={IS_NEW}/>
      		<label>Конец, л</label>
      		<Input type="number" value={fState.fuel_konec}  onChange={this.handleChange.bind(this, 'fuel_konec')} disabled={IS_NEW}/>
          </div>}
      		</Col>
      		<Col md={4}>
      		</Col>
      		<Col md={4}>
      		</Col>
      	</Row>
      </Modal.Body>	
      <Modal.Footer>
      	{
      		!fState.status && <Button disabled={!MAY_PRINT} onClick={this.handlePrint.bind(this)}>Распечатать</Button>
      	}
      	<Button onClick={this.handleSubmit.bind(this)}>{fState.status ? 'Закрыть' : 'Сохранить'}</Button>
      </Modal.Footer>
		</Modal>
	}
}