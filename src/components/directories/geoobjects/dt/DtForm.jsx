import React, { Component } from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';
import Field from 'components/ui/Field.jsx';
import Form from 'compositions/Form.jsx';
import connectToStores from 'flummox/connect';

class DtForm extends Form {

  constructor(props) {
    super(props);

    this.state = {
      companyStructureList: [],
    };
  }

  async componentDidMount() {
    const companyStructureList = await this.context.flux.getActions('companyStructure').getLinearCompanyStructureForUser();
    this.setState({ companyStructureList });
  }

  render() {
    const state = this.props.formState;
    const { companyStructureList = [] } = this.state;
    const COMPANY_ELEMENTS = companyStructureList.map(el => ({ value: el.id, label: el.name }));

    return (
      <Modal {...this.props} backdrop="static">

        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">Дворовая территория</Modal.Title>
        </Modal.Header>

        <Modal.Body>

          <Row>
            <Col md={12}>
              <Field
                type="select"
                label="Подразделение"
                options={COMPANY_ELEMENTS}
                value={state.company_structure_id}
                onChange={this.handleChange.bind(this, 'company_structure_id')}
              />
            </Col>
          </Row>

        </Modal.Body>

        <Modal.Footer>
          <Button onClick={this.handleSubmit.bind(this)}>Сохранить</Button>
        </Modal.Footer>

      </Modal>
    );
  }
}

export default connectToStores(DtForm, ['geoObjects']);
