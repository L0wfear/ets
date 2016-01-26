import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import Div from './ui/Div.jsx';
import MissionForm from './MissionForm.jsx';
import { getDefaultMission } from '../stores/MissionsStore.js';
import { isNotNull, isEmpty } from '../utils/functions.js';
import { validateRow } from '../validate/validateRow.js';
import { missionSchema, missionClosingSchema } from './models/MissionModel.js';

let validateMission = (mission, errors) => {
	let missionErrors = _.clone(errors);

	_.each(missionSchema.properties, prop => {
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
					canSave: false,
					formErrors: validateMission(defaultMission, {}),
				})
			} else {
				let _mission = _.clone(props.mission);

				this.setState({
					formState: _mission,
					formStage: formStages[2],
					//formErrors: validateMission(defaultMission, {}),
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

		formErrors = validateMission(formState, formErrors);
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
