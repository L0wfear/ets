import React from 'react';

import FormWrap from 'components/compositions/FormWrap.jsx';
import enhanceWithPermissions from 'components/util/RequirePermissions.jsx';
import BaseBatteryForm from './BatteryRegForm.jsx';
import { schema } from 'models/BatteryRegModel.js';

const BatteryForm = enhanceWithPermissions(BaseBatteryForm);

export default class EmployeeFormWrap extends FormWrap {

  constructor(props, context) {
    super(props);
    this.schema = schema;
    this.preventDefaultNotification = true;

    this.updateAction = context.flux.getActions('autobase').battery.bind(null, 'put');
    this.createAction = context.flux.getActions('autobase').battery.bind(null, 'post');
    this.removeElementAction = context.flux.getActions('autobase').removeBattery;
  }

  render() {
    const { entity } = this.props;
    return this.props.showForm ?
      <BatteryForm
        formState={this.state.formState}
        formErrors={this.state.formErrors}
        cols={this.props.meta.cols}
        permissions={[`${entity}.update`]}
        addPermissionProp
        canSave={this.state.canSave}
        onSubmit={this.handleFormSubmit.bind(this)}
        handleFormChange={this.handleFormStateChange.bind(this)}
        show={this.props.showForm}
        onHide={this.props.onFormHide}
      />
      : null;
  }
}
