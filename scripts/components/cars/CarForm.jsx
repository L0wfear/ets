import React, {Component} from 'react';
import { Modal, Input, Label, Row, Col, FormControls, Button, DropdownButton, Dropdown, MenuItem, Glyphicon } from 'react-bootstrap';
import EtsSelect from '../ui/EtsSelect.jsx';
import Datepicker from '../ui/DatePicker.jsx';
import moment from 'moment';
import Div from '../ui/Div.jsx';
import Field from '../ui/Field.jsx';
import Form from '../compositions/Form.jsx';
import connectToStores from 'flummox/connect';
import { getCarImage } from '../../adapter.js';
import config from '../../config.js';

class CarForm extends Form {

	constructor(props) {
		super(props);

		this.state = {
      imageUrl: null,
			companyStructureList: [],
		}
	}

	async componentDidMount() {
    const car = this.props.formState;
    getCarImage(car.asuods_id, car.type_id, car.model_id).then( (imageUrl) => {
      this.setState({imageUrl});
    });
		let companyStructureList = await this.context.flux.getActions('company-structure').getLinearCompanyStructureForUser();
		this.setState({companyStructureList});
	}

	render() {

		let state = this.props.formState;
		let { ownersIndex = {}, modelsIndex = {}, typesIndex = {} } = this.props;
		let owner = ownersIndex[state.owner_id] || {};
		let model = modelsIndex[state.model_id] || {};
		let type = typesIndex[state.type_id] || {};
		let { companyStructureList = [] } = this.state;
		let COMPANY_ELEMENTS = companyStructureList.map(el => ({value: el.id, label: el.name}));

		return (
			<Modal {...this.props}>

				<Modal.Header closeButton>
	          <Modal.Title id="contained-modal-title-lg">Карточка транспортного средства</Modal.Title>
				</Modal.Header>

	      <Modal.Body>

		      <Row>

		      	<Col md={6}>
	            <Div hidden={!this.state.imageUrl}>
	              <img src={config.backend + config.images + this.state.imageUrl} className="car-form-image"/>
	            </Div>
		      	</Col>

		      	<Col md={6}>
							<Field type="select" label="Подразделение"
										 options={COMPANY_ELEMENTS}
										 value={state.company_structure_id}
										 clearable={false}
										 onChange={this.handleChange.bind(this, 'company_structure_id')}/>
	            <Div>
	              <label>Гаражный номер</label>
	              <Input type="text" value={state['garage_number']} onChange={this.handleChange.bind(this, 'garage_number')}/>
	            </Div>
							<Div>
	              <label>Поправочный коэффициент</label>
	              <Input type="number" value={state['fuel_correction_rate']} onChange={this.handleChange.bind(this, 'fuel_correction_rate')}/>
	            </Div>
		      	</Col>

		      </Row>

	        <Row>

	          <Col md={6}>
	            <Div>
	              <label>Владелец</label> {owner.title || 'Не указано'}
	            </Div>
	            <Div>
	              <label>Госномер</label> {state.gov_number || 'Не указано'}
	            </Div>
	            <Div>
	              <label>Марка шасси</label> {model.title || 'Не указано'}
	            </Div>
	            <Div>
	              <label>Тип</label> {type.title || 'Не указано'}
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

export default connectToStores(CarForm, ['objects']);
