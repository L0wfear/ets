import React, { Component } from 'react';
import EmployeeForm from './EmployeeForm.jsx';
import FormWrap from '../../compositions/FormWrap.jsx';
import { validateRow } from 'validate/validateRow.js';

class EmployeeFormWrap extends FormWrap {

	constructor(props, context) {
		super(props);

		this.defaultElement = {
			active: 1,
		};
		this.createAction = context.flux.getActions('employees').createEmployee;
		this.updateAction = context.flux.getActions('employees').updateEmployee;
		this.schema = {
		  properties: [
				{
					key: 'last_name',
		      title: 'Фамилия',
					type: 'string',
					required: true,
				},
				{
					key: 'first_name',
		      title: 'Имя',
					type: 'string',
					required: true,
				},
				{
					key: 'position_id',
		      title: 'Должность',
					type: 'number',
					required: true,
				},
				{
					key: 'special_license',
		      title: 'Специальное удостоверение',
					type: 'string',
					required: true,
				},
				{
					key: 'drivers_license',
		      title: 'Водительское удостоверение',
					type: 'string',
					required: true,
				},
			],
		};
	}

	validate(formState, errors) {
		if (typeof this.schema === 'undefined') return errors;
		let formErrors = _.clone(errors);
		let schema = _.cloneDeep(this.schema);
		if (formState.position_id !== 15 && formState.position_id !== 24) {
			schema.properties.splice(-2);
			delete formErrors["special_license"]
			delete formErrors["drivers_license"]
		};
		_.each(schema.properties, prop => {
			formErrors[prop.key] = validateRow(prop, formState[prop.key]);
		});
		if (formState["special_license"]) delete formErrors["drivers_license"]
		if (formState["drivers_license"]) delete formErrors["special_license"]

		return formErrors;
	}

	render() {

		let props = this.props;

		return props.showForm ?
	    <EmployeeForm
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

export default EmployeeFormWrap;
