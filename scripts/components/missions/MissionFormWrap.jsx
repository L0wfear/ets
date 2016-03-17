import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import Div from '../ui/Div.jsx';
import MissionForm from './MissionForm.jsx';
import FormWrap from '../compositions/FormWrap.jsx';
import { getDefaultMission } from '../../stores/MissionsStore.js';
import { isNotNull, isEmpty } from '../../utils/functions.js';
import { missionSchema, missionClosingSchema } from '../models/MissionModel.js';

class MissionFormWrap extends FormWrap {

	constructor(props) {
		super(props);

		this.schema = missionSchema;
	}

	componentWillReceiveProps(props) {

		if (props.showForm && props.showForm !== this.props.showForm) {
			let mission = props.element === null ? getDefaultMission() : _.clone(props.element);
			let formErrors = this.validate(mission, {});
			this.setState({
				formState: mission,
				canSave: ! !!_.filter(formErrors).length,//false,
				formErrors,
			});
		}

	}

	handlePrint() {
		let f = this.state.formState;
		let URL = `http://ods.mos.ru/ssd/ets/services/plate_mission/?mission_id=${f.id}`;
		let data = {};

		global.map.once('postcompose', function(event) {
      data.image = event.context.canvas.toDataURL('image/png');
			//window.location = global.canvas;
			fetch(URL, {
		    method: 'post',
				body: JSON.stringify(data)
			});
    });
		global.map.render();
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
													 handlePrint={this.handlePrint.bind(this)}
													 show={this.props.showForm}
													 onHide={this.props.onFormHide}
													 fromWaybill={this.props.fromWaybill}
													 {...this.state}/>
						</Div>

	}

}

export default MissionFormWrap;
