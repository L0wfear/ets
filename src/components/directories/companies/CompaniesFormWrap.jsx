import React from 'react';
import enhanceWithPermissions from 'components/util/RequirePermissions';
import FormWrap from 'components/compositions/FormWrap';
import BaseCompaniesForm from 'components/directories/companies/CompaniesForm';

const CompaniesForm = enhanceWithPermissions(BaseCompaniesForm);

export const companiesSchema = {
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

export default class CompaniesFormWrap extends FormWrap {
  constructor(props, context) {
    super(props);

    this.uniqueField = 'company_id';
    this.updateAction = context.flux.getActions('objects').updateCompanies;
    this.schema = companiesSchema;

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  render() {
    const props = this.props;

    return props.showForm
      ? (
        <CompaniesForm
          formState={this.state.formState}
          permissions={['company.update']}
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
