import React from 'react';
import Div from 'components/ui/Div';
import CompanyStructureForm from 'components/company_structure/CompanyStructureForm';
import FormWrap from 'components/compositions/FormWrap';

export const companyStructureSchema = {
  properties: [
    {
      key: 'type',
      title: 'Тип подразделения',
      type: 'number',
      required: true,
    },
    {
      key: 'name',
      title: 'Наименование',
      type: 'string',
      required: true,
    },
  ],
};

export default class CompanyStructureFormWrap extends FormWrap {
  constructor(props) {
    super(props);
    this.schema = companyStructureSchema;
  }

  createAction = formState => this.context.flux.getActions('companyStructure').createCompanyElement(formState)
    .then(() => this.props.refreshState());

  updateAction = formState => this.context.flux.getActions('companyStructure').updateCompanyElement(formState)
    .then(() => this.props.refreshState());

  render() {
    return (
      <Div hidden={!this.props.showForm}>
        <CompanyStructureForm
          onSubmit={this.handleFormSubmit}
          handleFormChange={this.handleFormStateChange}
          show={this.props.showForm}
          onHide={this.props.onFormHide}
          {...this.state}
        />
      </Div>
    );
  }
}
