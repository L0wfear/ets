import React from 'react';

import FormWrap from 'components/compositions/FormWrap.jsx';
import enhanceWithPermissions from 'components/util/RequirePermissions.jsx';
import BaseInsurancePolicyForm from './InsurancePolicyForm';

const InsurancePolicyForm = enhanceWithPermissions(BaseInsurancePolicyForm);

const schema = {
  properties: [
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
      key: 'qwe',
      title: 'Срок действия, мес.',
      type: 'number',
      maxLength: 128,
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

    this.updateAction = context.flux.getActions('autobase').insurancePolicy.bind(null, 'put');
    this.createAction = context.flux.getActions('autobase').insurancePolicy.bind(null, 'post');
  }

  render() {
    const { entity } = this.props;
    return this.props.showForm ?
      <InsurancePolicyForm
        formState={this.state.formState}
        formErrors={this.state.formErrors}
        cols={this.props.meta.cols}
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
