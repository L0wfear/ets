import React, {Component} from 'react';
import connectToStores from 'flummox/connect';
import { Modal, Row, Col, FormControls, Button, DropdownButton, Dropdown, Glyphicon, MenuItem, Input } from 'react-bootstrap';
import Datepicker from '../ui/DatePicker.jsx';
import Field from '../ui/Field.jsx';
import Div from '../ui/Div.jsx';
import moment from 'moment';
import cx from 'classnames';
import Form from '../compositions/Form.jsx';
import MonitorPage from '../monitor/MonitorPage.jsx';

export class MissionForm extends Form {

	constructor(props) {
		super(props);

		this.state = {
		};
	}

	render() {

		let state = this.props.formState;
		let errors = this.props.formErrors;
    let title = '';

		return (
			<Modal {...this.props} bsSize="large">

				<Modal.Header closeButton>
	          <Modal.Title id="contained-modal-title-lg">{title}</Modal.Title>
				</Modal.Header>

	      <Modal.Body>
          <Div className="monitor-dashboard">
	      	  <MonitorPage/>
          </Div>

	      </Modal.Body>

	      <Modal.Footer>
					<Div className="inline-block">
		      	<Button onClick={this.handleSubmit.bind(this)}>Сохранить</Button>
					</Div>
	      </Modal.Footer>
			</Modal>
		)
	}
}

export default connectToStores(MissionForm, ['objects']);
