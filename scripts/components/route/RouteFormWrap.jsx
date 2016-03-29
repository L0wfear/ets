import React, { Component } from 'react';
import moment from 'moment';
import connectToStores from 'flummox/connect';
import _ from 'lodash';
import RouteForm from './RouteForm.jsx';
import FormWrap from '../compositions/FormWrap.jsx';
import { routeSchema } from '../models/RouteModel.js';

class RouteFormWrap extends FormWrap {

	constructor(props) {
		super(props);

		this.schema = routeSchema;
	}

	componentWillReceiveProps(props) {
		if (props.showForm && props.showForm !== this.props.showForm) {
			let formState = null;
			if (props.element !== null ) {
        formState = _.cloneDeep(props.element);
				formState.polys = formState.type === 'simple_dt' ? _.cloneDeep(props.dtPolys) : _.cloneDeep(props.odhPolys);
				_.each(formState.object_list.filter(o => !!o.object_id), o => {
					formState.polys[o.object_id].state = o.state;
				});
			} else {
				formState = {};
      }
			let formErrors = this.validate(formState, {});
			this.setState({
				formState,
				canSave: ! !!_.filter(formErrors).length,
				formErrors,
			});
		}
	}

	resetFormState() {
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

	async handleFormSubmit(formState, manualCreating) {
		const { flux } = this.context;
		let result;

		if (!formState.id) {
			result = await flux.getActions('routes').createRoute(formState);
		} else {
			result = await flux.getActions('routes').updateRoute(formState);
		}
		
		this.props.onFormHide(true, result);
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
								fromMission={this.props.fromMission}
      					{...this.state}/>
      					: null;

	}

}

export default connectToStores(RouteFormWrap, ['routes']);
