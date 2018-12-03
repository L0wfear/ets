import React from 'react';
import * as queryString from 'query-string';

import enhanceWithPermissions from 'components/util/RequirePermissions';
import { schema as employeeSchema, defaultElement } from 'models/Employee';
import BaseEmployeeForm from 'components/directories/employees/EmployeeForm';
import FormWrap from 'components/compositions/FormWrap';

const EmployeeForm = enhanceWithPermissions(BaseEmployeeForm);

export default class EmployeeFormWrap extends FormWrap {
  constructor(props, context) {
    super(props);

    this.defaultElement = defaultElement;
    this.schema = employeeSchema;
    this.createAction = context.flux.getActions('employees').createEmployee;
    this.updateAction = context.flux.getActions('employees').updateEmployee;
  }

  handleFormHide = () => {
    const { location: { search } } = this.props;

    const searchObject = queryString.parse(search);

    if (Object.keys(searchObject).length > 0) {
      this.props.history.push(this.props.match.url);
    }
    this.props.onFormHide();
  }

  handleFormSubmitWrap = () => {
    this.handleFormSubmit().then(() => {
      const { location: { search } } = this.props;

      const searchObject = queryString.parse(search);

      if (Object.keys(searchObject).length > 0) {
        this.props.history.push(this.props.match.url);
      }
    });
  }

  render() {
    return this.props.showForm
      ? (
        <EmployeeForm
          formState={this.state.formState}
          formErrors={this.state.formErrors}
          permissions={['employee.update']}
          addPermissionProp
          canSave={this.state.canSave}
          onSubmit={this.handleFormSubmitWrap}
          handleFormChange={this.handleFormStateChange}
          show={this.props.showForm}
          onHide={this.handleFormHide}
        />
      )
      : null;
  }
}
