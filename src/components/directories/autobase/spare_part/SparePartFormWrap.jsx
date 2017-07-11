import React from 'react';
import enhanceWithPermissions from 'components/util/RequirePermissions';
import BaseSparePartForm from './SparePartForm.jsx';
import FormWrap from 'components/compositions/FormWrap.jsx';
import { schema } from 'models/SparePartModel.js';

const SparePartForm = enhanceWithPermissions(BaseSparePartForm);

export default class SparePartFormWrap extends FormWrap {

  constructor(props, context) {
    super(props);

    this.schema = schema;
    this.preventDefaultNotification = true;
  }

  render() {
    return this.props.showForm ?
      <SparePartForm
        formState={this.state.formState}
        formErrors={this.state.formErrors}
        permissions={['spare_part.update']}
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
