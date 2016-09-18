import React, { Component } from 'react';
import EfficiencyForm from './EfficiencyForm.jsx';
import FormWrap from '../../compositions/FormWrap.jsx';
import { schema as efficiencySchema, defaultElement } from 'models/Efficiency.js';

export default class EfficiencyFormWrap extends FormWrap {

  constructor(props, context) {
    super(props);

    this.defaultElement = defaultElement;
    this.schema = efficiencySchema;
    this.createAction = context.flux.getActions('odh').createEfficiency;
    this.updateAction = context.flux.getActions('odh').updateEfficiency;
  }

  render() {
    return this.props.showForm ?
      <EfficiencyForm
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
