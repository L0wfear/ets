import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import Div from '../ui/Div.jsx';
import DutyMissionForm from './DutyMissionForm.jsx';
import FormWrap from '../compositions/FormWrap.jsx';
import { getDefaultDutyMission } from '../../stores/MissionsStore.js';
import { isNotNull, isEmpty } from 'utils/functions';
import { dutyMissionSchema, dutyMissionClosingSchema } from '../models/DutyMissionModel.js';

class DutyMissionFormWrap extends FormWrap {

	constructor(props) {
		super(props);

		this.schema = dutyMissionSchema;
	}

	componentWillReceiveProps(props) {

		if (props.showForm && props.showForm !== this.props.showForm) {
			let mission = props.element === null ? getDefaultDutyMission() : _.cloneDeep(props.element);
			let formErrors = this.validate(mission, {});
			this.setState({
				formState: mission,
				canSave: ! !!_.filter(formErrors).length,//false,
				formErrors,
			});
		}

	}

  async handleFormPrint() {
    let mission = _.cloneDeep(this.state.formState);

		// все переделать на пост! убрать бред
		if (mission.id) {
			await this.context.flux.getActions('missions').printDutyMission(mission.id).then(url => {
				window.location = `${url}?duty_mission_id=${mission.id}`;
				setTimeout(() => {
					this.context.flux.getActions('missions').getDutyMissions();
				}, 500);
			});
		} else {
			let response = await this.context.flux.getActions('missions').createDutyMission(mission);
			let id = response.result && response.result[0] ? response.result[0].id : null;
			await this.context.flux.getActions('missions').printDutyMission(id).then(url => {
				window.location = `${url}?duty_mission_id=${id}`;
				setTimeout(() => {
					this.context.flux.getActions('missions').getDutyMissions();
				}, 500);
			});
		}
		this.context.flux.getActions('missions').getDutyMissions();
		this.props.onFormHide();
  }

	async handleFormSubmit(formState) {
		const { flux } = this.context;

		if (isEmpty(formState.id)) {
			await flux.getActions('missions').createDutyMission(formState);
		} else {
			await flux.getActions('missions').updateDutyMission(formState);
		}


		flux.getActions('missions').getDutyMissions();
		this.props.onFormHide();

		return;
	}

	render() {

		return 	<Div hidden={!this.props.showForm}>
							<DutyMissionForm formState = {this.state.formState}
													 onSubmit={this.handleFormSubmit.bind(this)}
                           onPrint={this.handleFormPrint.bind(this)}
													 handleFormChange={this.handleFormStateChange.bind(this)}
													 show={this.props.showForm}
													 onHide={this.props.onFormHide}
													 fromWaybill={this.props.fromWaybill}
													 {...this.state}/>
						</Div>

	}

}

export default DutyMissionFormWrap;
