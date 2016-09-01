import React, {Component} from 'react';
import { Modal, Input, Label, Row, Col, FormControls, Button, DropdownButton, Dropdown, MenuItem, Glyphicon } from 'react-bootstrap';
import EtsSelect from 'components/ui/EtsSelect.jsx';
import Datepicker from 'components/ui/DatePicker.jsx';
import moment from 'moment';
import Div from 'components/ui/Div.jsx';
import Field from 'components/ui/Field.jsx';
import Form from 'compositions/Form.jsx';
import connectToStores from 'flummox/connect';
import config from '../../../config.js';

class CarForm extends Form {

	constructor(props) {
		super(props);

		this.state = {
      imageUrl: null,
			companyStructureList: [],
		}
	}

	async componentDidMount() {
		const { flux } = this.context;
    const car = this.props.formState;
    flux.getActions('cars').getCarImage(car.asuods_id, car.type_id, car.model_id).then((imageUrl) => this.setState({imageUrl}) );
		let companyStructureList = await flux.getActions('companyStructure').getLinearCompanyStructureForUser();
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
			<Modal {...this.props} backdrop="static">

				<Modal.Header closeButton>
					<Modal.Title id="contained-modal-title-lg">Карточка транспортного средства</Modal.Title>
				</Modal.Header>

	      <Modal.Body>

		      <Row>

		      	<Col md={6}>
	            <Div hidden={!this.state.imageUrl}>
	              <img src={config.images + this.state.imageUrl} className="car-form-image"/>
	            </Div>
		      	</Col>

		      	<Col md={6}>
							<Field type="select" label="Подразделение"
									options={COMPANY_ELEMENTS}
									value={state.company_structure_id}
									clearable={false}
									onChange={this.handleChange.bind(this, 'company_structure_id')}/>

						 	<Field type="string" label="Гаражный номер"
									value={state.garage_number}
									onChange={this.handleChange.bind(this, 'garage_number')}/>

							<Field type="number" label="Поправочный коэффициент"
									value={state.fuel_correction_rate}
									onChange={this.handleChange.bind(this, 'fuel_correction_rate')}/>
		      	</Col>

		      </Row>

	        <Row>

	          <Col md={6}>
							<Field type="string" label="Владелец" readOnly={true} value={owner.title || 'Не указано'} />

							<Field type="string" label="Рег. номер ТС" readOnly={true} value={state.gov_number || 'Не указано'} />

							<Field type="string" label="Марка шасси" readOnly={true} value={state.model_name || 'Не указано'} />

							<Field type="string" label="Тип" readOnly={true} value={type.title || 'Не указано'} />
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
