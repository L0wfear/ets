import React, {Component} from 'react';
import { Modal, Input, Label, Row, Col, FormControls, Button, DropdownButton, Dropdown, MenuItem, Glyphicon } from 'react-bootstrap';
import EtsSelect from '../ui/EtsSelect.jsx';
import Datepicker from '../ui/DatePicker.jsx';
import moment from 'moment';
import Div from '../ui/Div.jsx';
import { getCarById, getCars } from '../../../mocks/krylatskoe_cars.js';
import { getCarImage } from '../../adapter.js';
import { getModelById } from '../../models.js';
import { getStatusById } from '../../statuses.js';
import { getTypeById } from '../../types.js';
import { getOwnerById } from '../../owners.js';
import config from '../../config.js';

export default class FuelRateForm extends Component {

	constructor(props) {
		super(props);

		this.state = {
		}
	}

	handleChange(field, e) {
		this.props.handleFormChange(field, e);
	}

  handleSubmit() {
    console.log('submitting fuelRate form', this.props.formState);
    this.props.onSubmit(this.props.formState);
  }

	componentDidMount() {
    const fuelRate = this.props.formState;
	}

	render() {

		let state = this.props.formState;

    console.log('form state is ', state);

		return (
			<Modal {...this.props}>
				<Modal.Header closeButton>
	          <Modal.Title id="contained-modal-title-lg">{this.props.isNew ? 'Добавление' : 'Изменение'} нормы расхода топлива</Modal.Title>
				</Modal.Header>

	      <Modal.Body>

	      <Row>

	      	<Col md={6}>
            <Div>
  	      		<label>Дата приказа</label>
              <Datepicker date={new Date(state.date)} onChange={this.handleChange.bind(this, 'date')} time={false}/>
            </Div>
            <Div>
  	      		<label>Операция</label>
              <EtsSelect options={this.props.operations.map( op => ({value: op.ID, label: op.NAME}))} value={state.operation_id} onChange={this.handleChange.bind(this, 'operation_id')}/>
            </Div>
            <Div>
  	      		<label>Норма для летнего периода</label>
              <input type="number" value={state.rate_summer} onChange={this.handleChange.bind(this, 'rate_summer')}/>
            </Div>
            <Div>
  	      		<label>Норма для зимнего периода</label>
              <input type="number" value={state.rate_winter} onChange={this.handleChange.bind(this, 'rate_winter')}/>
            </Div>
            <Div>
  	      		<label>Модель транспортного средства</label>
              <EtsSelect options={this.props.models.map( m => ({value: m.id, label: m.title}))} value={state.model_id} onChange={this.handleChange.bind(this, 'model_id')}/>
            </Div>
	      	</Col>

	      	<Col md={6}>
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
