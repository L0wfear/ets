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
		let data = {mission_id: f.id};

		global.map.once('postcompose', function(event) {
			let routeImageBase64Data = event.context.canvas.toDataURL('image/png');
			data.image = routeImageBase64Data;
			flux.getActions('missions').printMission(data).then(blob => {
				saveData(blob, `Задание №${f.number}.docx`);
			});
    });
		global.map.render();
	}

	async handleFormSubmit(formState) {
		const { flux } = this.context;
		let result;

		if (isEmpty(formState.id)) {
			result = await flux.getActions('missions').createMission(formState, !this.props.fromWaybill);
		} else {
			await flux.getActions('missions').updateMission(formState);
		}

		this.props.onFormHide(result);

		return;
	}

	render() {

		let props = {
			show: this.props.showForm,
			onHide: this.props.onFormHide,
			fromWaybill: this.props.fromWaybill,
			waybillStartDate: this.props.waybillStartDate,
			waybillEndDate: this.props.waybillEndDate,
		};

		return (
			<Div hidden={!this.props.showForm}>
				<MissionForm formState = {this.state.formState}
    								 onSubmit={this.handleFormSubmit.bind(this)}
										 handleFormChange={this.handleFormStateChange.bind(this)}
										 handlePrint={this.handlePrint.bind(this)}
										 {...props}
										 {...this.state}/>
			</Div>
		)

	}

}

export default MissionFormWrap;
