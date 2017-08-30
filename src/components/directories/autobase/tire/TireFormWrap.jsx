import React from 'react';

import FormWrap from 'components/compositions/FormWrap.jsx';
import enhanceWithPermissions from 'components/util/RequirePermissions';
import TireForm from './TireForm';

export const tireSchema = {
  properties: [
    {
      key: 'tire_model_id',
      title: 'Модель шины',
      type: 'number',
      required: true,
    },
    {
      key: 'tire_manufacturer_id',
      title: 'Производитель',
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


class TireFormWrap extends FormWrap {

  constructor(props, context) {
    super(props);

    this.schema = tireSchema;
    this.preventDefaultNotification = true;
    this.createAction = context.flux.getActions('autobase').tire.bind(null, 'post');
    this.updateAction = context.flux.getActions('autobase').tire.bind(null, 'put');
  }

  render() {
    const { entity, isPermitted = false } = this.props;
    const { saveButtonEnability = true } = this.state;
    const canSave = isPermitted && this.state.canSave && saveButtonEnability;

    return this.props.showForm ?
      <TireForm
        formState={this.state.formState}
        formErrors={this.state.formErrors}
        permissions={[`${entity}.update`]}
        addPermissionProp
        isPermitted={isPermitted}
        canSave={canSave}
        onSubmit={this.handleFormSubmit.bind(this)}
        handleFormChange={this.handleFormStateChange.bind(this)}
        show={this.props.showForm}
        onHide={this.props.onFormHide}
      />
      : null;
  }
}

export default enhanceWithPermissions(TireFormWrap);
