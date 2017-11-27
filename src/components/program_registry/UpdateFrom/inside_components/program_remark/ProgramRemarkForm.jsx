import React from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';

import ModalBody from 'components/ui/Modal';
import Div from 'components/ui/Div.jsx';
import { ExtField } from 'components/ui/Field.jsx';
import Form from 'components/compositions/Form.jsx';

export default class SparePartForm extends Form {
  handleSubmitWrap = () => this.handleSubmit();

  render() {
    const [
      state,
      errors,
    ] = [
      this.props.formState,
      this.props.formErrors,
    ];

    const {
      isPermitted = false,
      program_version_status,
      iСustomer,
    } = this.props;

    const statusIsChanged = state.status ? state.status !== 'created' : false;

    return (
      <Modal {...this.props} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{'Создание замечания'}</Modal.Title>
        </Modal.Header>
        <Div style={{ padding: 15 }}>
          <Row>
            <Col md={12}>
              <ExtField
                type="text"
                label="Замечание"
                value={state.remark}
                error={errors.remark}
                onChange={this.handleChange}
                boundKeys={['remark']}
                disabled={!isPermitted || statusIsChanged || iСustomer || program_version_status !== 'sent_on_review'}
              />
            </Col>
            <Div hidden={!iСustomer || program_version_status !== 'rejected'}>
              <Col md={12}>
                <ExtField
                  type="text"
                  label="Комментарий"
                  value={state.comment}
                  error={errors.comment}
                  onChange={this.handleChange}
                  boundKeys={['comment']}
                  disabled={!isPermitted || statusIsChanged || !iСustomer}
                />
              </Col>
            </Div>
          </Row>
        </Div>
        <ModalBody />
        <Modal.Footer>
          <Div hidden={iСustomer && (!iСustomer || program_version_status !== 'rejected')}>
            <Button disabled={!this.props.canSave} onClick={this.handleSubmitWrap}>Сохранить</Button>
          </Div>
        </Modal.Footer>
      </Modal>
    );
  }
}
