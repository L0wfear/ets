import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import CarForm from './CarForm.jsx';
import FormWrap from 'compositions/FormWrap.jsx';

export default class CarFormWrap extends FormWrap {

	constructor(props) {
		super(props);

	}

	handleFormSubmit(formState) {
		const { flux } = this.context;
		try {
			flux.getActions('car').updateCarAdditionalInfo(formState);
		} catch (e) {
			return;
		}
		this.props.onFormHide();
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
