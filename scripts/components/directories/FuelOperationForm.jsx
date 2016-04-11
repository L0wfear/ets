import React, {Component} from 'react';
import { Modal, Input, Label, Row, Col, FormControls, Button, DropdownButton, Dropdown, MenuItem, Glyphicon } from 'react-bootstrap';
import Div from '../ui/Div.jsx';
import Field from '../ui/Field.jsx';
import Form from 'compositions/Form.jsx';

export default class FuelOperationForm extends Form {

	constructor(props) {
		super(props);
	}

	render() {
		let state = this.props.formState;

		return (
			<Modal {...this.props}>
				<Modal.Header closeButton>
					<Modal.Title id="contained-modal-title-lg">{!state.ID ? 'Добавление' : 'Изменение'} операции для расчета топлива</Modal.Title>
				</Modal.Header>

	      <Modal.Body>

		      <Row>

		      	<Col md={6}>
							<Field type="string" label="Операция"
										 value={state.NAME} onChange={this.handleChange.bind(this, 'NAME')} />
		      	</Col>

	        </Row>

	      </Modal.Body>

	      <Modal.Footer>
	      	<Button onClick={this.handleSubmit.bind(this)}>Сохранить</Button>
	      </Modal.Footer>

			</Modal>
		);
	}
	
}
