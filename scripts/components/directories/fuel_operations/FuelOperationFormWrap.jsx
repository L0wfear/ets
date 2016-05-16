import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import FormWrap from 'compositions/FormWrap.jsx';
import FuelRateForm from './FuelOperationForm.jsx';

export default class FuelOperationFormWrap extends FormWrap {

	constructor(props, context) {
		super(props);

		this.uniqueField = 'id';
		this.createAction = context.flux.getActions('fuel-rates').createFuelOperation;
		this.updateAction = context.flux.getActions('fuel-rates').updateFuelOperation;
	}

	componentWillReceiveProps(props) {
		if (!props.element) this.setState({
			canSave: false,
			formErrors: {name: `Поле "Операция" должно быть заполнено`}
		})
	}

	handleFormStateChange(field, e) {
		const value = e !== undefined && e !== null && !!e.target ? e.target.value : e;
		console.info('Form changed', field, value);
		let { formState, formErrors } = this.state;
		let newState = {};
		formState[field] = value;

		formErrors = formState.name ? {} : {name: `Поле "Операция" должно быть заполнено`};
		newState.canSave = _(formErrors).map(v => !!v).filter(e => e === true).value().length === 0;

		newState.formState = formState;
		newState.formErrors = formErrors;


		this.setState(newState);
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
