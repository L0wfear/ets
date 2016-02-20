import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import Form from './Form.jsx';

export default class FormWrap extends Component {

	static contextTypes = {
		flux: React.PropTypes.object,
	}

	constructor(props) {
		super(props);

		this.state = {
			formState: null,
			canSave: false,
      formErrors: {},
		};
	}

	componentWillReceiveProps(props) {

		if (props.showForm) {
			if (props.element !== null ) {
        const formState = Object.assign({}, props.element);
        this.setState({formState});
			} else {
        this.setState({formState: {}});
      }
		}

	}


	handleFormStateChange(field, e) {
		console.info('Form changed', field, e)

		let formState = this.state.formState;
		let newState = {};
		formState[field] = !!e.target ? e.target.value : e;

		newState.formState = formState;

		this.setState(newState)
	}

	handleFormSubmit(formState) {
		const { flux } = this.context;
		this.props.onFormHide();
	}

	render() {

		let props = this.props;

		return props.showForm ?
    <Form formState = {this.state.formState}
					onSubmit={this.handleFormSubmit.bind(this)}
					handleFormChange={this.handleFormStateChange.bind(this)}
					show={this.props.showForm}
					onHide={this.props.onFormHide}
          tableMeta={this.props.tableMeta}
          title={this.props.title}
					{...this.state}/>
					: null;

	}

}
