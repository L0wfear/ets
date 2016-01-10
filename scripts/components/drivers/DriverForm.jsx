import React, {Component} from 'react';
import { Modal, Input, Label, Row, Col, FormControls, Button, DropdownButton, Dropdown, MenuItem, Glyphicon } from 'react-bootstrap';
import EtsSelect from '../ui/EtsSelect.jsx';
import Datepicker from '../ui/DatePicker.jsx';
import moment from 'moment';
import Div from '../ui/Div.jsx';
import { getCarById, getCars } from '../../../mocks/krylatskoe_cars.js';

const DRIVER_STATES = ['Работает', 'Не работает'].map( el => ({value: el, label: el}));

export default class DriverForm extends Component {

	constructor(props) {
		super(props);

		this.state = {
      cars: [],
		}
	}

	handleChange(field, e) {
		this.props.handleFormChange(field, e);
	}

  handleSubmit() {
    console.log('submitting driver form', this.props.formState);
    this.props.onSubmit(this.props.formState);
  }

	componentDidMount() {
		getCars().then((cars) => this.setState({cars}));
	}

	render() {

		let state = this.props.formState;
    let stage = this.props.formStage;

    console.log('form stage is ', stage, 'form state is ', state);

		return (
			<Modal {...this.props} bsSize="large" >
				<Modal.Header closeButton>
	          <Modal.Title id="contained-modal-title-lg">Изменение сотрудника {/*`${state['Фамилия']} ${state['Имя']} ${state['Отчество']}`*/}</Modal.Title>
				</Modal.Header>

	      <Modal.Body>

	      <Row>

	      	<Col md={6}>
            <Div>
              <label>Организация</label> {state['Организация']}
            </Div>
            <Div>
  	      		<label>Фамилия</label>
              <Input type="text" value={state['Фамилия']} onChange={this.handleChange.bind(this, 'Фамилия')}/>
  	      	</Div>
            <Div>
              <label>Имя</label>
              <Input type="text" value={state['Имя']} onChange={this.handleChange.bind(this, 'Имя')}/>
  	      	</Div>
            <Div>
              <label>Отчество</label>
              <Input type="text" value={state['Отчество']} onChange={this.handleChange.bind(this, 'Отчество')}/>
  	      	</Div>
            <Div>
  	      		<label>Дата рождения</label>
              <Datepicker date={new Date(state['Дата рождения'])} onChange={this.handleChange.bind(this, 'Дата рождения')}/>
  	      	</Div>
            <Div>
              <label>Телефон</label>
              <Input type="text" value={state['Телефон']} onChange={this.handleChange.bind(this, 'Телефон')}/>
  	      	</Div>
	      	</Col>

	      	<Col md={6}>
            <Div style={{marginTop: 25}}>
	      		  <label>Табельный номер</label>
              <Input type="number" value={state['Табельный номер']} onChange={this.handleChange.bind(this, 'Табельный номер')}/>
            </Div>
  	      	<Div>
              <label>Водительское удостоверение</label>
              <Input type="text" value={state['Водительское удостоверение']} onChange={this.handleChange.bind(this, 'Водительское удостоверение')}/>
  	      	</Div>
  	      	<Div>
              <label>Предпочитаемое ТрС</label>
              <EtsSelect options={this.state.cars} value={state['Предпочитаемое ТрС']} onChange={this.handleChange.bind(this, 'Предпочитаемое ТрС')}/>
  	      	</Div>
            <Div>
              <label>Состояние</label>
              <EtsSelect options={DRIVER_STATES} value={state['Текущее состояние']} onChange={this.handleChange.bind(this, 'Текущее состояние')}/>
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
