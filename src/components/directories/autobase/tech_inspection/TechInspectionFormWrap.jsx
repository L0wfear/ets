import React from 'react';
import enhanceWithPermissions from 'components/util/RequirePermissions';
import BaseTechInspectionForm from './TechInspectionForm.jsx';
import FormWrap from 'components/compositions/FormWrap.jsx';
import { schema } from 'models/TechInspectionModel.js';

const TechInspectionForm = enhanceWithPermissions(BaseTechInspectionForm);

export default class SparePartFormWrap extends FormWrap {

  constructor(props, context) {
    super(props);

    this.schema = schema;
    this.preventDefaultNotification = true;

    this.createAction = context.flux.getActions('autobase').techInspection.bind(null, 'post');
    this.updateAction = context.flux.getActions('autobase').techInspection.bind(null, 'put');
  }

  render() {
    const { entity } = this.props;
    return this.props.showForm ?
      <TechInspectionForm
        formState={this.state.formState}
        formErrors={this.state.formErrors}
        cols={this.props.meta.cols}
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
