import React from 'react';

import FormWrap from 'components/compositions/FormWrap.jsx';
import enhanceWithPermissions from 'components/util/RequirePermissions.jsx';
import BaseInsurancePolicyForm from './InsurancePolicyForm';

const InsurancePolicyForm = enhanceWithPermissions(BaseInsurancePolicyForm);

const schema = {
  properties: [
    {
      key: 'car_id',
      title: 'Регистрационный номер',
      type: 'number',
      required: true,
    },
    {
      key: 'insurer',
      title: 'Страховая организация',
      type: 'string',
      required: true,
      maxLength: 256,
    },
    {
      key: 'insurance_name',
      title: 'Наименование страхования',
      type: 'string',
      required: true,
      maxLength: 256,
    },
    {
      key: 'insurance_type_id',
      title: 'Тип страхования',
      type: 'number',
      required: true,
    },
    {
      key: 'seria',
      title: 'Серия',
      type: 'string',
    },
    {
      key: 'number',
      title: 'Номер',
      type: 'number',
      maxLength: 128,
      required: true,
    },
    {
      key: 'date_start',
      title: 'Дата начала действия',
      type: 'date',
      required: true,
    },
    {
      key: 'date_end',
      title: 'Дата окончания действия',
      type: 'date',
      required: true,
    },
    {
      key: 'price',
      title: 'Стоимость, руб.',
      type: 'number',
      maxLength: 128,
      required: true,
    },
  ],
};

export default class InsurancePolicyFormWrap extends FormWrap {

  constructor(props, context) {
    super(props);
    this.schema = schema;
    this.preventDefaultNotification = true;

    this.createAction = context.flux.getActions('autobase').insurancePolicy.bind(null, 'post');
    this.updateAction = context.flux.getActions('autobase').insurancePolicy.bind(null, 'put');
  }

  render() {
    const { entity, car_id = -1 } = this.props;
    return this.props.showForm ?
      <InsurancePolicyForm
        formState={this.state.formState}
        formErrors={this.state.formErrors}
        cols={this.props.meta.cols}
        car_id={car_id}
        permissions={[`${entity}.update`]}
        addPermissionProp
        canSave={this.state.canSave}
        onSubmit={this.handleFormSubmit.bind(this)}
        handleFormChange={this.handleFormStateChange.bind(this)}
        show={this.props.showForm}
        onHide={this.props.onFormHide}
      />
      : null;
  }
}
