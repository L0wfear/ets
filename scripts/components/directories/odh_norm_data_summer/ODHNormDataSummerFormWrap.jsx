import React, { Component } from 'react';
import ODHNormDataSummerForm from './ODHNormDataSummerForm.jsx';
import FormWrap from '../../compositions/FormWrap.jsx';
import { schema as odhNormDataSummerSchema, defaultElement } from 'models/ODHNormDataSummer.js';

export default class ODHNormDataSummerFormWrap extends FormWrap {

  constructor(props, context) {
    super(props);

    this.defaultElement = defaultElement;
    this.schema = odhNormDataSummerSchema;
    this.createAction = context.flux.getActions('odh').createODHNormDataSummer;
    this.updateAction = context.flux.getActions('odh').updateODHNormDataSummer;
  }

  render() {
    return this.props.showForm ?
      <ODHNormDataSummerForm
        formState={this.state.formState}
        formErrors={this.state.formErrors}
        canSave={this.state.canSave}
        onSubmit={this.handleFormSubmit.bind(this)}
        handleFormChange={this.handleFormStateChange.bind(this)}
        show={this.props.showForm}
        onHide={this.props.onFormHide}
      />
                : null;
  }

}
