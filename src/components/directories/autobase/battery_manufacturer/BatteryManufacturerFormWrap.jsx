import React from 'react';

import FormWrap from 'components/compositions/FormWrap';
import enhanceWithPermissions from 'components/util/RequirePermissions';
import BatteryManufacturerForm from './BatteryManufacturerForm';
import { formValidationSchema } from './schema';

class BatteryManufacturerFormWrap extends FormWrap {

  constructor(props, context) {
    super(props);

    this.schema = formValidationSchema;
    this.preventDefaultNotification = true;
    this.createAction = context.flux.getActions('autobase').batteryManufacturer.bind(null, 'post');
    this.updateAction = context.flux.getActions('autobase').batteryManufacturer.bind(null, 'put');
  }

  render() {
    const { entity, isPermitted = false } = this.props;
    const { saveButtonEnability = true } = this.state;
    const canSave = isPermitted && this.state.canSave && saveButtonEnability;

    return this.props.showForm ?
      <BatteryManufacturerForm
        formState={this.state.formState}
        formErrors={this.state.formErrors}
        permissions={[`${entity}.update`]}
        isPermitted={isPermitted}
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

export default enhanceWithPermissions(BatteryManufacturerFormWrap);
