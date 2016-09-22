import React from 'react';
import Div from 'components/ui/Div.jsx';
import CompanyStructureForm from './CompanyStructureForm.jsx';
import FormWrap from '../compositions/FormWrap.jsx';

export default class CompanyStructureFormWrap extends FormWrap {

  constructor(props, context) {
    super(props);

    this.createAction = context.flux.getActions('companyStructure').createCompanyElement;
    this.updateAction = context.flux.getActions('companyStructure').updateCompanyElement;
  }

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
