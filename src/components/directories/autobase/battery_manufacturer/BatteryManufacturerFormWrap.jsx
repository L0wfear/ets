import React from 'react';

import FormWrap from 'components/compositions/FormWrap';
import enhanceWithPermissions from 'components/util/RequirePermissions';
import BaseBatteryManufacturerForm from './BatteryManufacturerForm';

export const batteryManufacturerSchema = {
  properties: [
    {
      key: 'name',
      title: 'Производитель аккумулятора',
      type: 'string',
      required: true,
    },
  ],
};

const BatteryManufacturerForm = enhanceWithPermissions(BaseBatteryManufacturerForm);

export default class BatteryManufacturerFormWrap extends FormWrap {

  constructor(props, context) {
    super(props);

    this.schema = batteryManufacturerSchema;
    this.preventDefaultNotification = true;
    this.createAction = context.flux.getActions('autobase').batteryManufacturer.bind(null, 'post');
    this.updateAction = context.flux.getActions('autobase').batteryManufacturer.bind(null, 'put');
  }

  render() {
    const { entity } = this.props;
    const { saveButtonEnability = true } = this.state;
    const canSave = this.props.isPermitted && this.state.canSave && saveButtonEnability;

    return this.props.showForm ?
      <BatteryManufacturerForm
        formState={this.state.formState}
        formErrors={this.state.formErrors}
        permissions={[`${entity}.update`]}
        addPermissionProp
        canSave={canSave}
        onSubmit={this.handleFormSubmit.bind(this)}
        handleFormChange={this.handleFormStateChange.bind(this)}
        show={this.props.showForm}
        onHide={this.props.onFormHide}
      />
      : null;
  }

}
