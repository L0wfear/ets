import React, { Component } from 'react';
import connectToStores from 'flummox/connect';
import { Modal, Row, Col, Button } from 'react-bootstrap';
import ModalBody from 'components/ui/Modal';
import Field from 'components/ui/Field.jsx';
import Div from 'components/ui/Div.jsx';
import Form from '../compositions/Form.jsx';

class CompanyStructureForm extends Form {

  async componentDidMount() {
    this.company_id = this.context.flux.getStore('session').getCurrentUser().company_id;
  }

  render() {
    const [
      state = {},
      errors = {},
    ] = [
      this.props.formState,
      this.props.formErrors,
    ];

    const { companyStructureLinearList = [] } = this.props;
    const { parent_id = false } = state;

    let COMPANY_ELEMENTS = companyStructureLinearList.filter(d => d.type !== 3).map(el => ({ value: el.id, label: el.name }));
    COMPANY_ELEMENTS = [{ value: null, label: 'Предприятие' }, ...COMPANY_ELEMENTS];
    const STRUCTURE_TYPES = [{ value: 3, label: 'ДЭУ' }];
    let parent_type_is_dek = false;

    if (parent_id) {
      parent_type_is_dek = companyStructureLinearList.find(d => d.id === parent_id).type === 2;
    }
    if (!parent_id || !parent_type_is_dek) {
      STRUCTURE_TYPES.push({ value: 2, label: 'ДЭК' })
    }

    return (
      <Modal {...this.props} backdrop="static">

        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{this.props.nameOfForm}</Modal.Title>
        </Modal.Header>
        <ModalBody>
          <Row>
            <Col md={12}>
              <Field
                type="select"
                label="Родительское подразделение"
                emptyValue={null}
                error={errors.parent_id}
                options={COMPANY_ELEMENTS}
                value={state.parent_id}
                onChange={this.handleChange.bind(this, 'parent_id')}
                clearable
              />
              <Field
                type="select"
                label="Тип подразделения"
                error={errors.type}
                options={STRUCTURE_TYPES}
                value={state.type}
                onChange={this.handleChange.bind(this, 'type')}
                clearable
              />
              <Field
                type="string"
                label="Наименование"
                error={errors.name}
                value={state.name}
                onChange={this.handleChange.bind(this, 'name')}
              />
              <Field
                type="string"
                label="Примечание"
                error={errors.note}
                value={state.note}
                onChange={this.handleChange.bind(this, 'note')}
              />
            </Col>
          </Row>

        </ModalBody>

        <Modal.Footer>
          <Div hidden={state.status === 'closed'}>
            <Button onClick={this.handleSubmit.bind(this)} disabled={!this.props.canSave}>Сохранить</Button>
          </Div>
        </Modal.Footer>

      </Modal>
    );
  }
}

export default connectToStores(CompanyStructureForm, ['objects']);
