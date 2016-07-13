import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import CarForm from './CarForm.jsx';
import FormWrap from 'compositions/FormWrap.jsx';

export default class CarFormWrap extends FormWrap {

	constructor(props, context) {
		super(props);

		this.uniqueField = 'asuods_id';
		this.updateAction = context.flux.getActions('car').updateCarAdditionalInfo;
	}

	render() {

		let props = this.props;

		return props.showForm ?
    <CarForm formState = {this.state.formState}
							onSubmit={this.handleFormSubmit.bind(this)}
							handleFormChange={this.handleFormStateChange.bind(this)}
							show={this.props.showForm}
							onHide={this.props.onFormHide}
							{...this.state}/>
							: null;

	}

}
