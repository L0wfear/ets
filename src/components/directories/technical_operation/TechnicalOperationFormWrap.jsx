import React, { Component } from 'react';
import Div from 'components/ui/Div.jsx';
import BaseTechnicalOperationForm from './TechnicalOperationForm.jsx';
import FormWrap from 'components/compositions/FormWrap.jsx';
import { technicalOperationSchema } from 'models/TechOperationModel.js';
import enhanceWithPermissions from 'components/util/RequirePermissions.jsx';

const TechnicalOperationForm = enhanceWithPermissions(BaseTechnicalOperationForm);

export default class TechnicalOperationFormWrap extends FormWrap {

  constructor(props, context) {
    super(props);

    this.schema = technicalOperationSchema;
    this.updateAction = context.flux.getActions('technicalOperation').updateTechnicalOperation;
  }

  render() {
    return (
      <Div hidden={!this.props.showForm}>
        <TechnicalOperationForm
          permissions={['technical_operation.update']}
          addPermissionProp={true}
          formState={this.state.formState}
          onSubmit={this.handleFormSubmit.bind(this)}
          handleFormChange={this.handleFormStateChange.bind(this)}
          show={this.props.showForm}
          onHide={this.props.onFormHide}
          {...this.state}
        />
      </Div>
    );
  }

}
