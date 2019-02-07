import React from 'react';
import enhanceWithPermissions from 'components/util/RequirePermissions';
import FormWrap from 'components/compositions/FormWrap';
import BaseMaintenanceWorkForm from 'components/directories/data_for_calculation/maintenance_work/MaintenanceWorkForm';

const MaintenanceWorkForm = enhanceWithPermissions(BaseMaintenanceWorkForm);


export const maintenanceWorkSchema = {
  properties: [
    {
      key: 'name',
      title: 'Наименование',
      type: 'string',
      required: true,
    },
    {
      key: 'measure_unit_id',
      title: 'Единица измерения',
      type: 'number',
      integer: true,
      required: true,
    },
  ],
};

export default class MaintenanceWorkFormWrap extends FormWrap {
  constructor(props, context) {
    super(props);

    this.uniqueField = 'id';
    this.createAction = context.flux.getActions('objects').createMaintenanceWork;
    this.updateAction = context.flux.getActions('objects').updateMaintenanceWork;
    this.schema = maintenanceWorkSchema;

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  render() {
    const props = this.props;

    return props.showForm
      ? (
        <MaintenanceWorkForm
          formState={this.state.formState}
          permissions={['maintenance_work.update']}
          addPermissionProp
          onSubmit={this.handleFormSubmit}
          handleFormChange={this.handleFormStateChange}
          show={this.props.showForm}
          onHide={this.props.onFormHide}
          {...this.state}
        />
      )
      : null;
  }
}
