import React from 'react';

import FormWrap from 'components/compositions/FormWrap';
import enhanceWithPermissions from 'components/util/RequirePermissions';
import BatteryForm from 'components/directories/autobase/battery_registry/BatteryRegForm';
import { schema } from 'models/BatteryRegModel';

class BatteryRegFormWrap extends FormWrap {
  constructor(props, context) {
    super(props);

    this.schema = schema;
    this.preventDefaultNotification = true;

    this.updateAction = context.flux.getActions('autobase').batteryRegistry.bind(null, 'put');
    this.createAction = context.flux.getActions('autobase').batteryRegistry.bind(null, 'post');
  }

  render() {
    const { entity, isPermitted = false } = this.props;
    const { saveButtonEnability = true } = this.state;
    const canSave = isPermitted && this.state.canSave && saveButtonEnability;

    return this.props.showForm
      ? (
        <BatteryForm
          formState={this.state.formState}
          formErrors={this.state.formErrors}
          permissions={[`${entity}.update`]}
          addPermissionProp
          isPermitted={isPermitted}
          canSave={canSave}
          onSubmit={this.handleFormSubmit.bind(this)}
          handleFormChange={this.handleFormStateChange.bind(this)}
          show={this.props.showForm}
          onHide={this.props.onFormHide}
        />
      )
      : null;
  }
}

export default enhanceWithPermissions(BatteryRegFormWrap);
