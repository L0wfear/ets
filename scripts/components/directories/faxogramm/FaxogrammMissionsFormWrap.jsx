import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import Div from '../../ui/Div.jsx';
import FaxogrammMissionsForm from './FaxogrammMissionsForm.jsx';
import FormWrap from '../../compositions/FormWrap.jsx';
import { isNotNull, isEmpty } from 'utils/functions';
import { missionSchema, missionClosingSchema } from '../../models/MissionModel.js';

class FaxogrammMissionsFormWrap extends FormWrap {

	constructor(props) {
		super(props);
	}

	componentWillReceiveProps(props) {

		if (props.showForm && props.showForm !== this.props.showForm) {
			let faxogrammMissions = props.element === null ? {} : _.clone(props.element);
			let formErrors = this.validate(faxogrammMissions, {});
			this.setState({
				formState: faxogrammMissions,
				canSave: ! !!_.filter(formErrors).length,//false,
				formErrors,
			});
		}

	}

	handleFormSubmit() {
		const { flux } = this.context;
		let { formState } = this.state;
    const payload = {
      mission_source_id: '4',
      faxogramm_id: formState.id,
      date_start: formState.order_date,
      date_end: formState.order_date_to,
      assign_to_waybill: formState.assign_to_waybill ? 1 : 0,
    }
    flux.getActions('missions').createMissions(formState.missionJournalState.checkedMissions, payload);

		this.props.onFormHide();

		return;
	}

	render() {

		return 	<Div hidden={!this.props.showForm}>
							<FaxogrammMissionsForm formState = {this.state.formState}
							 onSubmit={this.handleFormSubmit.bind(this)}
							 handleFormChange={this.handleFormStateChange.bind(this)}
							 show={this.props.showForm}
							 onHide={this.props.onFormHide}
							 {...this.state}/>
						</Div>

	}

}

export default FaxogrammMissionsFormWrap;
