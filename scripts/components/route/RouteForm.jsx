import React, {Component} from 'react';
import { Modal, Input, Label, Row, Col, FormControls, Button, DropdownButton, Dropdown, MenuItem, Glyphicon } from 'react-bootstrap';
import Field from '../ui/Field.jsx';
import moment from 'moment';
import RouteCreating from './RouteCreating.jsx';

export default class Form extends Component {

	constructor(props) {
		super(props);

		this.state = {};
	}

	handleChange(field, e) {
		this.props.handleFormChange(field, e);
	}

  handleSubmit() {
    console.log('submitting route form', this.props.formState);
    this.props.onSubmit(this.props.formState);
  }

	componentDidMount() {
    //const car = this.props.formState;
    // getCarImage(car.asuods_id, car.type_id, car.model_id).then( (imageUrl) => {
    //   this.setState({imageUrl})
    // });
	}

	render() {

		let state = this.props.formState;

    console.log('form state is ', state);

		return (
			<Modal {...this.props} bsSize="large">

				<Modal.Header closeButton>
	          <Modal.Title id="contained-modal-title-lg">Создание нового маршрута</Modal.Title>
				</Modal.Header>

	      <Modal.Body>

          <Row>
            <Col md={6}>
              <Field type="string" label="Название маршрута" value={state.title} onChange={this.handleChange.bind(this, 'title')} />
            </Col>
          </Row>

          <Row className={'routes-form-map-wrapper'}>
            <Col md={12}>
              <RouteCreating route={state} onChange={this.handleChange.bind(this)}/>
            </Col>
          </Row>

	      </Modal.Body>

	      <Modal.Footer>
	      	<Button disabled={this.props.canSave} onClick={this.handleSubmit.bind(this)}>Сохранить</Button>
	      </Modal.Footer>

			</Modal>
		)
	}
}
