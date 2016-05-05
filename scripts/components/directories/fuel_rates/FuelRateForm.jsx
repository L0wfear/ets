import React, {Component} from 'react';
import { Modal, Input, Label, Row, Col, FormControls, Button, DropdownButton, Dropdown, MenuItem, Glyphicon } from 'react-bootstrap';
import EtsSelect from '../../ui/EtsSelect.jsx';
import Datepicker from '../../ui/DatePicker.jsx';
import Div from '../../ui/Div.jsx';
import Field from '../../ui/Field.jsx';
import Form from 'compositions/Form.jsx';
import connectToStores from 'flummox/connect';

class FuelRateForm extends Form {

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.context.flux.getActions('fuel-rates').getFuelOperations();
		this.context.flux.getActions('objects').getModels();
		this.context.flux.getActions('objects').getSpecialModels();
	}

	render() {

		let state = this.props.formState;
		let errors = this.props.formErrors;
		const { modelsList = [], operations = [], specialModelsList = [] } = this.props;
		const MODELS = modelsList.map( m => ({value: m.id, label: m.title}));
		const SPECIALMODELS = specialModelsList.map( m => ({value: m.id, label: m.name}));
		const OPERATIONS = operations.map(op => ({value: op.id, label: op.name})).sort((a,b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase()));

    console.log('form state is ', state);

		return (
			<Modal {...this.props} backdrop="static">
				<Modal.Header closeButton>
					<Modal.Title id="contained-modal-title-lg">{!state.id ? 'Добавление' : 'Изменение'} нормы расхода топлива</Modal.Title>
				</Modal.Header>

	      <Modal.Body>

		      <Row>

		      	<Col md={6}>

							<Field label="Дата приказа"
									type="date"
									date={state.order_date}
									onChange={this.handleChange.bind(this, 'order_date')}
									time={false} />

							<Field label="Операция"
									error={errors['operation_id']}
									type="select"
									options={OPERATIONS}
									clearable={false}
									value={state.operation_id}
									onChange={this.handleChange.bind(this, 'operation_id')} />

							<Field label="Норма для летнего периода"
									type="number"
									error={errors['summer_rate']}
									value={state.summer_rate}
									onChange={this.handleChange.bind(this, 'summer_rate')} />

							<Field label="Норма для зимнего периода"
									type="number"
									error={errors['winter_rate']}
									value={state.winter_rate}
									onChange={this.handleChange.bind(this, 'winter_rate')} />

							<Field label="Модель ТС"
									error={errors['car_special_model_id']}
									type="select"
									options={SPECIALMODELS}
									clearable={false}
									value={state.car_special_model_id}
									onChange={this.handleChange.bind(this, 'car_special_model_id')} />

							<Field label="Марка шасси"
									error={errors['car_model_id']}
									type="select"
									options={MODELS}
									value={state.car_model_id}
									onChange={this.handleChange.bind(this, 'car_model_id')} />

		      	</Col>

	        </Row>

	      </Modal.Body>

	      <Modal.Footer>
	      	<Button disabled={!this.props.canSave} onClick={this.handleSubmit.bind(this)}>Сохранить</Button>
	      </Modal.Footer>

			</Modal>
		)
	}
}

export default connectToStores(FuelRateForm, ['fuel-rates', 'objects']);
