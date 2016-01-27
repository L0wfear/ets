import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import Div from '../ui/Div.jsx';
import MissionTemplateForm from './MissionTemplateForm.jsx';
import { getDefaultMissionTemplate } from '../../stores/MissionsStore.js';
import { validate as validateNumber} from '../../validate/validateNumber.js';
import { isNotNull, isEmpty } from '../../utils/functions.js';
import { validateRow } from '../../validate/validateRow.js';
import { missionTemplateSchema } from '../models/MissionTemplateModel.js';

let validateMission = (mission, errors) => {
	let missionErrors = _.clone(errors);

	_.each(missionTemplateSchema.properties, prop => {
		missionErrors[prop.key] = validateRow(prop, mission[prop.key]);
	});

	return missionErrors;
};

class MissionFormWrap extends Component {
	constructor(props) {
		super(props);

		this.state = {
			formState: null,
			formErrors: {},
			canSave: false,
			canPrint: false
		};
	}

	componentWillReceiveProps(props) {

		if (props.showForm && props.showForm !== this.props.showForm) {
			if (props.mission === null ) {
				const defaultMission = getDefaultMissionTemplate();
				this.setState({
					formState: defaultMission,
					canSave: false,
					formErrors: validateMission(defaultMission, {}),
				})
			} else {
				let _mission = _.clone(props.mission);

				this.setState({
					formState: _mission,
					formErrors: validateMission(_mission, {}),
					canSave: true,
				});
			}
		}

	}


	handleFormStateChange(field, e) {
		console.log('mission form changed', field, e)
		const value = !!e.target ? e.target.value : e;
		let { formState, formErrors } = this.state;
		let newState = {};
		formState[field] = value;

		formErrors = validateMission(formState, formErrors);
		newState.canSave = _(formErrors).map(v => !!v).filter(e => e === true).value().length === 0;

		console.log(formErrors);
		newState.formState = formState;
		newState.formErrors = formErrors;

		this.setState(newState);
	}

	handleFormSubmit(formState) {
		const { flux } = this.context;
		if (isEmpty(formState.id)) {
			flux.getActions('missions').createMissionTemplate(formState);
		} else {
			flux.getActions('missions').updateMissionTemplate(formState);
		}
		this.props.onFormHide();

		return;
	}

	render() {

		console.log()

		return 	<Div hidden={!this.props.showForm}>
							<MissionTemplateForm formState = {this.state.formState}
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
