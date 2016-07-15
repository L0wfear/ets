import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import Div from 'components/ui/Div.jsx';
import WaybillForm from './WaybillForm.jsx';
import { getDefaultBill } from '../../stores/WaybillsStore.js';
import { isNotNull, isEmpty, hasOdometer } from 'utils/functions';
import { validateRow } from 'validate/validateRow.js';
import { waybillSchema, waybillClosingSchema } from 'models/WaybillModel.js';
import config from '../../config.js';
import { notifications } from 'utils/notifications';
import Taxes from './Taxes.jsx';
import { getWarningNotification } from 'utils/notifications';

let validateWaybill = (waybill, errors) => {
	let waybillErrors = _.clone(errors);

	_.each(waybillSchema.properties, prop => {
		waybillErrors[prop.key] = validateRow(prop, waybill[prop.key]);
	});

	waybillErrors.fuel_end = '';

	const WAYBILL_CAR_HAS_ODOMETER = hasOdometer(waybill.gov_number);

	if (WAYBILL_CAR_HAS_ODOMETER) {
		if (isEmpty(waybill.odometr_start)) {
			waybillErrors.odometr_start = `Поле "Одометр.Выезд" должно быть заполнено`;
		}
	} else {
		if (isEmpty(waybill.motohours_start)) {
			waybillErrors.motohours_start = `Поле "Счетчик моточасов.Выезд" должно быть заполнено`;
		}
	}

	if ((waybill.motohours_start && waybill.motohours_end) && (waybill.motohours_end < waybill.motohours_start)) waybillErrors.motohours_end = `Поле "Счетчик моточасов.Возврат" должно быть больше или равно "Счетчик моточасов.Выезд"`

	if ((waybill.motohours_equip_start && waybill.motohours_equip_end) && (waybill.motohours_equip_end < waybill.motohours_equip_start)) waybillErrors.motohours_equip_end = `Поле "Счетчик моточасов оборудования.Возврат" должно быть больше или равно "Счетчик моточасов оборудования.Выезд"`

	if ((waybill.odometr_start && waybill.odometr_end) && (waybill.odometr_end < waybill.odometr_start)) waybillErrors.odometr_end = `Поле "Одометр.Возврат" должно быть больше или равно "Одометр.Выезд"`

	if ((waybill.odometr_equip_start && waybill.odometr_equip_end) && (waybill.odometr_equip_end < waybill.odometr_equip_start)) waybillErrors.odometr_equip_end = `Поле "Одометр оборудования.Возврат" должно быть больше или равно "Одометр оборудования.Выезд"`

	if (waybill.plan_arrival_date && waybill.plan_departure_date) {
		if (moment(waybill.plan_arrival_date).toDate().getTime() < moment(waybill.plan_departure_date).toDate().getTime()) {
			waybillErrors.plan_arrival_date = `"Возвращение план." должно быть больше "Выезд план."`;
		}
	} else if (waybill.plan_arrival_date) {
		waybillErrors.plan_departure_date = `Дата "Выезд план." должна быть указана`;
	} else if (waybill.plan_departure_date) {
		waybillErrors.plan_arrival_date = `Дата "Возвращение план." должна быть указана`;
	} else {
		waybillErrors.plan_departure_date = `Даты "Выезд план." и "Возвращение план." должны быть указаны`;
	}

	if (waybill.status && waybill.status !== 'draft') {
		if (waybill.fact_arrival_date && waybill.fact_departure_date) {
			if (moment(waybill.fact_arrival_date).toDate().getTime() < moment(waybill.fact_departure_date).toDate().getTime()) {
				waybillErrors.fact_arrival_date = `"Возвращение факт." должно быть больше "Выезд факт."`;
			}
		} else if (waybill.fact_arrival_date) {
			waybillErrors.fact_departure_date = `Дата "Выезд факт." должна быть указана`;
		} else if (waybill.fact_departure_date) {
			waybillErrors.fact_arrival_date = `Дата "Возвращение факт." должна быть указана`;
		} else {
			waybillErrors.fact_departure_date = `Даты "Выезд факт." и "Возвращение факт." должны быть указаны`;
		}
	}

	if (parseFloat(waybill.fuel_end) < 0) waybillErrors.fuel_end = `Поле "Топливо.Возврат" должно быть неотрицательным`;

	return waybillErrors;
};

let validateClosingWaybill = (waybill, errors) => {
	let waybillErrors = _.clone(errors);

	_.each(waybillClosingSchema.properties, prop => {
		waybillErrors[prop.key] = validateRow(prop, waybill[prop.key]);
	});

	waybillErrors.plan_arrival_date = '';
	waybillErrors.plan_departure_date = '';
	waybillErrors.fact_arrival_date = '';
	waybillErrors.fact_departure_date = '';
	waybillErrors.fuel_end = '';

	if ((waybill.motohours_start && waybill.motohours_end) && (waybill.motohours_end < waybill.motohours_start)) waybillErrors.motohours_end = `Поле "Счетчик моточасов.Возврат" должно быть больше или равно "Счетчик моточасов.Выезд"`

	if ((waybill.motohours_equip_start && waybill.motohours_equip_end) && (waybill.motohours_equip_end < waybill.motohours_equip_start)) waybillErrors.motohours_equip_end = `Поле "Счетчик моточасов оборудования.Возврат" должно быть больше или равно "Счетчик моточасов оборудования.Выезд"`

	if ((waybill.odometr_start && waybill.odometr_end) && (waybill.odometr_end < waybill.odometr_start)) waybillErrors.odometr_end = `Поле "Одометр.Возврат" должно быть больше или равно "Одометр.Выезд"`

	if ((waybill.odometr_equip_start && waybill.odometr_equip_end) && (waybill.odometr_equip_end < waybill.odometr_equip_start)) waybillErrors.odometr_equip_end = `Поле "Одометр оборудования.Возврат" должно быть больше или равно "Одометр оборудования.Выезд"`


	if (waybill.plan_arrival_date && waybill.plan_departure_date) {
		if (moment(waybill.plan_arrival_date).toDate().getTime() < moment(waybill.plan_departure_date).toDate().getTime()) {
			waybillErrors.plan_arrival_date = `"Возвращение план." должно быть больше "Выезд план."`;
		}
	} else if (waybill.plan_arrival_date) {
		waybillErrors.plan_departure_date = `Дата "Выезд план." должна быть указана`;
	} else if (waybill.plan_departure_date) {
		waybillErrors.plan_arrival_date = `Дата "Возвращение план." должна быть указана`;
	} else {
		waybillErrors.plan_departure_date = `Даты "Выезд план." и "Возвращение план." должны быть указаны`;
	}

	if (waybill.fact_arrival_date && waybill.fact_departure_date) {
		if (moment(waybill.fact_arrival_date).toDate().getTime() < moment(waybill.fact_departure_date).toDate().getTime()) {
			waybillErrors.fact_arrival_date = `"Возвращение факт." должно быть больше "Выезд факт."`;
		}
	} else if (waybill.fact_arrival_date) {
		waybillErrors.fact_departure_date = `Дата "Выезд факт." должна быть указана`;
	} else if (waybill.fact_departure_date) {
		waybillErrors.fact_arrival_date = `Дата "Возвращение факт." должна быть указана`;
	} else {
		waybillErrors.fact_departure_date = `Даты "Выезд факт." и "Возвращение факт." должны быть указаны`;
	}

	if (parseFloat(waybill.fuel_end) < 0) waybillErrors.fuel_end = `Поле "Топливо.Возврат" должно быть неотрицательным`;

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
				if (!waybill.tax_data) {
					waybill.tax_data = [];
				}
				if (!waybill.equipment_tax_data) {
					waybill.equipment_tax_data = [];
				}
				if (waybill.mission_id_list.filter((v) => v).length === 0) {
					waybill.mission_id_list = [];
				}

				if (props.element.status === 'active' || props.element.status === 'closed') {

					if (isNotNull(waybill.odometr_end) && isNotNull(waybill.odometr_start)) {
						waybill.odometr_diff = parseFloat(waybill.odometr_end - waybill.odometr_start).toFixed(3);
					}
					if (isNotNull(waybill.motohours_end) && isNotNull(waybill.motohours_start)) {
						waybill.motohours_diff = parseFloat(waybill.motohours_end - waybill.motohours_start).toFixed(3);
					}
					if (isNotNull(waybill.motohours_equip_end) && isNotNull(waybill.motohours_equip_start)) {
						waybill.motohours_equip_diff = parseFloat(waybill.motohours_equip_end - waybill.motohours_equip_start).toFixed(3);
					}

					let fuelStart = waybill.fuel_start ? parseFloat(waybill.fuel_start) : 0;
					let fuelGiven = waybill.fuel_given ? parseFloat(waybill.fuel_given) : 0;
					let fuelTaxes = Taxes.calculateFinalResult(waybill.tax_data);
					let equipmentFuelStart = waybill.equipment_fuel_start ? parseFloat(waybill.equipment_fuel_start) : 0;
					let equipmentFuelGiven = waybill.equipment_fuel_given ? parseFloat(waybill.equipment_fuel_given) : 0;
					let equipmentFuelTaxes = Taxes.calculateFinalResult(waybill.equipment_tax_data);

					if (!!waybill.equipment_fuel) {
						waybill.fuel_end = (fuelStart + fuelGiven - fuelTaxes).toFixed(3);
						waybill.equipment_fuel_end = (equipmentFuelStart + equipmentFuelGiven - equipmentFuelTaxes).toFixed(3);
					} else {
						waybill.fuel_end = (fuelStart + fuelGiven - fuelTaxes - equipmentFuelTaxes).toFixed(3);
					}

					if (props.element.status === 'active') {
						this.setState({
							formState: waybill,
							formErrors: validateClosingWaybill(waybill, {}),
							canPrint: false,
							canSave: ! !!_.filter(validateClosingWaybill(waybill, {}), (v,k) => k === 'fuel_end' ? false : v).length,
							canClose: ! !!_.filter(validateClosingWaybill(waybill, {})).length,
						});
					} else {
						this.setState({
							formState: waybill,
							formErrors: {}
						});
					}

				} else if (props.element.status === 'draft') {

					this.setState({
						formState: waybill,
						canPrint: true,
						canSave: ! !!_.filter(validateWaybill(waybill, {})).length,
						canClose: ! !!_.filter(validateWaybill(waybill, {})).length,
						formErrors: validateWaybill(waybill, {})
					});

				}
			}
		}

	}

	handleFieldsChange(formState) {
		let { formErrors } = this.state;
		let newState = {};

		let fuelStart = formState.fuel_start ? parseFloat(formState.fuel_start) : 0;
		let fuelGiven = formState.fuel_given ? parseFloat(formState.fuel_given) : 0;
		let fuelTaxes = Taxes.calculateFinalResult(formState.tax_data);
		let equipmentFuelStart = formState.equipment_fuel_start ? parseFloat(formState.equipment_fuel_start) : 0;
		let equipmentFuelGiven = formState.equipment_fuel_given ? parseFloat(formState.equipment_fuel_given) : 0;
		let equipmentFuelTaxes = Taxes.calculateFinalResult(formState.equipment_tax_data);
		if (!!formState.equipment_fuel) {
			formState.fuel_end = (fuelStart + fuelGiven - fuelTaxes).toFixed(3);
			formState.equipment_fuel_end = (equipmentFuelStart + equipmentFuelGiven - equipmentFuelTaxes).toFixed(3);
		} else {
			formState.fuel_end = (fuelStart + fuelGiven - fuelTaxes - equipmentFuelTaxes).toFixed(3);
		}

		if (!!!formState.status || formState.status === 'draft') {
			formErrors = validateWaybill(formState, formErrors);
		} else if (formState.status && formState.status === 'active') {
			formErrors = validateClosingWaybill(formState, formErrors);
		}

		newState.canSave = ! !!_.filter(formErrors, (v,k) => k === 'fuel_end' ? false : v).length;
		newState.canClose = ! !!_.filter(formErrors).length;

		newState.formState = formState;
		newState.formErrors = formErrors;

		this.setState(newState);
	}


	handleFormStateChange(field, e) {
		const value = e !== undefined && !!e.target ? e.target.value : e;
		let formState = _.cloneDeep(this.state.formState);
		formState[field] = value;

		if (field === 'odometr_end' && formState.status) {
			formState.odometr_diff = value ? parseFloat(formState.odometr_end - formState.odometr_start).toFixed(3) : null;
		}
		if (field === 'motohours_end' && formState.status) {
			formState.motohours_diff = value ? parseFloat(formState.motohours_end - formState.motohours_start).toFixed(3) : null;
		}
		if (field === 'motohours_equip_end' && formState.status) {
			formState.motohours_equip_diff = value ? parseFloat(formState.motohours_equip_end - formState.motohours_equip_start).toFixed(3) : null;
		}

		if (formState.tax_data && formState.tax_data.length) {
			if (field === 'odometr_end') {
				_.last(formState.tax_data).FACT_VALUE = formState.odometr_diff > 0 ? formState.odometr_diff : null;
			}

			if (field === 'motohours_end') {
				_.last(formState.tax_data).FACT_VALUE = formState.motohours_diff > 0 ? formState.motohours_diff : null;
			}

			if (field === 'motohours_equip_end' && formState.equipment_tax_data && formState.equipment_tax_data.length) {
				_.last(formState.equipment_tax_data).FACT_VALUE = formState.motohours_equip_diff > 0 ? formState.motohours_equip_diff : null;
			}
		}

		this.handleFieldsChange(formState);
	}

	handleMultipleChange(fields) {
		let { formErrors } = this.state;
		let formState = _.cloneDeep(this.state.formState);
		let newState = {};
		_.mapKeys(fields, (v, field) => {
			formState[field] = v;
			if (field === 'odometr_end' && formState.status) {
				formState.odometr_diff = parseFloat(formState.odometr_end - formState.odometr_start).toFixed(3);
			}
			if (field === 'motohours_end' && formState.status) {
				formState.motohours_diff = parseFloat(formState.motohours_end - formState.motohours_start).toFixed(3);
			}
			if (field === 'motohours_equip_end' && formState.status) {
				formState.motohours_equip_diff = parseFloat(formState.motohours_equip_end - formState.motohours_equip_start).toFixed(3);
			}
		});

		this.handleFieldsChange(formState);
	}

	/**
	 * Выдача (печать) Путевого листа
	 * @param {object} event
	 * @param {number 1|2} print_form_type - Идентификатор печатной формы
	 * @returns {undefined}
	 */
  handlePrint(event, print_form_type = 1) {
		const { formState } = this.state;
		const token = JSON.parse(window.localStorage.getItem('ets-session'));

  	let URL = `${config.backend}/${print_form_type === 2 ? 'plate_truck/' : 'plate_special/'}?waybill_id=`;
		let currentWaybillId = formState.id;

		let callback = (createdWaybillId) => {
			console.log('printing waybill', URL);
			URL += createdWaybillId ?  createdWaybillId : currentWaybillId;
			URL += `&token=${token}`;
			window.location = URL;
		};
		this.handleFormSubmit(this.state.formState, callback);
  }

	/**
	 * Отправка формы ПЛ
	 * @param {object} state - содержимое формы
	 * @param {function} callback - функция, вызываемая после отправки
	 * @returns {undefined}
	 */
	async handleFormSubmit(state = this.state.formState, callback) {
		let formState = _.cloneDeep(state);
		let waybillStatus = formState.status;
		const { flux, setLoading } = this.context;

		if (!!!waybillStatus) { // если создаем ПЛ
			if (typeof callback === 'function') {
				formState.status = 'draft';
				let r = await flux.getActions('waybills').createWaybill(formState);
				// TODO сейчас возвращается один ПЛ
				const id = _.max(r.result, res => res.id).id;
				formState.status = 'active';
				formState.id = id;
				try {
					await flux.getActions('waybills').updateWaybill(formState);
				} catch (e) {
					console.log(e);
					return;
				}
				callback(id);
			} else {
				formState.status = 'draft';
				try {
					await flux.getActions('waybills').createWaybill(formState);
				} catch (e) {
					console.log(e);
					return;
				}
			}
			await flux.getActions('waybills').getWaybills();
			this.props.onFormHide();
		} else if (waybillStatus === 'draft') { // если ПЛ обновляем
			if (typeof callback === 'function') {
				formState.status = 'active';
				try {
					await flux.getActions('waybills').updateWaybill(formState);
				} catch (e) {
					return;
				}
				callback();
				flux.getActions('waybills').getWaybills();
				this.props.onFormHide();
			} else {
				try {
					await flux.getActions('waybills').updateWaybill(formState);
				} catch (e) {
					return;
				}
				flux.getActions('waybills').getWaybills();
				this.props.onFormHide();
			}
		} else if (waybillStatus === 'active') {
			try {
				await flux.getActions('waybills').updateWaybill(formState);
			} catch (e) {
				console.log(e);
				return;
			}
			flux.getActions('waybills').getWaybills();
			this.props.onFormHide();
		}

		return;
	}

	async handleClose(taxesControl) {
		let { formState } = this.state;
		let prevStatus = formState.status;
		if (!taxesControl) {
			global.NOTIFICATION_SYSTEM._addNotification(getWarningNotification('Необходимо заполнить нормы для расчета топлива!'));
			return;
		}
		confirmDialog({
			title: 'Внимание: После закрытия путевого листа редактирование полей будет запрещено.',
			body: 'Вы уверены, что хотите закрыть окно?'
		})
		.then( async () => {
			try {
				formState.status = 'closed';
				await this.context.flux.getActions('waybills').updateWaybill(formState);
			} catch (e) {
				console.log(e);
				formState.status = prevStatus;
				await this.context.flux.getActions('waybills').updateWaybill(formState);
				this.context.flux.getActions('waybills').getWaybills();
				return;
			}
			this.context.flux.getActions('waybills').getWaybills();
			this.props.onFormHide();
		})
		.catch(() => {});
	}

	render() {

		return 	<Div hidden={!this.props.showForm}>
							<WaybillForm formState = {this.state.formState}
													 onSubmit={this.handleFormSubmit.bind(this)}
													 handlePrint={this.handlePrint.bind(this)}
													 handleClose={this.handleClose.bind(this)}
													 handleFormChange={this.handleFormStateChange.bind(this)}
													 handleMultipleChange={this.handleMultipleChange.bind(this)}
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
