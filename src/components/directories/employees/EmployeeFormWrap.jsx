import React from 'react';
import * as queryString from 'query-string';

import enhanceWithPermissions from 'components/util/RequirePermissions.jsx';
import { schema as employeeSchema, defaultElement } from 'models/Employee.js';
import BaseEmployeeForm from './EmployeeForm.jsx';
import FormWrap from '../../compositions/FormWrap.jsx';


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
    const {
      location: {
        search,
      },
    } = this.props;

    const searchObject = queryString.parse(search);

    if (Object.keys(searchObject).length > 0) {
      this.props.history.push(this.props.match.url);
    }
    this.props.onFormHide();
  }
  render() {
    return this.props.showForm ?
      <EmployeeForm
        formState={this.state.formState}
        formErrors={this.state.formErrors}
        permissions={['employee.update']}
        addPermissionProp
        canSave={this.state.canSave}
        onSubmit={this.handleFormSubmit.bind(this)}
        handleFormChange={this.handleFormStateChange.bind(this)}
        show={this.props.showForm}
        onHide={this.handleFormHide}
        location={this.props.location}
        history={this.props.history}
      />
      : null;
  }

}
