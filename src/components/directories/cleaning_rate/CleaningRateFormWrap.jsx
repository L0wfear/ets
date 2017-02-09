import React from 'react';
import enhanceWithPermissions from 'components/util/RequirePermissions.jsx';
import FormWrap from 'components/compositions/FormWrap.jsx';
import BaseCleaningRateForm from './CleaningRateForm.jsx';

const CleaningRateForm = enhanceWithPermissions(BaseCleaningRateForm);


export const cleaningRateSchema = {
  properties: [
    {
      key: 'technical_operation_id',
      title: 'Технологическая операция',
      type: 'number',
      required: true,
    },
    {
      key: 'property',
      title: 'Площадная характеристика',
      type: 'string',
      required: true,
    },
    {
      key: 'value',
      title: 'Коэффициент',
      type: 'number',
      float: 3,
      required: true,
    },
    {
      key: 'measure_unit_id',
      title: 'Единица измерения',
      type: 'number',
      required: true,
    },
  ],
};

export default class CleaningRateFormWrap extends FormWrap {

  constructor(props, context) {
    super(props);
    this.uniqueField = 'id';
    this.createAction = context.flux.getActions('objects').createCleaningRate.bind(this, props.type);
    this.updateAction = context.flux.getActions('objects').updateCleaningRate.bind(this, props.type);
    this.schema = cleaningRateSchema;

    this.handleFormSubmit = this.handleFormSubmit.bind(this, props.type);
    this.handleFormStateChange = this.handleFormStateChange.bind(this);
  }

  inheritedComponentWillReceiveProps(props) {
    if (props.type !== this.props.type) {
      this.createAction = this.context.flux.getActions('objects').createCleaningRate.bind(this, props.type);
      this.updateAction = this.context.flux.getActions('objects').updateCleaningRate.bind(this, props.type);
    }
  }

  render() {
    const props = this.props;
    return props.showForm ?
      <CleaningRateForm
        formState={this.state.formState}
        permissions={['cleaning_rate.update']}
        addPermissionProp
        onSubmit={this.handleFormSubmit}
        handleFormChange={this.handleFormStateChange}
        show={this.props.showForm}
        onHide={this.props.onFormHide}
        type={this.props.type}
        {...this.state}
      />
    : null;
  }

}
