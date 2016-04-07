import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import Div from '../ui/Div.jsx';
import WaybillForm from './WaybillForm.jsx';
import { getDefaultBill } from '../../stores/WaybillsStore.js';
import { isNotNull, isEmpty } from 'utils/functions';
import { validateRow } from 'validate/validateRow.js';
import { waybillSchema, waybillClosingSchema } from '../models/WaybillModel.js';
import config from '../../config.js';

let validateWaybill = (waybill, errors) => {
	let waybillErrors = _.clone(errors);

	_.each(waybillSchema.properties, prop => {
		waybillErrors[prop.key] = validateRow(prop, waybill[prop.key]);
	});

	if (!isEmpty(waybill.car_has_odometer)) {
		if (waybill.car_has_odometer) {
			if (isEmpty(waybill.odometr_start)) {
				waybillErrors.odometr_start = `Поле "Одометр.Выезд" должно быть заполнено`;
			}
		} else {
			if (isEmpty(waybill.motohours_start)) {
				waybillErrors.motohours_start = `Поле "Счетчик моточасов.Выезд" должно быть заполнено`;
			}
		}
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
			canClose: false,
			canPrint: false
		};
	}

	componentWillReceiveProps(props) {

		if (props.showForm && props.showForm !== this.props.showForm) {
			if (props.element === null ) {
				const defaultBill = getDefaultBill();
				this.setState({
					formState: defaultBill,
					canSave: false,
					canClose: false,
					canPrint: false,
					formErrors: validateWaybill(defaultBill, {}),
				})
			} else {

				let waybill = _.clone(props.element);
				if (waybill.mission_id_list.filter((v) => v).length === 0) {
					waybill.mission_id_list = [];
				}

				if (props.element.status === 'active') {

					this.setState({
						formState: waybill,
						formErrors: validateClosingWaybill(waybill, {}),
						canPrint: false,
						canSave: ! !!_.filter(validateClosingWaybill(waybill, {}), (v,k) => k === 'fuel_end' ? false : v).length,
						canClose: ! !!_.filter(validateClosingWaybill(waybill, {})).length,
					});

				} else if (props.element.status === 'draft') {

					this.setState({
						formState: waybill,
						canPrint: true,
						canSave: ! !!_.filter(validateWaybill(waybill, {})).length,
						canClose: ! !!_.filter(validateWaybill(waybill, {})).length,
						formErrors: validateWaybill(waybill, {})
					});

				} else if (props.element.status === 'closed') {

					if (waybill.array_agg) {
						waybill.taxes = waybill.array_agg;
					}
					if (isNotNull(waybill.odometr_end) && isNotNull(waybill.odometr_start)) {
						waybill.odometr_diff = waybill.odometr_end - waybill.odometr_start;
					}
					if (isNotNull(waybill.motohours_end) && isNotNull(waybill.motohours_start)) {
						waybill.motohours_diff = waybill.motohours_end - waybill.motohours_start;
					}
					if (isNotNull(waybill.motohours_equip_end) && isNotNull(waybill.motohours_equip_start)) {
						waybill.motohours_equip_diff = waybill.motohours_equip_end - waybill.motohours_equip_start;
					}

					this.setState({
						formState: waybill,
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
		newState.canSave = ! !!_.filter(formErrors, (v,k) => k === 'fuel_end' ? false : v).length;
		newState.canClose = ! !!_.filter(formErrors).length;

		if (field === 'odometr_end' && formState.status) {
			formState.odometr_diff = formState.odometr_end - formState.odometr_start;
		}
		if (field === 'motohours_end' && formState.status) {
			formState.motohours_diff = formState.motohours_end - formState.motohours_start;
		}
		if (field === 'motohours_equip_end' && formState.status) {
			formState.motohours_equip_diff = formState.motohours_equip_end - formState.motohours_equip_start;
		}

		newState.formState = formState;
		newState.formErrors = formErrors;

		this.setState(newState);
	}

  handlePrint(event, print_form_type = 1) {
  	let f = this.state.formState;

  	let URL = `${config.backend}/` + (print_form_type === 2 ? 'plate_truck/' : 'plate_special/') + `?waybill_id=`;
		let ID = f.id;

		let callback = (id) => {
			console.log('printing waybill', URL);
			URL = id ?  URL + id : URL + ID;
			window.location = URL;
		};
		//callback();
		this.handleFormSubmit(this.state.formState, callback);

  }


	async handleFormSubmit(state, callback) {
		let formState = _.cloneDeep(state);
		let billStatus = formState.status;
		const { flux, setLoading } = this.context;

		if (!!!billStatus) { // если создаем ПЛ
			if (typeof callback === 'function') {
				formState.status = 'draft';
				let r = await flux.getActions('waybills').create(formState);
				const id = _.max(r.result, res => res.id).id;
				formState.status = 'active';
				formState.id = id;
				try {
					await flux.getActions('waybills').update(formState);
				} catch (e) {
					return;
				}
				callback(id);
			} else {
				formState.status = 'draft';
				try {
					await flux.getActions('waybills').create(formState);
				} catch (e) {
					console.log(e);
					return;
				}
			}
			this.props.onFormHide();
		} else if (billStatus === 'draft') { // если ПЛ обновляем
			if (typeof callback === 'function') {
				formState.status = 'active';
				try {
					await flux.getActions('waybills').update(formState);
				} catch (e) {
					return;
				}
				callback();
				flux.getActions('waybills').getWaybills();
				this.props.onFormHide();
			} else {
				try {
					await flux.getActions('waybills').update(formState);
				} catch (e) {
					return;
				}
				flux.getActions('waybills').getWaybills();
				this.props.onFormHide();
			}
		} else if (billStatus === 'active') {
			try {
				await flux.getActions('waybills').update(formState);
			} catch (e) {
				console.log(e);
				return;
			}
			flux.getActions('waybills').getWaybills();
			this.props.onFormHide();
		}

		return;
	}

	async handleClose() {
		let { formState } = this.state;
		try {
			formState.status = 'closed';
			await this.context.flux.getActions('waybills').update(formState);
		} catch (e) {
			console.log(e);
			return;
		}
		this.context.flux.getActions('waybills').getWaybills();
		this.props.onFormHide();
	}

	render() {

		return 	<Div hidden={!this.props.showForm}>
							<WaybillForm formState = {this.state.formState}
													 onSubmit={this.handleFormSubmit.bind(this)}
													 handlePrint={this.handlePrint.bind(this)}
													 handleClose={this.handleClose.bind(this)}
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
