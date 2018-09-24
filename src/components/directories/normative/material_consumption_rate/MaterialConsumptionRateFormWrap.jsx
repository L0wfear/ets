import React from 'react';
import { schema } from 'models/MaterialConsumptionRate.js';
import enhanceWithPermissions from 'components/util/RequirePermissions.jsx';

import FormWrap from 'components/compositions/FormWrap.jsx';
import BaseMaterialConsumptionRateForm from 'components/directories/normative/material_consumption_rate/MaterialConsumptionRateForm.jsx';

const MaterialConsumptionRateForm = enhanceWithPermissions(BaseMaterialConsumptionRateForm);

export default class MaterialConsumptionRateFormWrap extends FormWrap {
  constructor(props, context) {
    super(props);

    this.defaultElement = null;
    this.schema = schema;
    this.createAction = context.flux.getActions('objects').createMaterialConsumptionRate;
    this.updateAction = context.flux.getActions('objects').updateMaterialConsumptionRate;
  }

  render() {
    return this.props.showForm
      ? (
        <MaterialConsumptionRateForm
          formState={this.state.formState}
          formErrors={this.state.formErrors}
          permissions={['material_consumption_rate.update']}
          addPermissionProp
          canSave={this.state.canSave}
          onSubmit={this.handleFormSubmit.bind(this)}
          handleFormChange={this.handleFormStateChange.bind(this)}
          show={this.props.showForm}
          onHide={this.props.onFormHide}
        />
      )
      : null;
  }
}
