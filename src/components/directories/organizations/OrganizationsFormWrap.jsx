import React from 'react';
import enhanceWithPermissions from 'components/util/RequirePermissions.jsx';
import FormWrap from 'components/compositions/FormWrap.jsx';
import BaseOrganizationsForm from './OrganizationsForm';

const OrganizationsForm = enhanceWithPermissions(BaseOrganizationsForm);

export const organizationsSchema = {
  properties: [
    {
      key: 'short_name',
      title: 'Наименование',
      type: 'string',
      required: false,
    },
    {
      key: 'has_remote_checkup',
      title: 'Наличие дистанционного мед. осмотра',
      type: 'boolean',
      required: false,
    },
  ],
};

export default class MaintenanceWorkFormWrap extends FormWrap {

  constructor(props, context) {
    super(props);

    this.uniqueField = 'company_id';
    this.updateAction = context.flux.getActions('objects').updateOrganizations;
    this.schema = organizationsSchema;

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleFormStateChange = this.handleFormStateChange.bind(this);
  }

  render() {
    const props = this.props;

    return props.showForm ?
      <OrganizationsForm
        formState={this.state.formState}
        permissions={['companies.update']}
        addPermissionProp
        onSubmit={this.handleFormSubmit}
        handleFormChange={this.handleFormStateChange}
        show={this.props.showForm}
        onHide={this.props.onFormHide}
        {...this.state}
      />
    : null;
  }

}
