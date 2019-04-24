import React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Col from 'react-bootstrap/lib/Col';
import * as Row from 'react-bootstrap/lib/Row';
import * as Button from 'react-bootstrap/lib/Button';

import ModalBody from 'components/ui/Modal';
import Div from 'components/ui/Div';
import { ExtField } from 'components/ui/new/field/ExtField';
import UNSAFE_Form from 'components/compositions/UNSAFE_Form';

export default class SparePartForm extends UNSAFE_Form {
  handleSubmitWrap = () => this.handleSubmit();

  render() {
    const {
      formState: state,
      formErrors: errors,
      isPermitted = false,
      program_version_status,
      isSupervisor,
      isСustomer,
    } = this.props;

    const IS_CREATING = !state.id;
    const title = IS_CREATING ? 'Создание замечания' : 'Изменение замечания';

    const allowCreateRemark
      = isSupervisor && program_version_status === 'sent_on_review';
    const allowChangeRemark
      = isPermitted
      && program_version_status === 'sent_on_review'
      && state.status === 'created';

    const allowCreateComment
      = isСustomer && program_version_status === 'rejected';
    const allowChangeComment
      = isPermitted
      && program_version_status === 'rejected'
      && state.status === 'created';

    if (allowCreateRemark || allowCreateComment) {
      return (
        <Modal
          id="modal-program-remark"
          show={this.props.show}
          onHide={this.props.onHide}
          backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Div style={{ padding: 15 }}>
            <Row>
              <Div hidden={!allowCreateRemark}>
                <Col md={12}>
                  <ExtField
                    type="text"
                    label="Замечание"
                    value={state.remark}
                    error={errors.remark}
                    onChange={this.handleChange}
                    boundKeys="remark"
                    disabled={!(IS_CREATING || allowChangeRemark)}
                  />
                </Col>
              </Div>
              <Div hidden={!allowCreateComment}>
                <Col md={12}>
                  <ExtField
                    type="text"
                    label="Комментарий"
                    value={state.comment}
                    error={errors.comment}
                    onChange={this.handleChange}
                    boundKeys="comment"
                    disabled={!(IS_CREATING || allowChangeComment)}
                  />
                </Col>
              </Div>
            </Row>
          </Div>
          <ModalBody />
          <Modal.Footer>
            <Div
              hidden={
                !(IS_CREATING || allowChangeRemark || allowChangeComment)
              }>
              <Button
                disabled={!this.props.canSave}
                onClick={this.handleSubmitWrap}>
                Сохранить
              </Button>
            </Div>
          </Modal.Footer>
        </Modal>
      );
    }
    return null;
  }
}
