import React, { Component } from 'react';
import moment from 'moment';
import connectToStores from 'flummox/connect';
import _ from 'lodash';
import RouteForm from './RouteForm.jsx';
import FormWrap from '../compositions/FormWrap.jsx';

class RouteFormWrap extends FormWrap {

	constructor(props) {
		super(props);
	}

	componentWillReceiveProps(props) {
		if (props.showForm) {
			if (props.element !== null ) {
        const formState = _.cloneDeep(props.element);
				console.log(formState.polys);
				formState.polys = formState.type === 'simple_dt' ? _.cloneDeep(props.dtPolys) : _.cloneDeep(props.odhPolys);
				_.each(formState.object_list.filter(o => !!o.object_id), o => {
					formState.polys[o.object_id].state = o.state;
				});
        this.setState({formState});
			} else {
        this.setState({formState: {}});
      }
		}
	}

	resetFormState() {
		if (this.props.showForm) {
			if (this.props.element !== null ) {
        const formState = _.cloneDeep(this.props.element);
				formState.name = this.state.formState.name;
				formState.technical_operation_id = this.state.formState.technical_operation_id;
				formState.type = this.state.formState.type;
				formState.polys = formState.type === 'simple_dt' ? _.cloneDeep(this.props.dtPolys) : _.cloneDeep(this.props.odhPolys);
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

export default connectToStores(RouteFormWrap, ['routes']);
