import React from 'react';
import FormWrap from 'components/compositions/FormWrap';
import { odhNormSchema } from 'models/ODHNormDataSummer';
import ODHNormDataSummerForm from 'components/directories/data_for_calculation/odh_norm_data_summer/ODHNormDataSummerForm';

export default class ODHNormDataSummerFormWrap extends FormWrap {
  constructor(props, context) {
    super(props);

    this.defaultElement = null;
    this.schema = odhNormSchema;
    this.createAction = context.flux.getActions('odh').createODHNormDataSummer;
    this.updateAction = context.flux.getActions('odh').updateODHNormDataSummer;
  }

  render() {
    return this.props.showForm
      ? (
        <ODHNormDataSummerForm
          formState={this.state.formState}
          formErrors={this.state.formErrors}
          canSave={this.state.canSave}
          onSubmit={this.handleFormSubmit}
          handleFormChange={this.handleFormStateChange}
          show={this.props.showForm}
          onHide={this.props.onFormHide}
        />
      )
      : null;
  }
}
