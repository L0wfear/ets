import React, { Component } from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';
import ModalBody from 'components/ui/Modal';
import Field from 'components/ui/Field.jsx';
import Form from 'components/compositions/Form.jsx';
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
    const { columnMetadata } = this.props;

    const { companyStructureList = [] } = this.state;
    const COMPANY_ELEMENTS = companyStructureList.map(el => ({ value: el.id, label: el.name }));

    const INPUT_VAL = {
      company_structure_name: {
        type: 'select',
        options: COMPANY_ELEMENTS,
        emptyValue: null,
        onChange: (...arg) => this.handleChange('company_structure_id', ...arg),
      },
    };
    const STATIC_VAL = {
      type: 'string',
      readOnly: true,
    };

    return (
      <Modal {...this.props} backdrop="static">

        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">Дворовая территория</Modal.Title>
        </Modal.Header>

        <ModalBody>
          {columnMetadata.map(d =>
            <Row key={d.columnName}>
              <Col md={12}>
                <Field
                  label={d.displayName}
                  value={state[d.columnName]}
                  {...(d.columnName in INPUT_VAL ? INPUT_VAL[d.columnName] : STATIC_VAL)}
                />
              </Col>
            </Row>
          )}
        </ModalBody>

        <Modal.Footer>
          <Button onClick={this.handleSubmit.bind(this)}>Сохранить</Button>
        </Modal.Footer>

      </Modal>
    );
  }
}

export default connectToStores(DtForm, ['geoObjects']);
