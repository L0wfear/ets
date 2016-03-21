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

  handleFormPrint() {
    let mission = _.cloneDeep(this.state.formState);

    mission.status = 'assigned';
    this.context.flux.getActions('missions').updateDutyMission(mission);
		this.props.onFormHide();
  }

	handleFormSubmit(formState) {
		const { flux } = this.context;

		if (isEmpty(formState.id)) {
			flux.getActions('missions').createDutyMission(formState);
		} else {
			flux.getActions('missions').updateDutyMission(formState);
		}

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
