import React, { Component } from 'react';
import ODHSupportStandardDataSummerForm from './ODHSupportStandardDataSummerForm.jsx';
import FormWrap from '../../compositions/FormWrap.jsx';
import { schema as odhSupportStandardDataSummerSchema, defaultElement } from 'models/ODHSupportStandardDataSummer.js';

export default class ODHSupportStandardDataSummerFormWrap extends FormWrap {

	constructor(props, context) {
		super(props);

		this.defaultElement = defaultElement;
		this.schema = odhSupportStandardDataSummerSchema;
		this.createAction = context.flux.getActions('odh').createODHSupportStandardDataSummer;
		this.updateAction = context.flux.getActions('odh').updateODHSupportStandardDataSummer;
	}

	render() {

		return this.props.showForm ?
	    <ODHSupportStandardDataSummerForm
					formState={this.state.formState}
					formErrors={this.state.formErrors}
					canSave={this.state.canSave}
					onSubmit={this.handleFormSubmit.bind(this)}
					handleFormChange={this.handleFormStateChange.bind(this)}
					show={this.props.showForm}
					onHide={this.props.onFormHide}/>
								: null;

	}

}
