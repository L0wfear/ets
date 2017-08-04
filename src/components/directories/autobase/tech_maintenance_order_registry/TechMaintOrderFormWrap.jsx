import React from 'react';

import FormWrap from 'components/compositions/FormWrap';
import enhanceWithPermissions from 'components/util/RequirePermissions';
import TechMaintOrderForm from './TechMaintOrderForm';
import { formValidationSchema } from './schema';

class TechMaintOrderFormWrap extends FormWrap {

  constructor(props, context) {
    super(props);

    this.schema = formValidationSchema;
    this.preventDefaultNotification = true;
    this.createAction = context.flux.getActions('autobase').techMaintOrder.bind(null, 'post');
    this.updateAction = context.flux.getActions('autobase').techMaintOrder.bind(null, 'put');
  }

  render() {
    const { entity } = this.props;
    const { saveButtonEnability = true } = this.state;
    const canSave = this.props.isPermitted && this.state.canSave && saveButtonEnability;

    return this.props.showForm ?
      <TechMaintOrderForm
        formState={this.state.formState}
        formErrors={this.state.formErrors}
        permissions={[`${entity}.update`]}
        addPermissionProp
        canSave={canSave}
        isPermitted={this.props.isPermitted}
        onSubmit={this.handleFormSubmit}
        handleFormChange={this.handleFormStateChange}
        show={this.props.showForm}
        onHide={this.props.onFormHide}
      />
      : null;
  }

}

export default enhanceWithPermissions(TechMaintOrderFormWrap);
