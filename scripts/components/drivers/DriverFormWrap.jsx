import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import { isEmpty } from 'utils/functions';
import DriverForm from './DriverForm.jsx';
import FormWrap from '../compositions/FormWrap.jsx';

class DriverFormWrap extends FormWrap {

	constructor(props) {
		super(props);
	}

	componentWillReceiveProps(props) {

		if (props.showForm && (props.showForm !== this.props.showForm)) {
			if (props.driver !== null ) {
        const driver = Object.assign({}, props.driver);
        this.setState({
          formState: driver
        })
			}
      else {
        this.setState({
          formState: {}
        });
      }
		}

	}

  async handleFormSubmit(formState) {
    const { flux } = this.context;

    if (isEmpty(formState.id)) {
      await flux.getActions('employees').createEmployee(formState);
    }
    else {
      await flux.getActions('employees').updateEmployee(formState);
    }

    flux.getActions('employees').getEmployees();
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
