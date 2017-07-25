import React from 'react';

import FormWrap from 'components/compositions/FormWrap';
import enhanceWithPermissions from 'components/util/RequirePermissions';
import BaseTechMaintOrderForm from './TechMaintOrderForm';

export const techMaintOrderSchema = {
  properties: [
    {
      key: 'tech_maintenance_type_id',
      title: 'Тип ТО',
      type: 'number',
      required: true,
    },
  ],
};

const TechMaintOrderForm = enhanceWithPermissions(BaseTechMaintOrderForm);

export default class TechMaintOrderFormWrap extends FormWrap {

  constructor(props, context) {
    super(props);

    this.schema = techMaintOrderSchema;
    this.preventDefaultNotification = true;
    this.createAction = context.flux.getActions('autobase').techMaintOrder.bind(null, 'post');
    this.updateAction = context.flux.getActions('autobase').techMaintOrder.bind(null, 'put');
  }

  render() {
    const { entity } = this.props;

    return this.props.showForm ?
      <TechMaintOrderForm
        formState={this.state.formState}
        formErrors={this.state.formErrors}
        permissions={[`${entity}.update`]}
        addPermissionProp
        canSave={this.state.canSave}
        onSubmit={this.handleFormSubmit}
        handleFormChange={this.handleFormStateChange}
        show={this.props.showForm}
        onHide={this.props.onFormHide}
      />
      : null;
  }

}
