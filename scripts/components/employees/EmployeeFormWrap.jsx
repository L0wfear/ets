import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import { isEmpty } from 'utils/functions';
import EmployeeForm from './EmployeeForm.jsx';
import FormWrap from '../compositions/FormWrap.jsx';

class EmployeeFormWrap extends FormWrap {

	constructor(props, context) {
		super(props);

		this.defaultElement = {
			active: 1,
		};
		this.createAction = context.flux.getActions('employees').createEmployee;
		this.updateAction = context.flux.getActions('employees').updateEmployee;
	}

	render() {

		let props = this.props;

		return props.showForm ?
    <EmployeeForm formState = {this.state.formState}
								onSubmit={this.handleFormSubmit.bind(this)}
								handleFormChange={this.handleFormStateChange.bind(this)}
								show={this.props.showForm}
								onHide={this.props.onFormHide}
								{...this.state}/>
								: null;

	}

}

export default EmployeeFormWrap;
