import React from 'react';
import _ from 'lodash';
import Div from '../ui/Div.jsx';
import CompanyStructureForm from './CompanyStructureForm.jsx';
import FormWrap from '../compositions/FormWrap.jsx';
import { getDefaultMission } from '../../stores/MissionsStore.js';
import { isEmpty, saveData } from 'utils/functions';
import { missionSchema } from '../models/MissionModel.js';

class CompanyStructureFormWrap extends FormWrap {

	constructor(props) {
		super(props);
	}

	// componentWillReceiveProps(props) {
	// 	if (props.showForm && (props.showForm !== this.props.showForm)) {
	// 		let mission = props.element === null ? getDefaultMission() : _.clone(props.element);
	// 		let formErrors = this.validate(mission, {});
	// 		this.setState({
	// 			formState: mission,
	// 			canSave: !(!!_.filter(formErrors)).length,
	// 			formErrors
	// 		});
	// 	}
	// }

	async handleFormSubmit(formState) {
		const { flux } = this.context;

		if (isEmpty(formState.id)) {
			await flux.getActions('company-structure').createCompanyElement(formState);
		} else {
			await flux.getActions('company-structure').updateCompanyElement(formState);
		}

		this.props.onFormHide(true);
	}

	render() {

		return (
			<Div hidden={!this.props.showForm}>
				<CompanyStructureForm onSubmit={this.handleFormSubmit.bind(this)}
          										 handleFormChange={this.handleFormStateChange.bind(this)}
          										 show={this.props.showForm}
          										 onHide={this.props.onFormHide}
          										 {...this.state}/>
			</Div>
		)

	}

}

export default CompanyStructureFormWrap;
