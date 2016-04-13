import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import FormWrap from 'compositions/FormWrap.jsx';
import FuelRateForm from './FuelOperationForm.jsx';

export default class FuelOperationFormWrap extends FormWrap {

	constructor(props, context) {
		super(props);

		this.uniqueField = 'ID';
		this.createAction = context.flux.getActions('fuel-rates').createFuelOperation;
		this.updateAction = context.flux.getActions('fuel-rates').updateFuelOperation;
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
