import React from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';

import { defaultSelectListMapper } from 'components/ui/input/EtsSelect';
import ModalBody from 'components/ui/Modal';
import { connectToStores } from 'utils/decorators';
import Div from 'components/ui/Div.jsx';
import { ExtField } from 'components/ui/Field.jsx';
import Form from 'components/compositions/Form.jsx';

@connectToStores(['repair'])
export default class StateProgramForm extends Form {
  handleSubmitWrap = (...arg) => this.handleSubmit(...arg);

  render() {
    const [state, errors] = [this.props.formState, this.props.formErrors];
    const { stateProgramStatusList = [] } = this.props;

    const STATE_PROGRAM_STATUS_OPTIONS = stateProgramStatusList.map(defaultSelectListMapper)

    const title = 'Государственная программа ремонта';

    return (
      <Modal {...this.props} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{ title }</Modal.Title>
        </Modal.Header>
        <Div style={{ padding: 15 }}>
          <Row>
            <Col md={12}>
              <ExtField
                type="string"
                label="Наименование государственной программы"
                error={errors.name}
                value={state.name}
                onChange={this.handleChange}
                boundKeys={['name']}
              />
            </Col>
            <Col md={6}>
              <ExtField
                type="select"
                label="Статус"
                error={errors.status_id}
                value={state.status_id}
                options={STATE_PROGRAM_STATUS_OPTIONS}
                onChange={this.handleChange}
                boundKeys={['status_id']}
              />
            </Col>
          </Row>
        </Div>
        <ModalBody />
        <Modal.Footer>
          <Button disabled={!this.props.canSave} onClick={this.handleSubmitWrap}>Сохранить</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
