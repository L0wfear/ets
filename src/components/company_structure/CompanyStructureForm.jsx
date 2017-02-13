import React, { Component } from 'react';
import connectToStores from 'flummox/connect';
import { Modal, Row, Col, Button } from 'react-bootstrap';
import ModalBody from 'components/ui/Modal';
import Field from 'components/ui/Field.jsx';
import Div from 'components/ui/Div.jsx';
import Form from '../compositions/Form.jsx';

class CompanyStructureForm extends Form {

  constructor(props) {
    super(props);

    this.state = {
      companyStructureLinearList: [],
    };
  }

  async componentDidMount() {
    this.company_id = this.context.flux.getStore('session').getCurrentUser().company_id;
    const companyStructureLinearList = await this.context.flux.getActions('companyStructure').getLinearCompanyStructure();
    this.setState({ companyStructureLinearList });
  }

  render() {
    const state = this.props.formState;
    const errors = this.props.formErrors;
    const { companyStructureLinearList = [] } = this.state;

    let COMPANY_ELEMENTS = companyStructureLinearList.map(el => ({ value: el.id, label: el.name }));
    COMPANY_ELEMENTS = [{ value: null, label: 'Предприятие' }, ...COMPANY_ELEMENTS];
    const STRUCTURE_TYPES = [{ value: 2, label: 'ДЭК' }, { value: 3, label: 'ДЭУ' }];

    return (
      <Modal {...this.props} backdrop="static">

        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">Создание подразделения</Modal.Title>
        </Modal.Header>

        <ModalBody>

          <Row>
            <Col md={12}>
              <Field
                type="select"
                label="Родительское подразделение"
                error={errors.parent_id}
                options={COMPANY_ELEMENTS}
                value={state.parent_id}
                onChange={this.handleChange.bind(this, 'parent_id')}
                clearable
              />
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Field
                type="select"
                label="Тип подразделения"
                error={errors.type}
                options={STRUCTURE_TYPES}
                value={state.type}
                onChange={this.handleChange.bind(this, 'type')}
                clearable
              />
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Field
                type="string"
                label="Наименование"
                error={errors.name}
                value={state.name}
                onChange={this.handleChange.bind(this, 'name')}
              />
            </Col>
          </Row>

          <Row>
            <Col md={12}>
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
