import React, {Component} from 'react';
import connectToStores from 'flummox/connect';
import { Modal, Row, Col, FormControls, Button, DropdownButton, Dropdown, Glyphicon, MenuItem } from 'react-bootstrap';
import Datepicker from './ui/DatePicker.jsx';
import Field from './ui/Field.jsx';
import Div from './ui/Div.jsx';
import moment from 'moment';
import { getFuelOperations, getFuelRatesByCarModel } from '../adapter.js';
import cx from 'classnames';
import { getDateWithoutTZ } from '../utils/dates.js';

class MissionForm extends Component {

	constructor(props) {
		super(props);

		this.state = {
			operations: [],
			fuelRates: [],
			fuel_correction_rate: null,
		}
	}

	handleChange(field, e) {
		this.props.handleFormChange(field, e);
	}

  handleSubmit() {
    console.log('submitting mission form', this.props.formState);
    this.props.onSubmit(this.props.formState);
  }

	render() {

		let state = this.props.formState;
    let stage = this.props.formStage;
		let errors = this.props.formErrors;

		const { workKindsList = [], techOperationsList = [], missionSourcesList = [], routesList = [], carsList = [] } = this.props;

    const WORK_KINDS = workKindsList.map(({id, name}) => ({value: id, label: name}));
    const TECH_OPERATIONS = techOperationsList.map(({id, name}) => ({value: id, label: name}));
    const MISSION_SOURCES = missionSourcesList.map(({id, name}) => ({value: id, label: name}));
    const ROUTES = routesList.map(({id, name}) => ({value: id, label: name}));
		const CARS = carsList.map( c => ({value: c.asuods_id, label: c.gov_number + ' [' + c.model + ']'}));

    console.log('form stage is ', stage, 'form state is ', state);

		let IS_CREATING = stage === 'creating';
		let IS_CLOSING = stage === 'closing';
    let IS_POST_CREATING = stage === 'post-creating'
		let IS_DISPLAY = stage === 'display';

    let title = `Задание № ${state.number || ''}`;

    if (IS_CREATING) {
      title = "Создание задания"
    }

		return (
			<Modal {...this.props} bsSize="large">

				<Modal.Header closeButton>
	          <Modal.Title id="contained-modal-title-lg">{title}</Modal.Title>
				</Modal.Header>

	      <Modal.Body>

		      <Row>
		      	<Col md={6}>
		      		{/*Организация: АвД Жилищник "Крылатское" <br/>*/}
		      	</Col>
		      </Row>

					<Row>
						<Col md={6}>
              <Field type="select" label="Технологическая операция" error={errors['technical_operation_id']}
                      options={TECH_OPERATIONS}
                      value={state.technical_operation_id}
                      onChange={this.handleChange.bind(this, 'technical_operation_id')}/>
						</Col>

				 		<Col md={3}>
				   		<label>Время выполнения</label>
				 			<Div>c <Datepicker date={ getDateWithoutTZ(state.plan_departure_date) } onChange={this.handleChange.bind(this, 'plan_departure_date')}/></Div>
				   	</Col>
				   	<Col md={3}>
              <label style={{minHeight: 15}}></label>
				 			<Div>по <Datepicker date={ getDateWithoutTZ(state.plan_departure_date) } onChange={this.handleChange.bind(this, 'plan_departure_date')}/></Div>
				   	</Col>
					</Row>

	      	<Row>
	      		<Col md={6}>
              <Field type="number" label="Количество проходов" error={errors['passes_count']}
  									 value={state.passes_count} onChange={this.handleChange.bind(this, 'passes_count')} />
	          </Col>
	      		<Col md={6}>
              <Field type="select" label="Источник получения задания" error={errors['mission_source_id']}
                     options={MISSION_SOURCES}
                     value={state.mission_source_id}
                     onChange={this.handleChange.bind(this, 'mission_source_id')}/>

 							<Field type="select" label="Транспортное средство" error={errors['car_id']}
 											options={CARS}
 											value={state.car_id}
 											onChange={this.handleChange.bind(this, 'car_id')}/>
	      		</Col>
	      	</Row>

	      	<Row>
            <Col md={6}>
              <Field type="select" label="Маршрут" error={errors['route_id']}
                     options={ROUTES}
                     value={state.route_id}
                     onChange={this.handleChange.bind(this, 'route_id')}/>
            </Col>
            <Col md={6}>
            {/*КАРТА*/}
            </Col>
	      	</Row>

	      </Modal.Body>

	      <Modal.Footer>
					<Div hidden={state.status === 'closed'}>
						<Dropdown id="waybill-print-dropdown" disabled={!this.props.canSave} onSelect={this.props.handlePrint}>
							<Dropdown.Toggle  disabled={true}>
								<Glyphicon glyph="print" /> Печать
							</Dropdown.Toggle>
							<Dropdown.Menu>
								<MenuItem eventKey={1}>Форма 3-С</MenuItem>
								<MenuItem eventKey={2}>Форма 4-П</MenuItem>
							</Dropdown.Menu>
						</Dropdown>&nbsp;
		      	<Button onClick={this.handleSubmit.bind(this)} disabled={!this.props.canSave}>{'Сохранить'}</Button>
					</Div>
	      </Modal.Footer>

			</Modal>
		)
	}
}

MissionForm.contextTypes = {
	flux: React.PropTypes.object,
};

export default connectToStores(MissionForm, ['objects', 'employees', 'missions']);
