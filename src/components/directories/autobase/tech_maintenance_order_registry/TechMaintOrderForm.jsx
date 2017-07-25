import React from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';

import ModalBody from 'components/ui/Modal';
import { connectToStores } from 'utils/decorators';
import Div from 'components/ui/Div.jsx';
import { ExtField } from 'components/ui/Field.jsx';
import Form from 'components/compositions/Form.jsx';

@connectToStores(['autobase'])
export default class TechMaintOrderForm extends Form {
  async componentDidMount() {
    const { flux } = this.context;
    flux.getActions('autobase').getAutobaseListByType('techMaintType');
  }
  render() {
    const state = this.props.formState;
    const errors = this.props.formErrors;
    const {
      techMaintTypeList = [],
      isPermitted = false,
    } = this.props;

    const TECH_MAINT_TYPE = techMaintTypeList.map(({ id, name }) => ({ value: id, label: name }));

    const IS_CREATING = !!!state.id;

    let title = 'Изменение записи';
    if (IS_CREATING) title = 'Создание записи';

    return (
      <Modal {...this.props} bsSize="medium" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{ title }</Modal.Title>
        </Modal.Header>
        <Div style={{ padding: 15 }}>
          <Row>
            <Col md={12}>
              <ExtField
                type="select"
                label="Тип ТО"
                options={TECH_MAINT_TYPE}
                value={state.tech_maintenance_type_id}
                error={errors.tech_maintenance_type_id}
                disabled={!isPermitted}
                onChange={this.handleChange}
                boundKeys={['tech_maintenance_type_id']}
              />
            </Col>
          </Row>
        </Div>
        <ModalBody />
        <Modal.Footer>
          <Button disabled={!this.props.canSave} onClick={this.handleSubmit}>Сохранить</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
