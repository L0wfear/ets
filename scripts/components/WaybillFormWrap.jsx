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
};

let getDriverById = (drivers, id) => {
	return _.find(drivers, d => d.id === id) || {};
};

let getCarById = (cars, id) => {
	return _.find(cars, c => c.asuods_id === id) || {};
};

let validateRequired = (field, data) => {
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
		if (['fuel_end'].indexOf(f) > -1) {
			waybillErrors[f] = validateRequired(f, waybill[f]);
		}
		if (['odometr_end', 'motohours_end', 'fuel_given'].indexOf(f) > -1) {
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

					_bill.fact_departure_date = getDateWithoutTZ(_bill.plan_departure_date);
					_bill.fact_arrival_date = getDateWithoutTZ(_bill.plan_arrival_date);
					_bill.plan_departure_date = getDateWithoutTZ(_bill.plan_departure_date);
					_bill.plan_arrival_date = getDateWithoutTZ(_bill.plan_arrival_date);

					this.setState({
						formState: _bill,
						formStage: formStages[3],
						formErrors: validateClosingWaybill(_bill, {}),
						canPrint: false,
						canSave: false,
					});

				} else if (props.bill.status === 'draft') {

					let _bill = _.clone(props.bill);

					_bill.fact_departure_date = getDateWithoutTZ(_bill.plan_departure_date);
					_bill.fact_arrival_date = getDateWithoutTZ(_bill.plan_arrival_date);
					_bill.plan_departure_date = getDateWithoutTZ(_bill.plan_departure_date);
					_bill.plan_arrival_date = getDateWithoutTZ(_bill.plan_arrival_date);

					this.setState({
						formState: _bill,
						formStage: formStages[1],
						canPrint: true,
						canSave: true,
						formErrors: {}
					});
				} else {
					let _bill = _.clone(props.bill);
					console.log(_bill);
					if (_bill.data && _bill.data.taxes) {
						_bill.taxes = _bill.data.taxes;
					}

					this.setState({
						formState: _bill,
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
  	let f = this.state.formState;

  	let URL = 'http://ods.mos.ru/ssd/city-dashboard/' + (print_form_type === 2 ? 'plate_truck/' : 'plate_special/') + `?waybill_id=`;
		let ID = f.id;

		let callback = (id) => {
			console.log('printing waybill', URL);
			id ? URL = URL + id : URL + ID;
			window.location = URL;
		};
		this.handleFormSubmit(this.state.formState, callback);


  }


	handleFormSubmit(formState, callback) {
		let billStatus = formState.status;
		let stage = this.state.formStage;
		const { flux } = this.context;
		console.log(stage);

		if (stage === 'creating') {
			if (typeof callback === 'function') {
				formState.status = 'draft';
				flux.getActions('waybills').createWaybill(formState).then((r) => {
					const id = _.max(r.result, res => res.id).id;
					formState.status = 'active';
					formState.id = id;
					flux.getActions('waybills').updateWaybill(formState).then(() => {
						callback(id);
					});
				});
			} else {
				formState.status = 'draft';
				flux.getActions('waybills').createWaybill(formState);
			}
			// this.setState({
			// 	formStage: formStages[1],
			// 	//canPrint: true,
			// 	canSave: false
			// });
			this.props.onFormHide();
		} else if (formState.status === 'draft') {
			if (typeof callback === 'function') {
				formState.status = 'active';
				flux.getActions('waybills').updateWaybill(formState).then(() => {
					console.log('waybill has been updated');
					callback();
				});
				// this.setState({
				// 	formStage: formStages[3],
				// 	canSave: false
				// });
				this.props.onFormHide();
			} else {
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
