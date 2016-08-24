import React, { Component } from 'react';
import ODHSupportStandardForm from './ODHSupportStandardForm.jsx';
import FormWrap from '../../compositions/FormWrap.jsx';
import { schema as odhSupportStandardSchema, defaultElement } from 'models/ODHSupportStandard.js';

export default class ODHSupportStandardFormWrap extends FormWrap {

	constructor(props, context) {
		super(props);

		this.defaultElement = defaultElement;
		this.schema = odhSupportStandardSchema;
		this.createAction = context.flux.getActions('odh').createODHSupportStandard;
		this.updateAction = context.flux.getActions('odh').updateODHSupportStandard;
	}

	render() {

		return this.props.showForm ?
	    <ODHSupportStandardForm
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
