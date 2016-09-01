import React, { Component } from 'react';
import { Modal, Input, Label, Row, Col, FormControls, Button, DropdownButton, Dropdown, MenuItem, Glyphicon } from 'react-bootstrap';
import Div from 'components/ui/Div.jsx';
import Field from 'components/ui/Field.jsx';
import Form from '../../compositions/Form.jsx';

export default class ODHNormForm extends Form {

	constructor(props) {
		super(props);
	}

	render() {

		let state = this.props.formState;
		let errors = this.props.formErrors;
		const IS_CREATING = !!!state.id;
    const title = IS_CREATING ? 'Добавление норматива по содержанию ОДХ' : 'Изменение норматива по содержанию ОДХ';

		return (
			<Modal {...this.props} backdrop="static">
				<Modal.Header closeButton>
					<Modal.Title id="contained-modal-title-lg">{ title }</Modal.Title>
				</Modal.Header>
	      <Modal.Body>
					<Div>
						<Field
								type="string"
								label="Норматив"
								value={state['name']}
								error={errors['name']}
								onChange={this.handleChange.bind(this, 'name')} />
					</Div>
					<Div>
						<Field
								type="string"
								label="Единица измерения"
								value={state['unit']}
								error={errors['unit']}
								onChange={this.handleChange.bind(this, 'unit')} />
					</Div>
					<Div>
						<Field
								type="boolean"
								label="Расходный материал"
								value={state['expendable']}
								error={errors['expendable']}
								onChange={this.handleChange.bind(this, 'expendable', !!!state['expendable'])} />
					</Div>
	      </Modal.Body>
	      <Modal.Footer>
	      	<Button disabled={!this.props.canSave} onClick={this.handleSubmit.bind(this)}>Сохранить</Button>
	      </Modal.Footer>
			</Modal>
		)
	}
}
