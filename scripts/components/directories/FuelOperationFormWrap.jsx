import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import FormWrap from 'compositions/FormWrap.jsx';
import FuelRateForm from './FuelOperationForm.jsx';

export default class FuelOperationFormWrap extends FormWrap {

	constructor(props) {
		super(props);
	}

	handleFormSubmit(formState) {
	  const { flux } = this.context;
    if (!formState.ID) {
			try {
		    flux.getActions('fuel-rates').addFuelOperation(formState);
			} catch (e) {
				return;
			}
  	} else {
			try {
	    	flux.getActions('fuel-rates').updateFuelOperation(formState);
			} catch (e) {
				return;
			}
    }
    this.props.onFormHide();
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
