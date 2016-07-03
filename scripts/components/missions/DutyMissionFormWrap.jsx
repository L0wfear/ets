import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import { saveData } from 'utils/functions';
import Div from '../ui/Div.jsx';
import DutyMissionForm from './DutyMissionForm.jsx';
import FormWrap from '../compositions/FormWrap.jsx';
import { getDefaultDutyMission } from '../../stores/MissionsStore.js';
import { isNotNull, isEmpty } from 'utils/functions';
import { dutyMissionSchema, dutyMissionClosingSchema } from '../models/DutyMissionModel.js';

class DutyMissionFormWrap extends FormWrap {

	constructor(props, context) {
		super(props);

		this.schema = dutyMissionSchema;
		this.defaultElement = getDefaultDutyMission();
		this.createAction = async (formState) => {
			await context.flux.getActions('missions').createDutyMission(formState);
			context.flux.getActions('missions').getDutyMissions();
		};
		this.updateAction = context.flux.getActions('missions').updateDutyMission;
	}

  async handleFormPrint() {
    let mission = _.cloneDeep(this.state.formState);

		let response;

		//потом перенести на бек
		if (mission.id) {
			response = await this.context.flux.getActions('missions').updateDutyMission(mission);
		} else {
			response = await this.context.flux.getActions('missions').createDutyMission(mission);
		}

		let id = response.result && response.result[0] ? response.result[0].id : null;
		await this.context.flux.getActions('missions').printDutyMission(id).then(blob => {saveData(blob, `Печатная форма наряд-задания №${id}.pdf`)});
		this.context.flux.getActions('missions').getDutyMissions();
		this.props.onFormHide();
  }

	render() {

		return 	<Div hidden={!this.props.showForm}>
			<DutyMissionForm
					formState = {this.state.formState}
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
