import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';

import FuelRateForm from './FuelRateForm.jsx';

export default class FormWrap extends Component {
	constructor(props) {
		super(props);

		this.state = {
			formState: null,
			canSave: false,
      isNew: false,
		};
	}

	componentWillReceiveProps(props) {

		if (props.showForm) {
			if (props.fuelRate !== null ) {
        const fuelRate = Object.assign({}, props.fuelRate);
        this.setState({
          formState: fuelRate,
          isNew: false,
        })
			} else {
        this.setState({
          formState: {
            order_date: new Date('1990', '00', '01'),
            operation_id: null,
            //summer_rate: '',
            //winter_rate: '',
            car_model_id: null
          },
          isNew: true,
        })
      }
		}
	}


	handleFormStateChange(field, e) {
		console.log( 'fuelRate form changed', field, e)

		let formState = this.state.formState;
		let newState = {};
		formState[field] = !!e.target ? e.target.value : e;

		newState.formState = formState;

		this.setState(newState)
	}

	handleFormSubmit(formState) {
    //todo update fuelRate info
    if (this.state.isNew) {
      this.props.addFuelRate(formState);
    } else {
      this.props.updateFuelRate(formState);
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
                operations={this.props.operations}
                models={this.props.models}
                isNew={this.props.fuelRate === null}
								{...this.state}/>
								: null;

	}

}
