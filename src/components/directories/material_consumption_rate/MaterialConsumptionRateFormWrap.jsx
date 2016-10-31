import React from 'react';
import BaseMaterialConsumptionRateForm from './MaterialConsumptionRateForm.jsx';
import FormWrap from '../../compositions/FormWrap.jsx';
import { schema as materialConsumptionRateSchema, defaultElement } from 'models/MaterialConsumptionRate.js';
import enhanceWithPermissions from 'components/util/RequirePermissions.jsx';


const MaterialConsumptionRateForm = enhanceWithPermissions(BaseMaterialConsumptionRateForm);

export default class MaterialConsumptionRateFormWrap extends FormWrap {

  constructor(props, context) {
    super(props);

    this.defaultElement = defaultElement;
    this.schema = materialConsumptionRateSchema;
    this.createAction = context.flux.getActions('objects').createMaterialConsumptionRate;
    this.updateAction = context.flux.getActions('objects').updateMaterialConsumptionRate;
  }

  render() {
    return this.props.showForm ?
      <MaterialConsumptionRateForm
        formState={this.state.formState}
        formErrors={this.state.formErrors}
        permissions={['material_consumtion_rate.update']}
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
