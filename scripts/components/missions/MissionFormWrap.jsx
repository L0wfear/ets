import React from 'react';
import _ from 'lodash';
import Div from '../ui/Div.jsx';
import MissionForm from './MissionForm.jsx';
import FormWrap from '../compositions/FormWrap.jsx';
import { getDefaultMission } from '../../stores/MissionsStore.js';
import { isEmpty, saveData } from 'utils/functions';
import { missionSchema } from '../models/MissionModel.js';

class MissionFormWrap extends FormWrap {

	constructor(props) {
		super(props);

		this.schema = missionSchema;
	}

	componentWillReceiveProps(props) {
		if (props.showForm && (props.showForm !== this.props.showForm)) {
			let mission = props.element === null ? getDefaultMission() : _.clone(props.element);
			let formErrors = this.validate(mission, {});
			this.setState({
				formState: mission,
				canSave: !(!!_.filter(formErrors)).length,
				formErrors
			});
		}
	}

	handlePrint() {
		let f = this.state.formState;
		const { flux } = window.__ETS_CONTAINER__;

		global.map.once('postcompose', function(event) {
			let routeImageBase64Data = event.context.canvas.toDataURL('image/png');
			flux.getActions('missions').printMission(f.id, routeImageBase64Data).then(blob => {
				saveData(blob, `Задание №${f.number}.docx`); // перенести отсюда
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

		return (
			<Div hidden={!this.props.showForm}>
				<MissionForm formState = {this.state.formState}
    								 onSubmit={this.handleFormSubmit.bind(this)}
										 handleFormChange={this.handleFormStateChange.bind(this)}
										 handlePrint={this.handlePrint.bind(this)}
										 show={this.props.showForm}
										 onHide={this.props.onFormHide}
										 fromWaybill={this.props.fromWaybill}
										 {...this.state}/>
			</Div>
		)

	}

}

export default MissionFormWrap;
