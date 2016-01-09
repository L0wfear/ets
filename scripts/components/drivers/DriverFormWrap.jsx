import React, { Component } from 'react';
import moment from 'moment';
import {monthes} from '../../utils/dates.js';
import _ from 'lodash';

import DriverForm from './DriverForm.jsx';
import { getMasters, getDrivers, getFIOById, getDriverByCode, updateDriver } from '../../stores/EmployeesStore.js';

const formStages = ['creating', 'post-creating', 'display', 'closing'];

export default class FormWrap extends Component {
	constructor(props) {
		super(props);

		this.state = {
			formStage: formStages[0],
			formState: null,
			canSave: false,
			canPrint: false
		}
	}

	componentWillReceiveProps(props) {

		if (props.showForm) {
			if (props.driver === null ) {
				// this.setState({
				// 	formState: getDefaultBill(),
				// 	formStage: formStages[0]
				// })
			} else {
        const driver = Object.assign({}, props.driver);
        this.setState({
          formState: driver,
          formStage: formStages[3]
        })
			}
		}

	}


	handleFormStateChange(field, e) {
		console.log( 'driver form changed', field, e)

		let formState = this.state.formState;
		let newState = {};
		formState[field] = !!e.target ? e.target.value : e;

		// let HAS_REQUIRED_FIELDS =
		// 		this.state.formStage === 'creating' || this.state.formStage === 'post-creating' ?
		// 			!!formState.RESPONSIBLE_PERSON_ID &&
		// 			!!formState.PLAN_DEPARTURE_DATE &&
		// 			!!formState.PLAN_ARRIVAL_DATE &&
		// 			!!formState.DRIVER_ID &&
		// 			!!formState.CAR_ID &&
		// 			!!formState.ODOMETR_START &&
		// 			!!formState.FUEL_TYPE_ID &&
		// 			!!formState.FUEL_START
		// 		:
		// 			!!formState.ODOMETR_END &&
		// 			!!formState.MOTOHOURS_END &&
		// 			!!formState.FUEL_GIVEN &&
		// 			!!formState.FUEL_END;
    //
    //
		// if (HAS_REQUIRED_FIELDS) {
		// 	newState.canPrint = true;
		// 	if (this.state.formStage === 'creating') {
		// 		newState.canSave = true;
		// 	}
    //
		// 	if (this.state.formStage === 'post-creating') {
		// 		newState.canSave = true;
		// 	}
    //
		// 	if (this.state.formStage === 'closing') {
		// 		newState.canSave = true;
		// 	}
    //
		// }
    //
		// if (field === 'ODOMETR_END') {
		// 	formState.ODOMETR_DIFF = formState.ODOMETR_END - formState.ODOMETR_START;
		// }
		// if (field === 'MOTOHOURS_END') {
		// 	formState.MOTOHOURS_DIFF = formState.MOTOHOURS_END - formState.MOTOHOURS_START;
		// }
		// if (field === 'MOTOHOURS_EQUIP_END') {
		// 	formState.MOTOHOURS_EQUIP_DIFF = formState.MOTOHOURS_EQUIP_END - formState.MOTOHOURS_EQUIP_START;
		// }

		newState.formState = formState;
		//if (field === 'fuel')
		this.setState(newState)
	}

	handleFormSubmit(formState) {
		//let billStatus = formState.STATUS;
		//let stage = this.state.formStage;
    //
		// if ( stage === 'creating') {
		// 	formState.STATUS = 'open';
		// 	createBill(formState);
		// 	this.setState({
		// 		formStage: formStages[1],
		// 		canPrint: true,
		// 		canSave: false
		// 	})
		// 	//this.props.updateTable();
		// } else if (stage === 'post-creating') {
		// 	formState.STATUS = 'open';
		// 	updateBill(formState, true);
		// 	this.setState({
		// 		canSave: false
		// 	})
		// 	//this.props.updateTable();
		// } else if (stage === 'closing') {
		// 	formState.STATUS = 'closed';
		// 	updateBill(formState)
		// 	this.props.onFormHide()
		// }
    updateDriver(formState);

    this.props.onFormHide()
	}

	render() {

		let props = this.props;

		return props.showForm ?
    <DriverForm formState = {this.state.formState}
								onSubmit={this.handleFormSubmit.bind(this)}
								//handlePrint={this.handlePrint.bind(this)}
								handleFormChange={this.handleFormStateChange.bind(this)}
								show={this.props.showForm}
								onHide={this.props.onFormHide}
								{...this.state}/>
								: null;

	}

}
