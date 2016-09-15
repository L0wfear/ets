import React, { Component } from 'react';
import EmployeeForm from './EmployeeForm.jsx';
import FormWrap from '../../compositions/FormWrap.jsx';
import { schema as employeeSchema, defaultElement } from 'models/Employee.js';

export default class EmployeeFormWrap extends FormWrap {

  constructor(props, context) {
    super(props);

    this.defaultElement = defaultElement;
    this.schema = employeeSchema;
    this.createAction = context.flux.getActions('employees').createEmployee;
    this.updateAction = context.flux.getActions('employees').updateEmployee;
  }

  render() {
    return this.props.showForm ?
      <EmployeeForm
        formState={this.state.formState}
        formErrors={this.state.formErrors}
        canSave={this.state.canSave}
        onSubmit={this.handleFormSubmit.bind(this)}
        handleFormChange={this.handleFormStateChange.bind(this)}
        show={this.props.showForm}
        onHide={this.props.onFormHide}
      />
      : null;
  }

}
