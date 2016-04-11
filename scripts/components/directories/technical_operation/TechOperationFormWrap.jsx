import React, { Component } from 'react';
import _ from 'lodash';
import Div from '../../ui/Div.jsx';
import TechOperationForm from './TechOperationForm.jsx';
import FormWrap from '../../compositions/FormWrap.jsx';
import { isNotNull, isEmpty } from 'utils/functions';
import { techOperationSchema } from '../../models/TechOperationModel.js';

class TechOperationFormWrap extends FormWrap {

	constructor(props) {
		super(props);

    this.schema = techOperationSchema;
	}

	handleFormSubmit(formState) {
		try {
	    this.context.flux.getActions('technical_operation').updateTechnicalOperation(formState);
		} catch (e) {
			return;
		}
		this.props.onFormHide();
	}

	render() {

		return 	<Div hidden={!this.props.showForm}>
							<TechOperationForm formState = {this.state.formState}
      													 onSubmit={this.handleFormSubmit.bind(this)}
      													 handleFormChange={this.handleFormStateChange.bind(this)}
      													 show={this.props.showForm}
      													 onHide={this.props.onFormHide}
      													 {...this.state}/>
						</Div>

	}

}

export default TechOperationFormWrap;
