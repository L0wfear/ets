import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';

import FuelRateForm from './FuelRateForm.jsx';
import FormWrap from '../compositions/FormWrap.jsx';

export default class FuelRateFormWrap extends FormWrap {

	constructor(props, context) {
		super(props);

		this.defaultElement = {
			order_date: new Date('1990', '00', '01'),
			operation_id: null,
			//summer_rate: '',
			//winter_rate: '',
			car_model_id: null,
			special_model_id: null
		};
		this.createAction = context.flux.getActions('fuel-rates').createFuelRate;
		this.updateAction = context.flux.getActions('fuel-rates').updateFuelRate;
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
