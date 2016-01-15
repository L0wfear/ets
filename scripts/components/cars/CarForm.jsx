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

export default class CarForm extends Component {

	constructor(props) {
		super(props);

		this.state = {
      imageUrl: null,
		}
	}

	handleChange(field, e) {
		this.props.handleFormChange(field, e);
	}

  handleSubmit() {
    console.log('submitting car form', this.props.formState);
    this.props.onSubmit(this.props.formState);
  }

	componentDidMount() {
    const car = this.props.formState;
    getCarImage(car.asuods_id, car.type_id, car.model_id).then( (imageUrl) => {
      this.setState({imageUrl})
    });
	}

	render() {

		let state = this.props.formState;

    console.log('form state is ', state);

		return (
			<Modal {...this.props}>
				<Modal.Header closeButton>
	          <Modal.Title id="contained-modal-title-lg">Карточка транспортного средства</Modal.Title>
				</Modal.Header>

	      <Modal.Body>

	      <Row>

	      	<Col md={6}>
            <Div hidden={!this.state.imageUrl}>
              <img src={config.backend + config.images + this.state.imageUrl} style={{
                margin: 10,
                width: 250,
                minHeight: 100
              }}/>
            </Div>
	      	</Col>

	      	<Col md={6}>
            <Div>
              <label>Гаражный номер</label>
              <Input type="text" value={state['garage_number']} onChange={this.handleChange.bind(this, 'garage_number')}/>
            </Div>
	      	</Col>

	      </Row>

        <Row>

          <Col md={6}>
            <Div>
              <label>Владелец</label> {getOwnerById(state.owner_id).title}
            </Div>
            <Div>
              <label>Госномер</label> {state.gov_number}
            </Div>
            <Div>
              <label>Модель</label> {getModelById(state.model_id).title}
            </Div>
            <Div>
              <label>Тип</label> {getTypeById(state.type_id).title}
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
