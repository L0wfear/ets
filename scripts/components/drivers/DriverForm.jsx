import React, {Component} from 'react';
import connectToStores from 'flummox/connect';
import { Modal, Input, Label, Row, Col, FormControls, Button, DropdownButton, Dropdown, MenuItem, Glyphicon } from 'react-bootstrap';
import EtsSelect from '../ui/EtsSelect.jsx';
import Datepicker from '../ui/DatePicker.jsx';
import moment from 'moment';
import Div from '../ui/Div.jsx';
import Field from '../ui/Field.jsx';
import Form from '../compositions/Form.jsx';


class DriverForm extends Form {

	constructor(props) {
		super(props);

		this.state = {
      cars: [],
			companyStructureList: [],
		}
	}

	async componentDidMount() {
		const { flux } = this.context;
		flux.getActions('objects').getCars();
		let companyStructureList = await flux.getActions('company-structure').getLinearCompanyStructureForUser();
		this.setState({companyStructureList});
	}

	render() {

		let state = this.props.formState;
		const { carsList = [], positionsList = [] } = this.props;
		const { companyStructureList = [] } = this.state;
		const CARS = carsList.map( c => ({value: c.asuods_id, label: `${c.gov_number} [${c.model_name}]`}));
		const COMPANY_ELEMENTS = companyStructureList.map(el => ({value: el.id, label: el.name}));
		const DRIVER_STATES = [{value: 1, label: 'Работает'}, {value: 0, label: 'Не работает'}];
    const POSITION_ELEMENTS = positionsList.map(el => ({value: el.id, label: el.position}));

    console.log('form state is ', state);

    let valueActive;
    if (state.active != undefined) {
      valueActive = state.active ?  1 :  0;
    }

    const IS_CREATING = !!!state.id;

    let title = 'Изменение сотрудника';

    if (IS_CREATING) title = 'Создание сотрудника';

		return (
			<Modal {...this.props} bsSize="large" >
				<Modal.Header closeButton>
					<Modal.Title id="contained-modal-title-lg">{ title }</Modal.Title>
				</Modal.Header>

	      <Modal.Body>

					<Row>

						<Col md={6}>
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
								<Datepicker date={state['birthday']} time={false} onChange={this.handleChange.bind(this, 'birthday')}/>
							</Div>
							<Div>
								<label>Телефон</label>
								<Input type="text" value={state['phone']} onChange={this.handleChange.bind(this, 'phone')}/>
							</Div>
							<Field type="select" label="Должность"
									options={POSITION_ELEMENTS}
									value={state.position_id}
									onChange={this.handleChange.bind(this, 'position_id')}/>
						</Col>

						<Col md={6}>
							<Field type="select" label="Подразделение"
									options={COMPANY_ELEMENTS}
									value={state.company_structure_id}
									onChange={this.handleChange.bind(this, 'company_structure_id')}/>
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
								<EtsSelect options={DRIVER_STATES} value={valueActive} onChange={this.handleChange.bind(this, 'active')}/>
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
