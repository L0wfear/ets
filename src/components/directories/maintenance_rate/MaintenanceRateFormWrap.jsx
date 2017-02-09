import React from 'react';
import enhanceWithPermissions from 'components/util/RequirePermissions.jsx';
import FormWrap from 'components/compositions/FormWrap.jsx';
import BaseMaintenanceRateForm from './MaintenanceRateForm.jsx';

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
      required: 'true',
    },
  ],
};

export default class MaintenanceRateFormWrap extends FormWrap {

  constructor(props, context) {
    super(props);
    this.uniqueField = 'id';
    this.createAction = context.flux.getActions('objects').createMaintenanceRate.bind(this, props.type);
    this.updateAction = context.flux.getActions('objects').updateMaintenanceRate.bind(this, props.type);
    this.schema = maintenanceRateSchema;

    this.handleFormSubmit = this.handleFormSubmit.bind(this, props.type);
    this.handleFormStateChange = this.handleFormStateChange.bind(this);
  }

  inheritedComponentWillReceiveProps(props) {
    if (props.type !== this.props.type) {
      this.createAction = this.context.flux.getActions('objects').createMaintenanceRate.bind(this, props.type);
      this.updateAction = this.context.flux.getActions('objects').updateMaintenanceRate.bind(this, props.type);
    }
  }

  render() {
    const props = this.props;
    return props.showForm ?
      <MaintenanceRateForm
        formState={this.state.formState}
        permissions={['maintenance_rate.update']}
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
