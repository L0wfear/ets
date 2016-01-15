import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import DriverForm from './DriverForm.jsx';

const formStages = ['creating', 'post-creating', 'display', 'closing'];

class FormWrap extends Component {
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
			if (props.driver !== null ) {
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

		newState.formState = formState;

		this.setState(newState)
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

FormWrap.contextTypes = {
	flux: React.PropTypes.object,
};

export default FormWrap;
