import React, { Component } from 'react';
import FuelRateForm from './FuelRateForm.jsx';
import FormWrap from 'compositions/FormWrap.jsx';
import { fuelRateSchema, defaultElement } from './fuelRateSchema.js';

export default class FuelRateFormWrap extends FormWrap {

	constructor(props, context) {
		super(props);

		this.defaultElement = defaultElement;
		this.schema = fuelRateSchema;
		this.createAction = context.flux.getActions('fuelRates').createFuelRate;
		this.updateAction = context.flux.getActions('fuelRates').updateFuelRate;
	}

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
