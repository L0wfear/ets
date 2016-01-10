import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';

import CarForm from './CarForm.jsx';

export default class FormWrap extends Component {
	constructor(props) {
		super(props);

		this.state = {
			formState: null,
			canSave: false,
		};
	}

	componentWillReceiveProps(props) {

		if (props.showForm) {
			if (props.car !== null ) {
        const car = Object.assign({}, props.car);
        this.setState({
          formState: car
        })
			}
		}

	}


	handleFormStateChange(field, e) {
		console.log( 'car form changed', field, e)

		let formState = this.state.formState;
		let newState = {};
		formState[field] = !!e.target ? e.target.value : e;

		newState.formState = formState;

		this.setState(newState)
	}

	handleFormSubmit(formState) {
    //todo update car info
    this.props.onFormHide()
	}

	render() {

		let props = this.props;

		return props.showForm ?
    <CarForm formState = {this.state.formState}
								onSubmit={this.handleFormSubmit.bind(this)}
								handleFormChange={this.handleFormStateChange.bind(this)}
								show={this.props.showForm}
								onHide={this.props.onFormHide}
								{...this.state}/>
								: null;

	}

}
