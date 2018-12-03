import React from 'react';
import enhanceWithPermissions from 'components/util/RequirePermissions';
import FormWrap from 'components/compositions/FormWrap';
import BaseCleaningRateForm from 'components/directories/data_for_calculation/cleaning_rate/CleaningRateForm';

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
  constructor(props) {
    super(props);
    this.uniqueField = 'id';
    this.schema = cleaningRateSchema;

    this.handleFormSubmit = this.handleFormSubmit.bind(this, props.type);
  }

  createAction = (...arg) => (
    this.context.flux.getActions('objects').createCleaningRate(this.props.type, ...arg)
  );

  updateAction = (...arg) => (
    this.context.flux.getActions('objects').updateCleaningRate(this.props.type, ...arg)
  );

  render() {
    const { props } = this;
    return props.showForm
      ? (
        <CleaningRateForm
          formState={this.state.formState}
          permissions={['cleaning_rate.update']}
          addPermissionProp
          onSubmit={this.handleFormSubmit}
          handleFormChange={this.handleFormStateChange}
          show={props.showForm}
          onHide={props.onFormHide}
          type={props.type}
          {...this.state}
        />
      )
      : null;
  }
}
