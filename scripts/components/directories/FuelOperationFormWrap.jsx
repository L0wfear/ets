import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import FormWrap from 'compositions/FormWrap.jsx';
import FuelRateForm from './FuelOperationForm.jsx';

export default class FuelOperationFormWrap extends FormWrap {
	constructor(props) {
		super(props);
	}

	componentWillReceiveProps(props) {

		if (props.showForm && (this.props.showForm !== props.showForm)) {
			if (props.fuelOperation !== null ) {
        const fuelOperation = Object.assign({}, props.fuelOperation);
        this.setState({
          formState: fuelOperation,
        })
			} else {
        this.setState({
          formState: {},
        })
      }
		}
	}


	handleFormStateChange(field, e) {
		console.log( 'fuelOperation form changed', field, e)

		let formState = this.state.formState;
		let newState = {};
		formState[field] = !!e.target ? e.target.value : e;

		newState.formState = formState;

		this.setState(newState)
	}

	handleFormSubmit(formState) {
    //todo update fuelRate info
	  const { flux } = this.context;
    if (!formState.ID) {
			try {
		    flux.getActions('fuel-rates').addFuelOperation(formState);
			} catch (e) {
				return;
			}
  	} else {
			try {
	    	flux.getActions('fuel-rates').updateFuelOperation(formState);
			} catch (e) {
				return;
			}
    }
    this.props.onFormHide();
	}

	render() {

		let props = this.props;

		return props.showForm ?
    <FuelRateForm formState = {this.state.formState}
				onSubmit={this.handleFormSubmit.bind(this)}
				handleFormChange={this.handleFormStateChange.bind(this)}
				show={this.props.showForm}
				onHide={this.props.onFormHide}
				isNew={this.props.fuelRate === null}
				{...this.state}/>
								: null;

	}

}
