import React from 'react';

import FormWrap from 'components/compositions/FormWrap.jsx';
import enhanceWithPermissions from 'components/util/RequirePermissions';
import BaseTireForm from './TireForm';

export const tireSchema = {
  properties: [
    {
      key: 'company_id',
      title: 'Организация',
      type: 'number',
      required: true,
    },
    {
      key: 'tire_model_id',
      title: 'Модель шины',
      type: 'number',
      required: true,
    },
    {
      key: 'tire_size_id',
      title: 'Размер',
      type: 'number',
      required: true,
    },
    {
      key: 'comment',
      title: 'Комментарий',
      type: 'string',
      maxLength: 4000,
      required: false,
    },
  ],
};

const TireForm = enhanceWithPermissions(BaseTireForm);

export default class TireFormWrap extends FormWrap {

  constructor(props, context) {
    super(props);

    this.schema = tireSchema;
    this.preventDefaultNotification = true;
    this.createAction = context.flux.getActions('autobase').tire.bind(null, 'post');
    this.updateAction = context.flux.getActions('autobase').tire.bind(null, 'put');
  }

  render() {
    return this.props.showForm ?
      <TireForm
        formState={this.state.formState}
        formErrors={this.state.formErrors}
        permissions={['tire.update']}
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
