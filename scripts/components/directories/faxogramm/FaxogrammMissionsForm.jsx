import React, {Component} from 'react';
import { Modal, Input, Label, Row, Col, FormControls, Button, DropdownButton, Dropdown, MenuItem, Glyphicon, Checkbox } from 'react-bootstrap';
import EtsSelect from 'components/ui/EtsSelect.jsx';
import Datepicker from 'components/ui/DatePicker.jsx';
import moment from 'moment';
import Div from 'components/ui/Div.jsx';
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

	render() {

		let state = this.props.formState;
    let payload = { faxogramm_id: state.id };

		return (
			<Modal {...this.props} bsSize="large" backdrop="static">

				<Modal.Header closeButton>
					<Modal.Title id="contained-modal-title-lg">Создание заданий</Modal.Title>
				</Modal.Header>

	      <Modal.Body>
					<MissionTemplatesJournal
							payload={payload}
							renderOnly={true}
							onListStateChange={this.handleChange.bind(this, 'missionJournalState')} />
	      </Modal.Body>

	      <Modal.Footer>
          <Div className="inline-block assignToWaybillCheck">
            <label>Создать черновик ПЛ / Добавить в существующий</label>
            <Input type="checkbox" value={state.assign_to_waybill} onClick={this.handleChange.bind(this, 'assign_to_waybill', !!!state.assign_to_waybill)}/>
          </Div>
	      	<Button disabled={!state.missionJournalState || !_.keys(state.missionJournalState.checkedElements).length} onClick={this.handleSubmit.bind(this)}>Сохранить</Button>
	      </Modal.Footer>

			</Modal>
		)
	}
}

export default connectToStores(FaxogrammMissionsForm, ['objects', 'missions']);
