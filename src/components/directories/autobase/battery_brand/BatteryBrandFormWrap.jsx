import React from 'react';

import FormWrap from 'components/compositions/FormWrap.jsx';
import enhanceWithPermissions from 'components/util/RequirePermissions';
import BaseBatteryBrandForm from './BatteryBrandForm';

export const batteryBrandSchema = {
  properties: [
    {
      key: 'name',
      title: 'Марка аккумулятора',
      type: 'string',
      required: true,
    },
    {
      key: 'manufacturer_id',
      title: 'Производитель аккумулятора',
      type: 'number',
      required: true,
    },
  ],
};

const BatteryBrandForm = enhanceWithPermissions(BaseBatteryBrandForm);

export default class BatteryBrandFormWrap extends FormWrap {

  constructor(props, context) {
    super(props);

    this.schema = batteryBrandSchema;
    this.preventDefaultNotification = true;
    this.createAction = context.flux.getActions('autobase').batteryBrand.bind(null, 'post');
    this.updateAction = context.flux.getActions('autobase').batteryBrand.bind(null, 'put');
  }

  render() {
    return this.props.showForm ?
      <BatteryBrandForm
        formState={this.state.formState}
        formErrors={this.state.formErrors}
        permissions={['battery_brand.update']}
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
