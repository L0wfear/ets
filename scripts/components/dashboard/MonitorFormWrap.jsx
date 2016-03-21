import React, { Component } from 'react';
import _ from 'lodash';
import Div from '../ui/Div.jsx';
import MonitorForm from './MonitorForm.jsx';
import FormWrap from '../compositions/FormWrap.jsx';
import { getDefaultMission } from '../../stores/MissionsStore.js';
import { isNotNull, isEmpty } from 'utils/functions';
import { missionSchema, missionClosingSchema } from '../models/MissionModel.js';

class MonitorFormWrap extends FormWrap {

	constructor(props) {
		super(props);
	}

	handleFormSubmit(formState) {
		const { flux } = this.context;
		this.props.onFormHide();
	}

	render() {

		return 	<Div hidden={!this.props.showForm}>
							<MonitorForm formState = {this.state.formState}
													 onSubmit={this.handleFormSubmit.bind(this)}
													 handleFormChange={this.handleFormStateChange.bind(this)}
													 show={this.props.showForm}
													 onHide={this.props.onFormHide}
													 fromWaybill={this.props.fromWaybill}
													 {...this.state}/>
						</Div>

	}

}

export default MonitorFormWrap;
