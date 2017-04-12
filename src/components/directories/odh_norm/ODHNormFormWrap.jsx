import React, { Component } from 'react';
import BaseODHNormForm from './ODHNormForm.jsx';
import FormWrap from '../../compositions/FormWrap.jsx';
import { schema } from 'models/ODHNorm.js';
import enhanceWithPermissions from 'components/util/RequirePermissions.jsx';


const ODHNormForm = enhanceWithPermissions(BaseODHNormForm);

export default class ODHNormFormWrap extends FormWrap {

  constructor(props, context) {
    super(props);

    this.schema = schema;
    this.createAction = context.flux.getActions('odh').createODHNorm;
    this.updateAction = context.flux.getActions('odh').updateODHNorm;
  }

  render() {
    return this.props.showForm ?
      <ODHNormForm
        formState={this.state.formState}
        formErrors={this.state.formErrors}
        permissions={['odh_norm.update']}
        addPermissionProp={true}
        canSave={this.state.canSave}
        onSubmit={this.handleFormSubmit.bind(this)}
        handleFormChange={this.handleFormStateChange.bind(this)}
        show={this.props.showForm}
        onHide={this.props.onFormHide}
      />
                : null;
  }

}
