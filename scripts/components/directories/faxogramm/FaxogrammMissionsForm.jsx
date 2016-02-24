import React, {Component} from 'react';
import { Modal, Input, Label, Row, Col, FormControls, Button, DropdownButton, Dropdown, MenuItem, Glyphicon } from 'react-bootstrap';
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
	}

	render() {

		let state = this.props.formState;

		return (
			<Modal {...this.props} bsSize="large">

				<Modal.Header closeButton>
	          <Modal.Title id="contained-modal-title-lg">Создание заданий</Modal.Title>
				</Modal.Header>

	      <Modal.Body>
          <MissionTemplatesJournal noFilter={true} onListStateChange={this.handleChange.bind(this, 'missionJournalState')}/>
	      </Modal.Body>

	      <Modal.Footer>
	      	<Button disabled={!state.missionJournalState || !_.keys(state.missionJournalState.checkedMissions).length} onClick={this.handleSubmit.bind(this)}>Сохранить</Button>
	      </Modal.Footer>

			</Modal>
		)
	}
}

export default connectToStores(FaxogrammMissionsForm, ['objects']);
