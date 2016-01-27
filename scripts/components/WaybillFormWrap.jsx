import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import Div from './ui/Div.jsx';
import WaybillForm from './WaybillForm.jsx';
import { getDefaultBill } from '../stores/WaybillsStore.js';
import { getDateWithoutTZ } from '../utils/dates.js';
import { isNotNull, isEmpty } from '../utils/functions.js';
import { validateRow } from '../validate/validateRow.js';
import { waybillSchema, waybillClosingSchema } from './models/WaybillModel.js';

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

let validateWaybill = (waybill, errors) => {
	let waybillErrors = _.clone(errors);

	_.each(waybillSchema.properties, prop => {
		waybillErrors[prop.key] = validateRow(prop, waybill[prop.key]);
	});

	if (isEmpty(waybill.odometr_start) && isEmpty(waybill.motohours_start)) {
		waybillErrors.odometr_start = `Одно из полей "Одометр.Выезд"/"Счетчик моточасов.Выезд" должно быть заполнено`;
		waybillErrors.motohours_start = `Одно из полей "Одометр.Выезд"/"Счетчик моточасов.Выезд" должно быть заполнено`;
	}

	return waybillErrors;
};

let validateClosingWaybill = (waybill, errors) => {
	let waybillErrors = _.clone(errors);

	_.each(waybillClosingSchema.properties, prop => {
		waybillErrors[prop.key] = validateRow(prop, waybill[prop.key]);
	});

	return waybillErrors;
};

class WaybillFormWrap extends Component {
	constructor(props) {
		super(props);

		this.state = {
			formState: null,
			formErrors: {},
			canSave: false,
			canPrint: false
		};
	}

	componentWillReceiveProps(props) {

		if (props.showForm && props.showForm !== this.props.showForm) {
			if (props.bill === null ) {
				const defaultBill = getDefaultBill();
				this.setState({
					formState: defaultBill,
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
						canPrint: true,
						canSave: true,
						formErrors: {}
					});
				} else {
					let _bill = _.clone(props.bill);

					if (_bill.array_agg && _bill.array_agg.taxes) {
						_bill.taxes = _bill.array_agg.taxes;
					}
					if (isNotNull(_bill.odometr_end) && isNotNull(_bill.odometr_start)) {
						_bill.odometr_diff = _bill.odometr_end - _bill.odometr_start;
					}
					if (isNotNull(_bill.motohours_end) && isNotNull(_bill.motohours_start)) {
						_bill.motohours_diff = _bill.motohours_end - _bill.motohours_start;
					}
					if (isNotNull(_bill.motohours_equip_end) && isNotNull(_bill.motohours_equip_start)) {
						_bill.motohours_equip_diff = _bill.motohours_equip_end - _bill.motohours_equip_start;
					}

					this.setState({
						formState: _bill,
						formErrors: {}
					});
				}
			}
		}

	}


	handleFormStateChange(field, e) {
		console.log('waybill form changed', field, e)
		const value = e !== undefined && !!e.target ? e.target.value : e;
		let { formState, formErrors } = this.state;
		let newState = {};
		formState[field] = value;

		// validation
		if (!!!formState.status || formState.status === 'draft') {
			formErrors = validateWaybill(formState, formErrors);
		} else if (formState.status && formState.status === 'active') {
			formErrors = validateClosingWaybill(formState, formErrors);
		}

		// /validation
		newState.canSave = _(formErrors).map(v => !!v).filter(e => e === true).value().length === 0;

		if (field === 'odometr_end' && formState.status) {
			formState.odometr_diff = formState.odometr_end - formState.odometr_start;
		}
		if (field === 'motohours_end' && formState.status) {
			formState.motohours_diff = formState.motohours_end - formState.motohours_start;
		}
		if (field === 'motohours_equip_end' && formState.status) {
			formState.motohours_equip_diff = formState.motohours_equip_end - formState.motohours_equip_start;
		}

		console.log(formErrors);
		newState.formState = formState;
		newState.formErrors = formErrors;

		this.setState(newState);
	}

  handlePrint(event, print_form_type = 1) {
  	let f = this.state.formState;

  	let URL = 'http://ods.mos.ru/ssd/city-dashboard/' + (print_form_type === 2 ? 'plate_truck/' : 'plate_special/') + `?waybill_id=`;
		let ID = f.id;

		let callback = (id) => {
			console.log('printing waybill', URL);
			URL = id ?  URL + id : URL + ID;
			window.location = URL;
		};
		this.handleFormSubmit(this.state.formState, callback);

  }


	handleFormSubmit(formState, callback) {
		let billStatus = formState.status;
		const { flux, setLoading } = this.context;

		if (!!!billStatus) {
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
			this.props.onFormHide();
		} else if (billStatus === 'draft') {
			if (typeof callback === 'function') {
				formState.status = 'active';
				flux.getActions('waybills').updateWaybill(formState).then(() => {
					callback();
				});
				this.props.onFormHide();
			} else {
				flux.getActions('waybills').updateWaybill(formState);
				this.props.onFormHide();
			}
		} else if (billStatus === 'active') {
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
	setLoading: React.PropTypes.func,
};

export default WaybillFormWrap;
