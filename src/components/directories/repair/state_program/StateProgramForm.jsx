import React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Button from 'react-bootstrap/lib/Button';
import * as Col from 'react-bootstrap/lib/Col';
import * as Row from 'react-bootstrap/lib/Row';

import { defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';
import ModalBody from 'components/ui/Modal';
import { connectToStores } from 'utils/decorators';
import Div from 'components/ui/Div';
import { ExtField } from 'components/ui/new/field/ExtField';
import Form from 'components/compositions/Form';

@connectToStores(['repair'])
export default class StateProgramForm extends Form {
  handleSubmitWrap = (...arg) => this.handleSubmit(...arg);

  render() {
    const [state, errors] = [this.props.formState, this.props.formErrors];
    const { stateProgramStatusList = [] } = this.props;

    const STATE_PROGRAM_STATUS_OPTIONS = stateProgramStatusList.map(defaultSelectListMapper);

    const title = 'Государственная программа ремонта';

    return (
      <Modal id="modal-state-program" show={this.props.show} onHide={this.props.onHide} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{ title }</Modal.Title>
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
                boundKeys="name"
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
                clearable={false}
                boundKeys="status_id"
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
