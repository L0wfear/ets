import React, {Component} from 'react';
import { Modal, Input, Label, Row, Col, FormControls, Button, DropdownButton, Dropdown, MenuItem, Glyphicon } from 'react-bootstrap';
import FieldWrap from '../FieldWrap.jsx';
import EtsSelect from '../EtsSelect.jsx';
import Datepicker from '../DatePicker.jsx';
import moment from 'moment';
import Div from '../Div.jsx';
import config from '../../../config.js';

export default class Form extends Component {

	constructor(props) {
		super(props);

		this.state = {};
	}

	handleChange(field, e) {
		this.props.handleFormChange(field, e);
	}

  handleSubmit() {
    console.log('submitting car form', this.props.formState);
    this.props.onSubmit(this.props.formState);
  }

	componentDidMount() {
    //const car = this.props.formState;
    // getCarImage(car.asuods_id, car.type_id, car.model_id).then( (imageUrl) => {
    //   this.setState({imageUrl})
    // });
	}

  mapProperties(property, index) {
    console.log(property);
    if (property.form && property.form.required) {
      return (
        <Row key={index}>
          <Col md={6}>
            <FieldWrap field={property}
                       value={this.props.formState[property.name]}
                       error={this.props.formErrors[property.name]}
                       onChange={this.handleChange.bind(this, property.name)} />
          </Col>
        </Row>
      );
    }
    return null;
  }

	render() {

		let state = this.props.formState;
    const { title, tableMeta = { cols: [] } } = this.props;
    const rows = tableMeta.cols.map(this.mapProperties.bind(this));

    console.log('form state is ', state);

		return (
			<Modal {...this.props}>

				<Modal.Header closeButton>
	          <Modal.Title id="contained-modal-title-lg">{title}</Modal.Title>
				</Modal.Header>

	      <Modal.Body>

		      {rows}

	      </Modal.Body>

	      <Modal.Footer>
	      	{/*<Button onClick={this.handleSubmit.bind(this)}>Сохранить</Button>*/}
	      </Modal.Footer>

			</Modal>
		)
	}
}
