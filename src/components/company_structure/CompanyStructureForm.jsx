import React from 'react';
import connectToStores from 'flummox/connect';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';
import * as Button from 'react-bootstrap/lib/Button';

import ModalBody from 'components/ui/Modal';
import Field from 'components/ui/Field';
import Div from 'components/ui/Div';
import Form from 'components/compositions/Form';

const DEY = { value: 3, label: 'ДЭУ' };
const DEK = { value: 2, label: 'ДЭК' };

const STRUCTURE_TYPES = {
  half: [
    DEY,
  ],
  all: [
    DEY,
    DEK,
  ],
};

class CompanyStructureForm extends Form {
  handleChangeParentID = (parent_id) => {
    this.handleChange('type', null);
    this.handleChange('parent_id', parent_id);
  }

  render() {
    const {
      formState: state = {},
      formErrors: errors = {},
    } = this.props;

    const { companyStructureLinearList = [] } = this.props;
    const { parent_id = false } = state;

    const COMPANY_ELEMENTS = companyStructureLinearList.filter(d => d.type !== DEY.value).map(el => ({ value: el.id, label: el.name }));
    let structureType = 'half';
    let parent_type_is_dek = false;

    if (parent_id) {
      parent_type_is_dek = companyStructureLinearList.find(d => d.id === parent_id).type === DEK.value;
    }
    if (!parent_id || !parent_type_is_dek) {
      structureType = 'all';
    }
    const IS_CREATING = !state.id;

    let title = 'Изменение подразделения';
    if (IS_CREATING) title = 'Создание подразделения';

    return (
      <Modal show={this.props.show} id="modal-company-structure" onHide={this.props.onHide} backdrop="static">

        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
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
                onChange={this.handleChangeParentID}
                clearable
                disabled={COMPANY_ELEMENTS.length === 0}
                placeholder="Подразделение"
              />
              <Field
                type="select"
                label="Тип подразделения"
                error={errors.type}
                options={STRUCTURE_TYPES[structureType]}
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
