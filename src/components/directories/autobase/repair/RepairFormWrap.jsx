import React from 'react';

import FormWrap from 'components/compositions/FormWrap.jsx';
import enhanceWithPermissions from 'components/util/RequirePermissions.jsx';
import BaseRepairForm from './RepairForm';

const RepairForm = enhanceWithPermissions(BaseRepairForm);

export const schema = {
  properties: [
    {
      key: 'car_id',
      title: 'Регистрационный номер',
      type: 'number',
      required: true,
    },
    {
      key: 'repair_company_id',
      title: 'Исполнитель ремонта',
      type: 'number',
      required: true,
    },
    {
      key: 'repair_type_id',
      title: 'Вид ремонта',
      type: 'number',
      required: true,
    },
    {
      key: 'number',
      title: 'Регистрационный номер',
      type: 'number',
      maxLength: 128,
    },
    {
      key: 'plan_date_start',
      title: 'Плановая дата начала ремонта',
      type: 'date',
      required: true,
    },
    {
      key: 'plan_date_end',
      title: 'Плановая дата окончания ремонта',
      type: 'date',
      required: true,
    },
    {
      key: 'fact_date_start',
      title: 'Фактическая дата начала ремонта',
      type: 'date',
    },
    {
      key: 'fact_date_end',
      title: 'Фактическая дата окончания ремонта',
      type: 'date',
    },
    {
      key: 'description',
      title: 'Описание неисправности',
      type: 'string',
      maxLength: 4096,
      required: true,
    },
    {
      key: 'note',
      title: 'Примечание прохождения',
      type: 'string',
      maxLength: 2048,
    },
  ],
};

export default class RepairFormWrap extends FormWrap {

  constructor(props, context) {
    super(props);

    this.schema = schema;
    this.preventDefaultNotification = true;

    this.createAction = context.flux.getActions('autobase').repair.bind(null, 'post');
    this.updateAction = context.flux.getActions('autobase').repair.bind(null, 'put');
  }

  render() {
    const { entity, car_id = -1 } = this.props;
    return this.props.showForm ?
      <RepairForm
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
