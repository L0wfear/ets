import React, { Component } from 'react';
import _ from 'lodash';
import Div from 'components/ui/Div.jsx';
import TechnicalOperationForm from './TechnicalOperationForm.jsx';
import FormWrap from 'components/compositions/FormWrap.jsx';
import { technicalOperationSchema } from 'models/TechOperationModel.js';

export default class TechnicalOperationFormWrap extends FormWrap {

	constructor(props, context) {
		super(props);

    this.schema = technicalOperationSchema;
		this.updateAction = context.flux.getActions('technicalOperation').updateTechnicalOperation;
	}

	render() {

		return 	<Div hidden={!this.props.showForm}>
							<TechnicalOperationForm formState = {this.state.formState}
      													 onSubmit={this.handleFormSubmit.bind(this)}
      													 handleFormChange={this.handleFormStateChange.bind(this)}
      													 show={this.props.showForm}
      													 onHide={this.props.onFormHide}
      													 {...this.state}/>
						</Div>

	}

}
