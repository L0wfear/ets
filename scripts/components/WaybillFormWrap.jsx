import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import ROUTES, { getRouteById } from '../../mocks/routes.js';
import WORK_TYPES from '../../mocks/work_types.js';
import {monthes} from '../utils/dates.js';
import Div from './ui/Div.jsx';

import WaybillForm from './WaybillForm.jsx';

import { getFIOById } from './../stores/EmployeesStore.js';
import { getFuelTypeById } from '../stores/FuelTypes.js';
import { getDefaultBill } from '../../mocks/waybills.js';
import { makeTime, makeDate } from '../utils/dates.js';


let getDriverByCode = (drivers, code) => {
	return _.find(drivers, d => d.personnel_number === code) || {};
};

let getCarById = (cars, id) => {
	return _.find(cars, c => c.asuods_id === id) || {};
};

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
				let max = _.max(props.waybillsList.map(w => w.id));
				if (max < 0) max = 0;
				this.setState({
					formState: getDefaultBill(max),
					formStage: formStages[0]
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
						formStage: formStages[3]
					})

				} else if (props.bill.status === 'draft'){
					this.setState({
						formState: props.bill,
						formStage: formStages[1],
						canPrint: true,
						canSave: true,
					});
				} else {
					this.setState({
						formState: props.bill,
						formStage: formStages[2]
					});
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
					!!formState.responsible_person_id &&
					!!formState.plan_departure_date &&
					!!formState.plan_arrival_date &&
					!!formState.driver_id &&
					!!formState.car_id &&
					!!formState.odometr_start &&
					!!formState.fuel_type_id &&
					!!formState.fuel_start
				:
					!!formState.odometr_end &&
					!!formState.motohours_end &&
					!!formState.fuel_given &&
					!!formState.fuel_end;


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

		if (field === 'odometr_end') {
			formState.odometr_diff = formState.odometr_end - formState.odometr_start;
		}
		if (field === 'motohours_end') {
			formState.motohours_diff = formState.motohours_end - formState.motohours_start;
		}
		if (field === 'motohours_equip_end') {
			formState.motohours_equip_diff = formState.motohours_equip_end - formState.motohours_equip_start;
		}

		newState.formState = formState;
		this.setState(newState)
	}

  handlePrint(event, print_form_type = 1) {

  	console.log('printing bill', this.state.formState);
  	let f = this.state.formState;
  	let creation_date = moment(f.date_create);

  	let zhzhzh = 'ГБУ г.Москвы "Жилищник района Крылатское"';
  	let driver = getDriverByCode(this.props.driversList, f.driver_id);
  	let car = getCarById(this.props.carsList, f.car_id);
  	//let route = getRouteById(f.ROUTE_ID);
		console.log(print_form_type);
		const plan_departure_date = moment(f.plan_departure_date);
		const plan_arrival_date = moment(f.plan_arrival_date);

  	let URL = 'http://ods.mos.ru/ssd/city-dashboard/' + (print_form_type === 2 ? 'plate_truck/' : 'plate_special/');
  	let data = print_form_type === 2 ?
  	'?registration_number='+f.id+
		'&waybill_open_day='+creation_date.date() +
		'&waybill_open_month='+monthes[creation_date.month()]+
		'&waybill_open_year='+creation_date.year()+
		'&organization_data='+zhzhzh+
		'&automobile_mark='+car.model+
		'&automobile_number='+car.gov_number+
		'&driver_fio_full='+getFIOById(driver.id, true)+
		'&license_number='+(driver.drivers_license == '' ? driver.special_license : driver.drivers_license)+
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
  	'&driver_fio_full='+getFIOById(driver.id, true)+
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
  	'&complete_number_trips='+'1'+
  	'&complete_task_odometer_start=';

  	let linkTo = URL + data;

  	console.log( 'print url', linkTo, f);
		console.log(' print submit')
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
			this.setState({
				formStage: formStages[1],
				//canPrint: true,
				canSave: false
			})
		} else if (formState.status === 'draft') {
			console.warn('UPDATING WAYBILL')
			if (activate) {
				formState.status = 'active';
				flux.getActions('waybills').updateWaybill(formState);
				this.setState({
					formStage: formStages[3],
					canSave: false
				});
				this.props.onFormHide();
			}
			else {
				flux.getActions('waybills').updateWaybill(formState);
				// this.setState({
				// 	formStage: formStages[1],
				// });
				//this.props.onFormHide();
			}
		} else if (stage === 'closing') {
			formState.status = 'closed';
			flux.getActions('waybills').updateWaybill(formState);
			this.props.onFormHide();
		}

		return;
	}

	render() {

		console.log(this.props);

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
