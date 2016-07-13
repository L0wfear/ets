import React from 'react';
import Div from 'components/ui/Div.jsx';
import CompanyStructureForm from './CompanyStructureForm.jsx';
import FormWrap from '../compositions/FormWrap.jsx';

class CompanyStructureFormWrap extends FormWrap {

	constructor(props, context) {
		super(props);

		this.createAction = context.flux.getActions('company-structure').createCompanyElement;
		this.updateAction = context.flux.getActions('company-structure').updateCompanyElement;
	}

	render() {

		return (
			<Div hidden={!this.props.showForm}>
				<CompanyStructureForm onSubmit={this.handleFormSubmit.bind(this)}
          										 handleFormChange={this.handleFormStateChange.bind(this)}
          										 show={this.props.showForm}
          										 onHide={this.props.onFormHide}
          										 {...this.state}/>
			</Div>
		)

	}

}

export default CompanyStructureFormWrap;
