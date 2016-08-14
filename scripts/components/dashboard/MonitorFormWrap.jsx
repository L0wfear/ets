import React, { Component } from 'react';
import _ from 'lodash';
import Div from 'components/ui/Div.jsx';
import MonitorForm from './MonitorForm.jsx';
import FormWrap from '../compositions/FormWrap.jsx';
import { getDefaultMission } from '../../stores/MissionsStore.js';
import { isNotNull, isEmpty } from 'utils/functions';
import { missionSchema } from 'models/MissionModel.js';

class MonitorFormWrap extends FormWrap {

	constructor(props) {
		super(props);
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
