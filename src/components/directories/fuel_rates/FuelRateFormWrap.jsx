import React, { Component } from 'react';
import BaseFuelRateForm from './FuelRateForm.jsx';
import FormWrap from 'components/compositions/FormWrap.jsx';
import { fuelRateSchema, defaultElement } from './fuelRateSchema.js';
import enhanceWithPermissions from 'components/util/RequirePermissions.jsx';

const FuelRateForm = enhanceWithPermissions(BaseFuelRateForm);

export default class FuelRateFormWrap extends FormWrap {

  constructor(props, context) {
    super(props);

    this.defaultElement = defaultElement;
    this.schema = fuelRateSchema;
    this.createAction = context.flux.getActions('fuelRates').createFuelRate;
    this.updateAction = context.flux.getActions('fuelRates').updateFuelRate;
  }

  render() {
    const props = this.props;
    console.log('form state', this.state.formState);
    return props.showForm ?
      <FuelRateForm
        formState={this.state.formState}
        permissions={['fuel_consumption_rate.update']}
        addPermissionProp={true}
        onSubmit={this.handleFormSubmit.bind(this)}
        handleFormChange={this.handleFormStateChange.bind(this)}
        show={this.props.showForm}
        onHide={this.props.onFormHide}
        {...this.state}
      />
      : null;
  }

}
