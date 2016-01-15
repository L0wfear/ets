import React, { Component } from 'react';
import moment from 'moment';
import ROUTES, { getRouteById } from '../../mocks/routes.js';
import WORK_TYPES from '../../mocks/work_types.js';
import {monthes} from '../utils/dates.js';

import WaybillForm from './WaybillForm.jsx';

import { getMasters, getDrivers, getFIOById, getDriverByCode } from './../stores/EmployeesStore.js';
import getFuelTypes, {getFuelTypeById } from '../stores/FuelTypes.js';
import { getDefaultBill } from '../../mocks/waybills.js';
import { getCarById } from '../../mocks/krylatskoe_cars.js';
import { makeTime, makeDate } from '../utils/dates.js';

const FUEL_TYPES = getFuelTypes();
const MASTERS = getMasters();
const DRIVERS = getDrivers();

const formStages = ['creating', 'post-creating', 'display', 'closing'];

class WaybillFormWrap extends Component {
	constructor(props) {
		super(props);

		this.state = {
			formStage: formStages[0],
			formState: null,
			canSave: false,
			canPrint: false
		}
	}

	componentWillReceiveProps(props) {

		if (props.showForm) {
			if (props.bill === null ) {
				this.setState({
					formState: getDefaultBill(),
					formStage: formStages[0]
				})
			} else {
				if (props.bill.STATUS === 'open') {
					let _bill = _.clone(props.bill);

					_bill.FACT_DEPARTURE_DATE = moment(_bill.PLAN_DEPARTURE_DATE).toDate();
					_bill.FACT_ARRIVAL_DATE = moment(_bill.PLAN_ARRIVAL_DATE).toDate();
					_bill.PLAN_DEPARTURE_DATE = moment(_bill.PLAN_DEPARTURE_DATE).toDate();
					_bill.PLAN_ARRIVAL_DATE = moment(_bill.PLAN_ARRIVAL_DATE).toDate();

					this.setState({
						formState: _bill,
						formStage: formStages[3]
					})

				} else {
					this.setState({
						formState: props.bill,
						formStage: formStages[2]
					})
				}
			}
		}

	}


	handleFormStateChange(field, e) {
		console.log( 'waybill form changed', field, e)

		let formState = this.state.formState;
		let newState = {};
		formState[field] = !!e.target ? e.target.value : e;

		let HAS_REQUIRED_FIELDS =
				this.state.formStage === 'creating' || this.state.formStage === 'post-creating' ?
					!!formState.RESPONSIBLE_PERSON_ID &&
					!!formState.PLAN_DEPARTURE_DATE &&
					!!formState.PLAN_ARRIVAL_DATE &&
					!!formState.DRIVER_ID &&
					!!formState.CAR_ID &&
					!!formState.ODOMETR_START &&
					!!formState.FUEL_TYPE_ID &&
					!!formState.FUEL_START
				:
					!!formState.ODOMETR_END &&
					!!formState.MOTOHOURS_END &&
					!!formState.FUEL_GIVEN &&
					!!formState.FUEL_END;


		if (HAS_REQUIRED_FIELDS) {
			newState.canPrint = true;
			if (this.state.formStage === 'creating') {
				newState.canSave = true;
			}

			if (this.state.formStage === 'post-creating') {
				newState.canSave = true;
			}

			if (this.state.formStage === 'closing') {
				newState.canSave = true;
			}

		}

		if (field === 'ODOMETR_END') {
			formState.ODOMETR_DIFF = formState.ODOMETR_END - formState.ODOMETR_START;
		}
		if (field === 'MOTOHOURS_END') {
			formState.MOTOHOURS_DIFF = formState.MOTOHOURS_END - formState.MOTOHOURS_START;
		}
		if (field === 'MOTOHOURS_EQUIP_END') {
			formState.MOTOHOURS_EQUIP_DIFF = formState.MOTOHOURS_EQUIP_END - formState.MOTOHOURS_EQUIP_START;
		}

		newState.formState = formState;
		//if (field === 'fuel')
		this.setState(newState)
	}

  handlePrint(event, print_form_type = 1) {

  	console.log('printing bill', this.props.formState);
  	let f = this.state.formState;
  	let creation_date = moment(f.DATE_CREATE);

  	let zhzhzh = 'ГБУ г.Москвы "Жилищник района Крылатское"';
  	let driver = getDriverByCode(f.DRIVER_ID);
  	let car = getCarById(f.CAR_ID);
  	let route = getRouteById(f.ROUTE_ID);

  	let URL = 'http://ods.mos.ru/ssd/city-dashboard/' + (print_form_type === 2 ? 'plate_truck/' : 'plate_special/');
  	let data = print_form_type === 2 ?
  	'?registration_number='+f.NUMBER+
		'&waybill_open_day='+creation_date.date() +
		'&waybill_open_month='+monthes[creation_date.month()]+
		'&waybill_open_year='+creation_date.year()+
		'&organization_data='+zhzhzh+
		'&automobile_mark='+car.model+
		'&automobile_number='+car.gov_number+
		'&driver_fio_full='+getFIOById(driver.id, true)+
		'&license_number='+(driver["Водительское удостоверение"] == '' ? driver["Специальное удостоверение"] : driver["Водительское удостоверение"])+
		'&odometer_start=' + f.ODOMETR_START +
		'&depart_day=' + f.PLAN_DEPARTURE_DATE.getDate()+
		'&depart_month='+ (f.PLAN_DEPARTURE_DATE.getMonth()+1) +
		'&depart_hour='+ f.PLAN_DEPARTURE_DATE.getHours() +
		'&depart_minute='+f.PLAN_DEPARTURE_DATE.getMinutes() +
		'&return_day='+f.PLAN_ARRIVAL_DATE.getDate()+
		'&return_month='+(f.PLAN_ARRIVAL_DATE.getMonth()+1)+
		'&return_hour='+f.PLAN_ARRIVAL_DATE.getHours()+
		'&return_minute='+f.PLAN_ARRIVAL_DATE.getMinutes()+
		'&fuel_mark='+getFuelTypeById(f.FUEL_TYPE_ID).label+
		'&fuel_start='+f.FUEL_START+
		'&operation_equipment_start_time='+f.MOTOHOURS_EQUIP_START+
		'&operation_engine_start_time='+
		'&trainee_fio='+
		'&possession_organization_data='+zhzhzh+
		'&fuel_issue='+f.FUEL_TO_GIVE+
		'&dispatcher_last_name='+
		'&pass_driver_last_name='+driver['Фамилия']+
		'&receive_driver_last_name='+driver['Фамилия']+
		'&complete_task_route='+route.name+
		'&complete_task_odometer_start='+f.ODOMETR_START+
		'&complete_fuel_mark='+getFuelTypeById(f.FUEL_TYPE_ID).label+
		'&complete_number_trips='+f.PASSES_COUNT
  	:
  	'?registration_number='+f.NUMBER+
  	'&waybill_open_day='+creation_date.date() +
  	'&waybill_open_month='+monthes[creation_date.month()]+
  	'&waybill_open_year='+creation_date.year()+
  	'&organization_data='+zhzhzh+
  	'&automobile_mark='+car.model+
  	'&automobile_number='+car.gov_number+
  	'&driver_fio_full='+getFIOById(driver.id, true)+
  	'&license_number='+(driver["Водительское удостоверение"] == '' ? driver["Специальное удостоверение"] : driver["Водительское удостоверение"])+
  	'&odometer_start='+ f.ODOMETR_START +
  	'&depart_time='+makeTime(f.PLAN_DEPARTURE_DATE)+
  	'&return_time='+makeTime(f.PLAN_ARRIVAL_DATE)+
  	'&fuel_mark='+getFuelTypeById(f.FUEL_TYPE_ID).label+
  	'&fuel_start='+f.FUEL_START+
  	'&operation_equipment_start_time='+
  	'&operation_engine_start_time='+
  	'&possession_organization_data='+zhzhzh+
  	'&dispatcher_last_name='+
  	'&pass_driver_last_name='+driver['Фамилия']+
  	'&receive_driver_last_name='+
  	'&complete_task_route='+
  	'&complete_task_odometer_start=';



  	//console.log( creation_date, creation_date.year(), creation_date.month(), );
  	let linkTo = URL + data;

  	console.log( 'print url', linkTo, f)

  	window.location = linkTo;
  }


	handleFormSubmit(formState) {
		let billStatus = formState.STATUS;
		let stage = this.state.formStage;
		const { flux } = this.context;

		if (stage === 'creating') {
			formState.STATUS = 'open';
			flux.getActions('waybills').createWaybill(formState);
			this.setState({
				formStage: formStages[1],
				canPrint: true,
				canSave: false
			})
			//this.props.updateTable();
		} else if (stage === 'post-creating') {
			formState.STATUS = 'open';
			flux.getActions('waybills').updateWaybill(formState, true);
			this.setState({
				canSave: false
			})
		} else if (stage === 'closing') {
			formState.STATUS = 'closed';
			flux.getActions('waybills').updateWaybill(formState);
			this.props.onFormHide()
		}



		return ;
		// if (billStatus === null ){
		// 	console.log('creating new bill')
		// 	createBill(formState);
		// 	this.setState({
		// 		showForm: false,
		// 		formStage: formStages[1],
		// 		canSave: false
		// 	})
		// 	this.props.updateTable();
		// } else if (billStatus === 'open') {
		// 	console.log('updating bill')
		// 	updateBill(formState)
		// 	this.setState({
		// 		showForm: false
		// 	})
		// } else {
		// 	console.log('xz')
		// }
	}

	render() {

		let props = this.props;

		return 	props.showForm ? <WaybillForm
								formState = {this.state.formState}
								onSubmit={this.handleFormSubmit.bind(this)}
								handlePrint={this.handlePrint.bind(this)}
								handleFormChange={this.handleFormStateChange.bind(this)}
								show={this.props.showForm}
								onHide={this.props.onFormHide}
								{...this.state}/>
								: null;

	}

}

WaybillFormWrap.contextTypes = {
	flux: React.PropTypes.object,
};

export default WaybillFormWrap;
