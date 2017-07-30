import React from 'react';

import FormWrap from 'components/compositions/FormWrap.jsx';
import enhanceWithPermissions from 'components/util/RequirePermissions.jsx';
import BaseRepairForm from './RepairForm';
import { formValidationSchema } from './schema';

const RepairForm = enhanceWithPermissions(BaseRepairForm);

export default class RepairFormWrap extends FormWrap {

  constructor(props, context) {
    super(props);

    this.schema = formValidationSchema;
    this.preventDefaultNotification = true;

    this.createAction = context.flux.getActions('autobase').repair.bind(null, 'post');
    this.updateAction = context.flux.getActions('autobase').repair.bind(null, 'put');
  }

  render() {
    const { entity, car_id = -1 } = this.props;
    return this.props.showForm ?
      <RepairForm
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
