import React from 'react';

import FormWrap from 'components/compositions/FormWrap.jsx';
import enhanceWithPermissions from 'components/util/RequirePermissions.jsx';
import { schema } from 'models/BatteryRegModel.js';
import BaseBatteryForm from './BatteryRegForm.jsx';


const BatteryForm = enhanceWithPermissions(BaseBatteryForm);
//const BatteryForm = BaseBatteryForm;

export default class EmployeeFormWrap extends FormWrap {

  constructor(props, context) {
    super(props);
    this.schema = schema;
    this.uniqueField = 'battery__id';
    this.updateAction = context.flux.getActions('autobase').updateBattareReg;
    this.createAction = context.flux.getActions('autobase').createBatteryReg;
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
