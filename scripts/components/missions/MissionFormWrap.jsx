import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import Div from '../ui/Div.jsx';
import MissionForm from './MissionForm.jsx';
import FormWrap from '../compositions/FormWrap.jsx';
import { validateRow } from 'validate/validateRow.js';
import { getDefaultMission } from '../../stores/MissionsStore.js';
import { isEmpty, saveData, printData } from 'utils/functions';
import { missionSchema } from '../models/MissionModel.js';

class MissionFormWrap extends FormWrap {

	constructor(props, context) {
		super(props);

		this.schema = missionSchema;
		this.createAction = (formState) => {
			return context.flux.getActions('missions').createMission(formState, !this.props.fromWaybill);
		};
		this.updateAction = context.flux.getActions('missions').updateMission;
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

	validate(formState, errors) {
		let formErrors = _.clone(errors);
		_.each(missionSchema.properties, prop => {
			formErrors[prop.key] = validateRow(prop, formState[prop.key]);
		});

		formErrors.date_start = ''
		formErrors.date_end = ''

		if (formState.date_start && formState.date_end) {
			if (moment(formState.date_end).toDate().getTime() < moment(formState.date_start).toDate().getTime()) {
				formErrors.date_end = `Неправильно указана дата`;
			}
		} else if (formState.date_end) {
			formErrors.date_start = `Дата должна быть указана`;
		} else if (formState.date_start) {
			formErrors.date_end = `Дата должна быть указана`;
		} else {
			formErrors.date_start = `Даты должны быть указаны`;
		}
		return formErrors;
	}

	handleFormStateChange(field, e) {
		const value = e !== undefined && e !== null && !!e.target ? e.target.value : e;
		console.info('Form changed', field, value);
		let { formErrors } = this.state;
		let formState = _.cloneDeep(this.state.formState);
		let newState = {};
		formState[field] = value;

		formErrors = this.validate(formState, formErrors);
		newState.canSave = _(formErrors).map(v => !!v).filter(e => e === true).value().length === 0;

		newState.formState = formState;
		newState.formErrors = formErrors;


		this.setState(newState);
	}

	handlePrint(event, print_form_type = 1) {
		let f = this.state.formState;
		const { flux } = window.__ETS_CONTAINER__;
		let data = {mission_id: f.id};

		global.map.once('postcompose', function(event) {
			let routeImageBase64Data = event.context.canvas.toDataURL('image/png');
			data.image = routeImageBase64Data;
			flux.getActions('missions').printMission(data).then(blob => {
				print_form_type === 1 ? saveData(blob, `Задание №${f.number}.pdf`) : printData(blob);
			});
		});
		global.map.render();
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
				<MissionForm
						formState = {this.state.formState}
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
