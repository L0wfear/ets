import React from 'react';
import enhanceWithPermissions from 'components/util/RequirePermissions';
import FormWrap from 'components/compositions/FormWrap';
import BaseMaintenanceRateForm from 'components/directories/normative/maintenance_rate/MaintenanceRateForm';

const MaintenanceRateForm = enhanceWithPermissions(BaseMaintenanceRateForm);


export const maintenanceRateSchema = {
  properties: [
    {
      key: 'technical_operation_id',
      title: 'Технологическая операция',
      type: 'number',
      required: true,
    },
    {
      key: 'maintenance_work_id',
      title: 'Наименование регламентной работы',
      type: 'number',
      required: true,
    },
    {
      key: 'season_id',
      title: 'Сезон',
      type: 'number',
      required: true,
    },
    {
      key: 'clean_category_id',
      title: 'Категория',
      type: 'number',
      required: true,
    },
    {
      key: 'clean_subcategory_id',
      title: 'Подкатегория',
      type: 'number',
      required: false,
    },
    {
      key: 'value',
      title: 'Норма',
      type: 'number',
      float: 3,
      required: true,
    },
  ],
};

export default class MaintenanceRateFormWrap extends FormWrap {
  constructor(props) {
    super(props);
    this.uniqueField = 'id';
    this.schema = maintenanceRateSchema;

    this.handleFormSubmit = this.handleFormSubmit.bind(this, props.type);
  }

  createAction = (...arg) => (
    this.context.flux.getActions('objects').createMaintenanceRate(this.props.type, ...arg)
  );

  updateAction = (...arg) => (
    this.context.flux.getActions('objects').updateMaintenanceRate(this.props.type, ...arg)
  );

  render() {
    const { props } = this;
    return props.showForm
      ? (
        <MaintenanceRateForm
          formState={this.state.formState}
          permissions={['maintenance_rate.update']}
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
