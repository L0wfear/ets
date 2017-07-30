import React from 'react';
import enhanceWithPermissions from 'components/util/RequirePermissions';
import BaseSparePartForm from './SparePartForm.jsx';
import FormWrap from 'components/compositions/FormWrap.jsx';
import { formValidationSchema } from './schema';

const SparePartForm = enhanceWithPermissions(BaseSparePartForm);

export default class SparePartFormWrap extends FormWrap {

  constructor(props, context) {
    super(props);
    this.schema = formValidationSchema;
    this.preventDefaultNotification = true;

    this.createAction = context.flux.getActions('autobase').sparePart.bind(null, 'post');
    this.updateAction = context.flux.getActions('autobase').sparePart.bind(null, 'put');
  }

  render() {
    const { entity } = this.props;
    return this.props.showForm ?
      <SparePartForm
        formState={this.state.formState}
        formErrors={this.state.formErrors}
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
