import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import RouteForm from './RouteForm.jsx';
import FormWrap from '../compositions/FormWrap.jsx';

export default class RouteFormWrap extends FormWrap {

	constructor(props) {
		super(props);
	}

	resetFormState() {
		if (this.props.showForm) {
			if (this.props.element !== null ) {
        const formState = _.cloneDeep(this.props.element);
				formState.type = this.state.formState.type;
        this.setState({formState});
			} else {
        this.setState({formState: {}});
      }
		}
	}

	handleFormSubmit(formState, manualCreating) {
		const { flux } = this.context;
		if (!formState.id) {
			flux.getActions('routes').createRoute(formState);
		} else {
			flux.getActions('routes').updateRoute(formState);
		}
		this.props.onFormHide();
	}

	render() {

		let props = this.props;

		return props.showForm ?
    <RouteForm formState = {this.state.formState}
      					onSubmit={this.handleFormSubmit.bind(this)}
      					handleFormChange={this.handleFormStateChange.bind(this)}
      					show={this.props.showForm}
      					onHide={this.props.onFormHide}
								resetState={this.resetFormState.bind(this)}
      					{...this.state}/>
      					: null;

	}

}
