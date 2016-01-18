import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import ROUTES, { getRouteById } from '../../mocks/routes.js';
import WORK_TYPES from '../../mocks/work_types.js';
import {monthes} from '../utils/dates.js';
import Div from './ui/Div.jsx';

import WaybillForm from './WaybillForm.jsx';

import { getFuelTypeById } from '../stores/FuelTypes.js';
import { getDefaultBill } from '../stores/WaybillsStore.js';
import { makeTime, makeDate } from '../utils/dates.js';
import { validate as validateNumber} from '../validate/validateNumber.js';

let getFIOById = (employees, id, fullFlag = false) => {
	const employee = _.find(employees, d => d.id === id) || null;
	if (!employee) return '';
	let result = employee.last_name + ' ';
	result += fullFlag ? `${employee.first_name} ${employee.middle_name}` : `${employee.first_name[0]}. ${employee.middle_name[0]}.`;
	return result;
};

let getDriverById = (drivers, id) => {
	return _.find(drivers, d => d.id === id) || {};
};

let getCarById = (cars, id) => {
	return _.find(cars, c => c.asuods_id === id) || {};
};

let validateRequired = (field, data) => {
	console.log(field, data);
	if (typeof data === 'string' && data.length === 0) {
		return 'Поле должно быть заполнено';
	}
	return typeof data === 'undefined' || data === null ? 'Поле должно быть заполнено' : void 0;
};

let validateWaybill = (waybill, errors) => {
	let waybillErrors = _.clone(errors);

	_.keys(waybill).map( f => {
		if (['plan_departure_date', 'plan_arrival_date', 'driver_id', 'car_id', 'fuel_type_id', 'fuel_start'].indexOf(f) > -1) {
			waybillErrors[f] = validateRequired(f, waybill[f]);
		}
		if (['fuel_start', 'odometr_start', 'motohours_start'].indexOf(f) > -1) {
			waybillErrors[f] = validateNumber(f, waybill[f]);
		}
	});

	return waybillErrors;
};

let validateClosingWaybill = (waybill, errors) => {
	let waybillErrors = _.clone(errors);
	_.keys(waybill).map( f => {
		if (['odometr_end', 'motohours_end', 'fuel_given', 'fuel_end'].indexOf(f) > -1) {
			waybillErrors[f] = validateRequired(f, waybill[f]);
			waybillErrors[f] = validateNumber(f, waybill[f]);
		}
	});

	return waybillErrors;
};

const formStages = ['creating', 'post-creating', 'display', 'closing'];

class WaybillFormWrap extends Component {
	constructor(props) {
		super(props);

		this.state = {
			formStage: formStages[0],
			formState: null,
			formErrors: {},
			canSave: false,
			canPrint: false
		};
	}

	componentWillReceiveProps(props) {

		if (props.showForm) {
			if (props.bill === null ) {
				const defaultBill = getDefaultBill();
				this.setState({
					formState: defaultBill,
					formStage: formStages[0],
					canSave: false,
					formErrors: validateWaybill(defaultBill, {}),
				})
			} else {
				if (props.bill.status === 'active') {
					let _bill = _.clone(props.bill);

					_bill.fact_departure_date = moment(_bill.plan_departure_date).toDate();
					_bill.fact_arrival_date = moment(_bill.plan_arrival_date).toDate();
					_bill.plan_departure_date = moment(_bill.plan_departure_date).toDate();
					_bill.plan_arrival_date = moment(_bill.plan_arrival_date).toDate();

					this.setState({
						formState: _bill,
						formStage: formStages[3],
						formErrors: validateClosingWaybill(_bill, {}),
						canPrint: false,
						canSave: false,
					});

				} else if (props.bill.status === 'draft') {
					this.setState({
						formState: props.bill,
						formStage: formStages[1],
						canPrint: true,
						canSave: true,
						formErrors: {}
					});
				} else {
					this.setState({
						formState: props.bill,
						formStage: formStages[2],
						formErrors: {}
					});
				}
			}
		}

	}


	handleFormStateChange(field, e) {
		console.log( 'waybill form changed', field, e)
		const value = !!e.target ? e.target.value : e;
		let { formState, formStage, formErrors } = this.state;
		let newState = {};
		formState[field] = value;

		if (['creating', 'post-creating'].indexOf(this.state.formStage) > -1) {
			formErrors = validateWaybill(formState, formErrors);
		} else if (this.state.formStage === 'closing') {
			formErrors = validateClosingWaybill(formState, formErrors);
		}
		newState.canSave = _(formErrors).map(v => !!v).filter(e => e === true).value().length === 0;

		if (field === 'odometr_end') {
			formState.odometr_diff = formState.odometr_end - formState.odometr_start;
		}
		if (field === 'motohours_end') {
			formState.motohours_diff = formState.motohours_end - formState.motohours_start;
		}
		if (field === 'motohours_equip_end') {
			formState.motohours_equip_diff = formState.motohours_equip_end - formState.motohours_equip_start;
		}

		console.log(formErrors);
		newState.formState = formState;
		newState.formErrors = formErrors;
		newState.formStage = formStage;

		this.setState(newState);
	}

  handlePrint(event, print_form_type = 1) {

  	console.log('printing bill', this.state.formState);
  	let f = this.state.formState;
  	let creation_date = moment(f.date_create);

  	let zhzhzh = 'ГБУ г.Москвы "Жилищник района Крылатское"';
  	let driver = getDriverById(this.props.driversList, f.driver_id);
  	let car = getCarById(this.props.carsList, f.car_id);
  	//let route = getRouteById(f.ROUTE_ID);
		const plan_departure_date = moment(f.plan_departure_date);
		const plan_arrival_date = moment(f.plan_arrival_date);
		console.log(driver);

  	let URL = 'http://ods.mos.ru/ssd/city-dashboard/' + (print_form_type === 2 ? 'plate_truck/' : 'plate_special/');
  	let data = print_form_type === 2 ?
  	'?registration_number='+f.id+
		'&waybill_open_day='+creation_date.date() +
		'&waybill_open_month='+monthes[creation_date.month()]+
		'&waybill_open_year='+creation_date.year()+
		'&organization_data='+zhzhzh+
		'&automobile_mark='+car.model+
		'&automobile_number='+car.gov_number+
		'&driver_fio_full='+getFIOById(this.props.driversList, driver.id, true)+
		'&license_number='+(driver.drivers_license === 'None' ? driver.special_license : driver.drivers_license)+
		'&odometer_start=' + f.odometr_start +
		'&depart_day=' + plan_departure_date.day()+
		'&depart_month='+plan_departure_date.month()+
		'&depart_hour='+ plan_departure_date.hours() +
		'&depart_minute='+plan_departure_date.minutes() +
		'&return_day='+plan_arrival_date.date()+
		'&return_month='+(plan_arrival_date.month())+
		'&return_hour='+plan_arrival_date.hours()+
		'&return_minute='+plan_arrival_date.minutes()+
		'&fuel_mark='+getFuelTypeById(f.fuel_type_id).label+
		'&fuel_start='+f.fuel_start+
		'&operation_equipment_start_time='+f.motohours_equip_start+
		'&operation_engine_start_time='+
		'&trainee_fio='+
		'&possession_organization_data='+zhzhzh+
		'&fuel_issue='+f.fuel_to_give+
		'&dispatcher_last_name='+
		'&pass_driver_last_name='+driver.last_name+
		'&receive_driver_last_name='+driver.last_name+
		//'&complete_task_route='+route.name+
		'&complete_task_odometer_start='+f.odometr_start+
  	'&complete_task_route='+'1'+
  	'&complete_number_trips='+'1'+
		'&complete_fuel_mark='+getFuelTypeById(f.fuel_type_id).label
  	:
  	'?registration_number='+f.id+
  	'&waybill_open_day='+creation_date.date() +
  	'&waybill_open_month='+monthes[creation_date.month()]+
  	'&waybill_open_year='+creation_date.year()+
  	'&organization_data='+zhzhzh+
  	'&automobile_mark='+car.model+
  	'&automobile_number='+car.gov_number+
  	'&driver_fio_full='+getFIOById(this.props.driversList, driver.id, true)+
  	'&license_number='+(driver.drivers_license == '' ? driver.special_license : driver.drivers_license)+
  	'&odometer_start='+ f.odometr_start +
  	'&depart_time='+makeTime(f.plan_departure_date)+
  	'&return_time='+makeTime(f.plan_arrival_date)+
  	'&fuel_mark='+getFuelTypeById(f.fuel_type_id).label+
  	'&fuel_start='+f.fuel_start+
  	'&operation_equipment_start_time='+
  	'&operation_engine_start_time='+
  	'&possession_organization_data='+zhzhzh+
  	'&dispatcher_last_name='+
  	'&pass_driver_last_name='+driver.last_name+
  	'&receive_driver_last_name='+
  	'&complete_task_route='+'1'+
  	//'&complete_number_trips='+'1'+
  	'&complete_task_odometer_start=';

  	let linkTo = URL + data;

  	//console.log( 'print url', linkTo, f);
		this.handleFormSubmit(this.state.formState, true);

  	window.location = linkTo;
  }


	handleFormSubmit(formState, activate = false) {
		let billStatus = formState.status;
		let stage = this.state.formStage;
		const { flux } = this.context;
		console.log(stage);

		if (stage === 'creating') {
			formState.status = 'draft';
			flux.getActions('waybills').createWaybill(formState);
			// this.setState({
			// 	formStage: formStages[1],
			// 	//canPrint: true,
			// 	canSave: false
			// });
			this.props.onFormHide();
		} else if (formState.status === 'draft') {
			if (activate) {
				formState.status = 'active';
				flux.getActions('waybills').updateWaybill(formState);
				// this.setState({
				// 	formStage: formStages[3],
				// 	canSave: false
				// });
				this.props.onFormHide();
			}
			else {
				flux.getActions('waybills').updateWaybill(formState);
				this.props.onFormHide();
			}
		} else if (stage === 'closing') {
			formState.status = 'closed';
			flux.getActions('waybills').updateWaybill(formState);
			this.props.onFormHide();
		}

		return;
	}

	render() {

		return 	<Div hidden={!this.props.showForm}>
							<WaybillForm formState = {this.state.formState}
													 onSubmit={this.handleFormSubmit.bind(this)}
													 handlePrint={this.handlePrint.bind(this)}
													 handleFormChange={this.handleFormStateChange.bind(this)}
													 show={this.props.showForm}
													 onHide={this.props.onFormHide}
													 {...this.state}/>
						</Div>

	}

}

WaybillFormWrap.contextTypes = {
	flux: React.PropTypes.object,
};

export default WaybillFormWrap;
