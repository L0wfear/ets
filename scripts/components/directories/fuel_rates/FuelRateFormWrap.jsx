import React, { Component } from 'react';
import FuelRateForm from './FuelRateForm.jsx';
import FormWrap from 'compositions/FormWrap.jsx';
import fuelRateSchema from './fuelRateSchema.js';
import { isEmpty } from 'utils/functions';
import { validateRow } from 'validate/validateRow.js';

export default class FuelRateFormWrap extends FormWrap {

	constructor(props, context) {
		super(props);

		this.defaultElement = {
			order_date: new Date(),
			operation_id: null,
			//summer_rate: '',
			//winter_rate: '',
			car_model_id: null,
			car_special_model_id: null
		};
		this.schema = fuelRateSchema;
		this.createAction = context.flux.getActions('fuelRates').createFuelRate;
		this.updateAction = context.flux.getActions('fuelRates').updateFuelRate;
	}

	validate = (formState, formErrors) => {
		let errors = _.clone(formErrors);

		_.each(this.schema.properties, prop => {
			errors[prop.key] = validateRow(prop, formState[prop.key]);
		});

		if (isEmpty(formState.summer_rate) && isEmpty(formState.winter_rate)) {
			errors.summer_rate = `Одна из норм должна быть заполнена`;
			errors.winter_rate = `Одна из норм должна быть заполнена`;
		}

		return errors;
	};

	render() {

		let props = this.props;

		return props.showForm ?
    <FuelRateForm formState = {this.state.formState}
									onSubmit={this.handleFormSubmit.bind(this)}
									handleFormChange={this.handleFormStateChange.bind(this)}
									show={this.props.showForm}
									onHide={this.props.onFormHide}
									{...this.state}/>
									: null;

	}

}
