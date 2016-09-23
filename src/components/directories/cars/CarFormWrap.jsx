import React from 'react';
import FormWrap from 'components/compositions/FormWrap.jsx';
import CarForm from './CarForm.jsx';

export default class CarFormWrap extends FormWrap {

  constructor(props, context) {
    super(props);

    this.uniqueField = 'asuods_id';
    this.updateAction = context.flux.getActions('cars').updateCarAdditionalInfo;
  }

  render() {
    const props = this.props;

    return props.showForm ?
      <CarForm
        formState={this.state.formState}
        onSubmit={this.handleFormSubmit}
        handleFormChange={this.handleFormStateChange}
        show={this.props.showForm}
        onHide={this.props.onFormHide}
        {...this.state}
      />
      : null;
  }

}
