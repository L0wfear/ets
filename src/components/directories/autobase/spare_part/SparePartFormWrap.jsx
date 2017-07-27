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

    this.createAction = context.flux.getActions('autobase').changeDataInDB.bind(null, 'sparePart', 'post');
    this.updateAction = context.flux.getActions('autobase').changeDataInDB.bind(null, 'sparePart', 'put');
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
