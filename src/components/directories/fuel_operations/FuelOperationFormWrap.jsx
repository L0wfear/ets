import React, { Component } from 'react';
import FormWrap from 'compositions/FormWrap.jsx';
import FuelRateForm from './FuelOperationForm.jsx';

export const fuelOperationSchema = {
  properties: [
    {
      key: 'name',
      title: 'Операция',
      type: 'string',
      required: true,
    },
  ],
};

export default class FuelOperationFormWrap extends FormWrap {

  constructor(props, context) {
    super(props);

    this.uniqueField = 'id';
    this.createAction = context.flux.getActions('fuelRates').createFuelOperation;
    this.updateAction = context.flux.getActions('fuelRates').updateFuelOperation;
    this.schema = fuelOperationSchema;
  }

  render() {
    const props = this.props;

    return props.showForm ?
    <FuelRateForm
      formState={this.state.formState}
      onSubmit={this.handleFormSubmit.bind(this)}
      handleFormChange={this.handleFormStateChange.bind(this)}
      show={this.props.showForm}
      onHide={this.props.onFormHide}
      {...this.state}
    />
    : null;
  }

}
