import React, { Component } from 'react';
import Div from 'components/ui/Div';
import FormWrap from 'components/compositions/FormWrap';
import { technicalOperationSchema } from 'models/TechOperationModel';
import enhanceWithPermissions from 'components/util/RequirePermissions';
import BaseTechnicalOperationForm from 'components/directories/technical_operation/TechnicalOperationForm';

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
          addPermissionProp
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
