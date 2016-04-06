import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import DriverForm from './DriverForm.jsx';
import FormWrap from '../compositions/FormWrap.jsx';

class DriverFormWrap extends FormWrap {

	constructor(props) {
		super(props);
	}

	componentWillReceiveProps(props) {

		if (props.showForm) {
			if (props.driver !== null ) {
        const driver = Object.assign({}, props.driver);
        this.setState({
          formState: driver
        })
			}
		}

	}

	handleFormSubmit(formState) {
		this.context.flux.getActions('employees').updateEmployee(formState);
    this.props.onFormHide();
	}

	render() {

		let props = this.props;

		return props.showForm ?
    <DriverForm formState = {this.state.formState}
								onSubmit={this.handleFormSubmit.bind(this)}
								handleFormChange={this.handleFormStateChange.bind(this)}
								show={this.props.showForm}
								onHide={this.props.onFormHide}
								{...this.state}/>
								: null;

	}

}

export default DriverFormWrap;
