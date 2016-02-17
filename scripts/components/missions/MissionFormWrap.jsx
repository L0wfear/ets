import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import Div from '../ui/Div.jsx';
import MissionForm from './MissionForm.jsx';
import FormWrap from '../compositions/FormWrap.jsx';
import { getDefaultMission } from '../../stores/MissionsStore.js';
import { isNotNull, isEmpty } from '../../utils/functions.js';
import { getDateWithoutTZ } from '../../utils/dates.js';
import { missionSchema, missionClosingSchema } from '../models/MissionModel.js';

class MissionFormWrap extends FormWrap {

	constructor(props) {
		super(props);

		this.schema = missionSchema;
	}

	componentWillReceiveProps(props) {

		if (props.showForm && props.showForm !== this.props.showForm) {
			if (props.element === null ) {
				const defaultMission = getDefaultMission();
				this.setState({
					formState: defaultMission,
					canSave: false,
					formErrors: this.validate(defaultMission, {}),
				})
			} else {
				let mission = _.clone(props.element);

				mission.date_start = getDateWithoutTZ(mission.date_start);
				mission.date_end = getDateWithoutTZ(mission.date_end);

				this.setState({
					formState: mission,
					//formErrors: this.validate(defaultMission, {}),
					canSave: true,
				});
			}
		}

	}

	handleFormSubmit(formState) {
		const { flux } = this.context;

		if (isEmpty(formState.id)) {
			flux.getActions('missions').createMission(formState);
		} else {
			flux.getActions('missions').updateMission(formState);
		}

		this.props.onFormHide();

		return;
	}

	render() {

		return 	<Div hidden={!this.props.showForm}>
							<MissionForm formState = {this.state.formState}
													 onSubmit={this.handleFormSubmit.bind(this)}
													 handleFormChange={this.handleFormStateChange.bind(this)}
													 show={this.props.showForm}
													 onHide={this.props.onFormHide}
													 {...this.state}/>
						</Div>

	}

}

export default MissionFormWrap;
