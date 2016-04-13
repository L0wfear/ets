import React, {Component} from 'react';
import { Modal, Input, Label, Row, Col, FormControls, Button, DropdownButton, Dropdown, MenuItem, Glyphicon } from 'react-bootstrap';
import EtsSelect from '../ui/EtsSelect.jsx';
import Datepicker from '../ui/DatePicker.jsx';
import moment from 'moment';
import Div from '../ui/Div.jsx';
import Field from '../ui/Field.jsx';
import config from '../../config.js';
import Form from 'compositions/Form.jsx';
import connectToStores from 'flummox/connect';

class FuelRateForm extends Form {

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.context.flux.getActions('fuel-rates').getFuelOperations();
		this.context.flux.getActions('objects').getModels();
	}

	render() {

		let state = this.props.formState;
		const { modelsList = [], operations = [] } = this.props;
		const MODELS = modelsList.map( m => ({value: m.id, label: m.title}));
		const OPERATIONS = operations.map(op => ({value: op.id, label: op.name}));

    console.log('form state is ', state);

		return (
			<Modal {...this.props}>
				<Modal.Header closeButton>
					<Modal.Title id="contained-modal-title-lg">{!state.id ? 'Добавление' : 'Изменение'} нормы расхода топлива</Modal.Title>
				</Modal.Header>

	      <Modal.Body>

		      <Row>

		      	<Col md={6}>
	            <Div>
	  	      		<label>Дата приказа</label>
	              <Datepicker date={new Date(state.order_date)} onChange={this.handleChange.bind(this, 'order_date')} time={false}/>
	            </Div>
	            <Div>
	  	      		<label>Операция</label>
	              <EtsSelect options={OPERATIONS} value={state.operation_id} onChange={this.handleChange.bind(this, 'operation_id')}/>
	            </Div>
	            <Div>
	  	      		<label>Норма для летнего периода</label>
	              <input type="number" value={state.summer_rate} onChange={this.handleChange.bind(this, 'summer_rate')}/>
	            </Div>
	            <Div>
	  	      		<label>Норма для зимнего периода</label>
	              <input type="number" value={state.winter_rate} onChange={this.handleChange.bind(this, 'winter_rate')}/>
	            </Div>
	            <Div>
	  	      		<label>Марка шасси</label>
	              <EtsSelect options={MODELS} value={state.car_model_id} onChange={this.handleChange.bind(this, 'car_model_id')}/>
	            </Div>
		      	</Col>

	        </Row>

	      </Modal.Body>

	      <Modal.Footer>
	      	<Button onClick={this.handleSubmit.bind(this)}>Сохранить</Button>
	      </Modal.Footer>

			</Modal>
		)
	}
}

export default connectToStores(FuelRateForm, ['fuel-rates', 'objects']);
