import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import ROUTES, { getRouteById } from '../../mocks/routes.js';
import WORK_TYPES from '../../mocks/work_types.js';
import {monthes} from '../utils/dates.js';
import Div from './ui/Div.jsx';

import MissionForm from './MissionForm.jsx';

import { getDefaultMission } from '../stores/MissionsStore.js';
import { makeTime, makeDate } from '../utils/dates.js';
import { validate as validateNumber} from '../validate/validateNumber.js';
import { isNotNull, isEmpty } from '../utils/functions.js';
import { validateRow } from '../validate/validateRow.js';

import { missionSchema, missionClosingSchema } from './models/MissionModel.js';

let getDateWithoutTZ = (date, format = true) => {
	if (typeof date === 'string') date = date.replace('.000000Z', '');
	date = moment(date).toDate();
	return date;
};


let getFIOById = (employees, id, fullFlag = false) => {
	const employee = _.find(employees, d => d.id === id) || null;
	if (!employee) return '';
	let result = employee.last_name + ' ';
	result += fullFlag ? `${employee.first_name} ${employee.middle_name}` : `${employee.first_name[0]}. ${employee.middle_name[0]}.`;
	return result;
};

let getDriverById = (drivers, id) => {
	return _.find(drivers, d => d.id === id) || {};
};

let getCarById = (cars, id) => {
	return _.find(cars, c => c.asuods_id === id) || {};
};

let validateRequired = (field, data) => {
	if (typeof data === 'string' && data.length === 0) {
		return 'Поле должно быть заполнено';
	}
	return typeof data === 'undefined' || data === null ? 'Поле должно быть заполнено' : void 0;
};

let validateMission = (mission, errors) => {
	let missionErrors = _.clone(errors);

	_.each(missionSchema.properties, prop => {
		missionErrors[prop.key] = validateRow(prop, mission[prop.key]);
	});

	if (isEmpty(mission.odometr_start) && isEmpty(mission.motohours_start)) {
		missionErrors.odometr_start = `Одно из полей "Одометр.Выезд"/"Счетчик моточасов.Выезд" должно быть заполнено`;
		missionErrors.motohours_start = `Одно из полей "Одометр.Выезд"/"Счетчик моточасов.Выезд" должно быть заполнено`;
	}

	return missionErrors;
};

let validateClosingMission = (mission, errors) => {
	let missionErrors = _.clone(errors);

	_.each(missionClosingSchema.properties, prop => {
		missionErrors[prop.key] = validateRow(prop, mission[prop.key]);
	});

	return missionErrors;
};

const formStages = ['creating', 'post-creating', 'display', 'closing'];

class MissionFormWrap extends Component {
	constructor(props) {
		super(props);

		this.state = {
			formStage: formStages[0],
			formState: null,
			formErrors: {},
			canSave: false,
			canPrint: false
		};
	}

	componentWillReceiveProps(props) {

		if (props.showForm && props.showForm !== this.props.showForm) {
			if (props.mission === null ) {
				const defaultMission = getDefaultMission();
				this.setState({
					formState: defaultMission,
					formStage: formStages[0],
					canSave: true,
					//formErrors: validateMission(defaultMission, {}),
				})
			} else {
				let _mission = _.clone(props.mission);

				this.setState({
					formState: _mission,
					formStage: formStages[2],
					//formErrors: validateClosingMission(_mission, {}),
					canSave: true,
				});
			}
		}

	}


	handleFormStateChange(field, e) {
		console.log('mission form changed', field, e)
		const value = !!e.target ? e.target.value : e;
		let { formState, formStage, formErrors } = this.state;
		let newState = {};
		formState[field] = value;

		// validation
		if (formStage === 'creating' || formStage === 'post-creating') {
			formErrors = validateMission(formState, formErrors);
		} else if (formStage === 'closing') {
			formErrors = validateClosingMission(formState, formErrors);
		}

		// /validation
		newState.canSave = _(formErrors).map(v => !!v).filter(e => e === true).value().length === 0;

		console.log(formErrors);
		newState.formState = formState;
		newState.formErrors = formErrors;
		newState.formStage = formStage;

		this.setState(newState);
	}

	handleFormSubmit(formState) {
		//let billStatus = formState.status;
		let stage = this.state.formStage;
		const { flux } = this.context;

		//if (stage === 'creating') {
			//formState.status = 'draft';
			flux.getActions('missions').createMission(formState);
			this.props.onFormHide();
		//}

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

MissionFormWrap.contextTypes = {
	flux: React.PropTypes.object,
	setLoading: React.PropTypes.func,
};

export default MissionFormWrap;
