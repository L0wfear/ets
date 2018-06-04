import React, { Component } from 'react';
import { Modal, Row, Col } from 'react-bootstrap';
import ModalBody from 'components/ui/Modal';
import FieldWrap from '../FieldWrap.jsx';
// deprecated
export default class Form extends Component {

  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
  }

  handleChange(field, e) {
    this.props.handleFormChange(field, e);
  }

  handleSubmit() {
    console.log('submitting car form', this.props.formState);
    this.props.onSubmit(this.props.formState);
  }

  mapProperties(property, index) {
    if (property.form && property.form.required) {
      return (
        <Row key={index}>
          <Col md={6}>
            <FieldWrap field={property}
              value={this.props.formState[property.name]}
              error={this.props.formErrors[property.name]}
              onChange={this.handleChange.bind(this, property.name)}
            />
          </Col>
        </Row>
      );
    }
    return null;
  }

  render() {
    const state = this.props.formState;
    const { title, tableMeta = { cols: [] } } = this.props;
    const rows = tableMeta.cols.map(this.mapProperties.bind(this));

    console.log('form state is ', state);

    return (
      <Modal {...this.props} backdrop="static">

        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{title}</Modal.Title>
        </Modal.Header>

        <ModalBody>

          {rows}

        </ModalBody>

        <Modal.Footer>
          {/* <Button onClick={this.handleSubmit.bind(this)}>Сохранить</Button>*/}
        </Modal.Footer>

      </Modal>
    );
  }
}
