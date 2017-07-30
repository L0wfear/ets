import React from 'react';

import FormWrap from 'components/compositions/FormWrap.jsx';
import enhanceWithPermissions from 'components/util/RequirePermissions.jsx';
import BaseInsurancePolicyForm from './InsurancePolicyForm';
import { formValidationSchema } from './schema';

const InsurancePolicyForm = enhanceWithPermissions(BaseInsurancePolicyForm);

export default class InsurancePolicyFormWrap extends FormWrap {

  constructor(props, context) {
    super(props);
    this.schema = formValidationSchema;
    this.preventDefaultNotification = true;

    this.createAction = context.flux.getActions('autobase').insurancePolicy.bind(null, 'post');
    this.updateAction = context.flux.getActions('autobase').insurancePolicy.bind(null, 'put');
  }

  render() {
    const { entity, car_id = -1 } = this.props;
    return this.props.showForm ?
      <InsurancePolicyForm
        formState={this.state.formState}
        formErrors={this.state.formErrors}
        cols={this.props.meta.cols}
        car_id={car_id}
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
