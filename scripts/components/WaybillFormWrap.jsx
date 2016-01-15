import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import ROUTES, { getRouteById } from '../../mocks/routes.js';
import WORK_TYPES from '../../mocks/work_types.js';
import {monthes} from '../utils/dates.js';
import Div from './ui/Div.jsx';

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
					formState: getDefaultBill(_.max(props.waybillsList.map(w => w.id))),
					formStage: formStages[0]
				})
			} else {
				if (props.bill.STATUS === 'open') {
					let _bill = _.clone(props.bill);

					_bill.fact_departure_date = moment(_bill.plan_departure_date).toDate();
					_bill.fact_arrival_date = moment(_bill.plan_arrival_date).toDate();
					_bill.plan_departure_date = moment(_bill.plan_departure_date).toDate();
					_bill.plan_arrival_date = moment(_bill.plan_arrival_date).toDate();

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

  	console.log('printing bill', this.props.formState);
  	let f = this.state.formState;
  	let creation_date = moment(f.date_create);

  	let zhzhzh = 'ГБУ г.Москвы "Жилищник района Крылатское"';
  	let driver = getDriverByCode(f.driver_id);
  	let car = getCarById(f.car_id);
  	let route = getRouteById(f.ROUTE_ID);

  	let URL = 'http://ods.mos.ru/ssd/city-dashboard/' + (print_form_type === 2 ? 'plate_truck/' : 'plate_special/');
  	let data = print_form_type === 2 ?
  	'?registration_number='+f.number+
		'&waybill_open_day='+creation_date.date() +
		'&waybill_open_month='+monthes[creation_date.month()]+
		'&waybill_open_year='+creation_date.year()+
		'&organization_data='+zhzhzh+
		'&automobile_mark='+car.model+
		'&automobile_number='+car.gov_number+
		'&driver_fio_full='+getFIOById(driver.id, true)+
		'&license_number='+(driver["Водительское удостоверение"] == '' ? driver["Специальное удостоверение"] : driver["Водительское удостоверение"])+
		'&odometer_start=' + f.odometr_start +
		'&depart_day=' + f.plan_departure_date.getDate()+
		'&depart_month='+ (f.plan_departure_date.getMonth()+1) +
		'&depart_hour='+ f.plan_departure_date.getHours() +
		'&depart_minute='+f.plan_departure_date.getMinutes() +
		'&return_day='+f.plan_arrival_date.getDate()+
		'&return_month='+(f.plan_arrival_date.getMonth()+1)+
		'&return_hour='+f.plan_arrival_date.getHours()+
		'&return_minute='+f.plan_arrival_date.getMinutes()+
		'&fuel_mark='+getFuelTypeById(f.fuel_type_id).label+
		'&fuel_start='+f.fuel_start+
		'&operation_equipment_start_time='+f.motohours_equip_start+
		'&operation_engine_start_time='+
		'&trainee_fio='+
		'&possession_organization_data='+zhzhzh+
		'&fuel_issue='+f.fuel_to_give+
		'&dispatcher_last_name='+
		'&pass_driver_last_name='+driver['Фамилия']+
		'&receive_driver_last_name='+driver['Фамилия']+
		'&complete_task_route='+route.name+
		'&complete_task_odometer_start='+f.odometr_start+
		'&complete_fuel_mark='+getFuelTypeById(f.fuel_type_id).label+
		'&complete_number_trips='+f.PASSES_COUNT
  	:
  	'?registration_number='+f.number+
  	'&waybill_open_day='+creation_date.date() +
  	'&waybill_open_month='+monthes[creation_date.month()]+
  	'&waybill_open_year='+creation_date.year()+
  	'&organization_data='+zhzhzh+
  	'&automobile_mark='+car.model+
  	'&automobile_number='+car.gov_number+
  	'&driver_fio_full='+getFIOById(driver.id, true)+
  	'&license_number='+(driver["Водительское удостоверение"] == '' ? driver["Специальное удостоверение"] : driver["Водительское удостоверение"])+
  	'&odometer_start='+ f.odometr_start +
  	'&depart_time='+makeTime(f.plan_departure_date)+
  	'&return_time='+makeTime(f.plan_arrival_date)+
  	'&fuel_mark='+getFuelTypeById(f.fuel_type_id).label+
  	'&fuel_start='+f.fuel_start+
  	'&operation_equipment_start_time='+
  	'&operation_engine_start_time='+
  	'&possession_organization_data='+zhzhzh+
  	'&dispatcher_last_name='+
  	'&pass_driver_last_name='+driver['Фамилия']+
  	'&receive_driver_last_name='+
  	'&complete_task_route='+
  	'&complete_task_odometer_start=';

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
