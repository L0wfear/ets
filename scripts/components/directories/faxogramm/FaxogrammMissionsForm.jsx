import React, {Component} from 'react';
import { Modal, Input, Label, Row, Col, FormControls, Button, DropdownButton, Dropdown, MenuItem, Glyphicon, Checkbox } from 'react-bootstrap';
import EtsSelect from '../../ui/EtsSelect.jsx';
import Datepicker from '../../ui/DatePicker.jsx';
import moment from 'moment';
import Div from '../../ui/Div.jsx';
import Form from '../../compositions/Form.jsx';
import _ from 'lodash';
import connectToStores from 'flummox/connect';
import MissionTemplatesJournal from '../../missions/MissionTemplatesJournal.jsx';

class FaxogrammMissionsForm extends Form {

	constructor(props) {
		super(props);

		this.state = {
		}
	}

	componentDidMount() {
		const { flux } = this.context;
		let state = this.props.formState;
		flux.getActions('missions').getMissionTemplates({ faxogramm_id: state.id });
	}

	render() {

		let state = this.props.formState;
    let payload = { faxogramm_id: state.id };
		let hasMissionTemplates = this.props.missionTemplatesList.length;

		return (
			<Modal {...this.props} bsSize="large" backdrop="static">

				<Modal.Header closeButton>
					<Modal.Title id="contained-modal-title-lg">Создание заданий</Modal.Title>
				</Modal.Header>

	      <Modal.Body>
          {hasMissionTemplates ? <MissionTemplatesJournal
							payload={payload}
							noFilter={true}
							onListStateChange={this.handleChange.bind(this, 'missionJournalState')} /> : 'Для выбранной факсограммы нет подходящих шаблонов-заданий'}
	      </Modal.Body>

	      <Modal.Footer>
          <Div className="inline-block assignToWaybillCheck">
            <label>Создать черновик ПЛ / Добавить в существующий</label>
            <Input type="checkbox" value={state.assign_to_waybill} onClick={this.handleChange.bind(this, 'assign_to_waybill', !!!state.assign_to_waybill)}/>
          </Div>
	      	<Button disabled={!state.missionJournalState || !_.keys(state.missionJournalState.checkedMissions).length} onClick={this.handleSubmit.bind(this)}>Сохранить</Button>
	      </Modal.Footer>

			</Modal>
		)
	}
}

export default connectToStores(FaxogrammMissionsForm, ['objects', 'missions']);
