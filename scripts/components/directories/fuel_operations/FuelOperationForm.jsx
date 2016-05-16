import React, {Component} from 'react';
import { Modal, Input, Label, Row, Col, FormControls, Button, DropdownButton, Dropdown, MenuItem, Glyphicon } from 'react-bootstrap';
import Div from '../../ui/Div.jsx';
import Field from '../../ui/Field.jsx';
import Form from 'compositions/Form.jsx';

export default class FuelOperationForm extends Form {

	constructor(props) {
		super(props);
	}

	render() {
		let state = this.props.formState;
		let errors = this.props.formErrors;

		return (
			<Modal {...this.props} backdrop="static">
				<Modal.Header closeButton>
					<Modal.Title id="contained-modal-title-lg">{!state.id ? 'Добавление' : 'Изменение'} операции для расчета топлива</Modal.Title>
				</Modal.Header>

	      <Modal.Body>

		      <Row>

		      	<Col md={6}>
							<Field
								type="string"
								label="Операция"
								value={state.name}
								error={errors['name']}
								onChange={this.handleChange.bind(this, 'name')} />
							<label>Для спецоборудования</label><input type="checkbox" style={{marginLeft:"10px"}} checked={!!state.equipment} onClick={this.handleChange.bind(this, 'equipment', !!!state.equipment)} />
		      	</Col>

	        </Row>

	      </Modal.Body>

	      <Modal.Footer>
	      	<Button onClick={this.handleSubmit.bind(this)} disabled={!this.props.canSave}>Сохранить</Button>
	      </Modal.Footer>

			</Modal>
		);
	}

}
