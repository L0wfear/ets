import React, {Component} from 'react';
import connectToStores from 'flummox/connect';
import { Modal, Input, Label, Row, Col, FormControls, Button, DropdownButton, Dropdown, MenuItem, Glyphicon } from 'react-bootstrap';
import EtsSelect from '../ui/EtsSelect.jsx';
import Datepicker from '../ui/DatePicker.jsx';
import moment from 'moment';
import Div from '../ui/Div.jsx';

const DRIVER_STATES = ['Работает', 'Не работает'].map( el => ({value: +!!(el.indexOf(' ') === -1), label: el}));

class DriverForm extends Component {

	constructor(props) {
		super(props);

		this.state = {
      cars: [],
		}
	}

	handleChange(field, e) {
		if (field === 'active') {
			e = !!e;
		}
		this.props.handleFormChange(field, e);
	}

  handleSubmit() {
    console.log('submitting driver form', this.props.formState);
    this.props.onSubmit(this.props.formState);
  }

	render() {

		let state = this.props.formState;
		const { carsList = [] } = this.props;
		const CARS = carsList.map( c => ({value: c.asuods_id, label: c.gov_number + ' [' + c.model + ']'}));

    console.log('form state is ', state);

		return (
			<Modal {...this.props} bsSize="large" >
				<Modal.Header closeButton>
	          <Modal.Title id="contained-modal-title-lg">Изменение сотрудника {/*`${state['Фамилия']} ${state['Имя']} ${state['Отчество']}`*/}</Modal.Title>
				</Modal.Header>

	      <Modal.Body>

	      <Row>

	      	<Col md={6}>
            <Div>
              <label>Организация</label> {state['company_id']}
            </Div>
            <Div>
  	      		<label>Фамилия</label>
              <Input type="text" value={state['last_name']} onChange={this.handleChange.bind(this, 'last_name')}/>
  	      	</Div>
            <Div>
              <label>Имя</label>
              <Input type="text" value={state['first_name']} onChange={this.handleChange.bind(this, 'first_name')}/>
  	      	</Div>
            <Div>
              <label>Отчество</label>
              <Input type="text" value={state['middle_name']} onChange={this.handleChange.bind(this, 'middle_name')}/>
  	      	</Div>
            <Div>
  	      		<label>Дата рождения</label>
              <Datepicker date={new Date(state['birthday'])} time={false} onChange={this.handleChange.bind(this, 'birthday')}/>
  	      	</Div>
            <Div>
              <label>Телефон</label>
              <Input type="text" value={state['phone']} onChange={this.handleChange.bind(this, 'phone')}/>
  	      	</Div>
	      	</Col>

	      	<Col md={6}>
            <Div style={{marginTop: 25}}>
	      		  <label>Табельный номер</label>
              <Input type="number" value={state['personnel_number']} onChange={this.handleChange.bind(this, 'personnel_number')}/>
            </Div>
  	      	<Div>
              <label>Водительское удостоверение</label>
              <Input type="text" value={state['drivers_license']} onChange={this.handleChange.bind(this, 'drivers_license')}/>
  	      	</Div>
  	      	<Div>
              <label>Предпочитаемое ТрС</label>
              <EtsSelect options={CARS} value={state['prefer_car']} onChange={this.handleChange.bind(this, 'prefer_car')}/>
  	      	</Div>
            <Div>
              <label>Состояние</label>
              <EtsSelect options={DRIVER_STATES} value={+state['active']} onChange={this.handleChange.bind(this, 'active')}/>
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

export default connectToStores(DriverForm, ['objects']);
