import React from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';

import ModalBody from 'components/ui/Modal';
import Div from 'components/ui/Div.jsx';
import { ExtField } from 'components/ui/Field.jsx';
import Form from 'components/compositions/Form.jsx';

export default class SparePartForm extends Form {
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

    const allowCreateRemark = isSupervisor && program_version_status === 'sent_on_review';
    const allowChangeRemark = isPermitted && program_version_status === 'sent_on_review' && state.status === 'created';

    const allowCreateComment = isСustomer && program_version_status === 'rejected';
    const allowChangeComment = isPermitted && program_version_status === 'rejected' && state.status === 'created';

    if (allowCreateRemark || allowCreateComment) {
      return (
        <Modal {...this.props} backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-lg">{title}</Modal.Title>
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
                    boundKeys={['remark']}
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
                    boundKeys={['comment']}
                    disabled={!(IS_CREATING || allowChangeComment)}
                  />
                </Col>
              </Div>
            </Row>
          </Div>
          <ModalBody />
          <Modal.Footer>
            <Div hidden={!(IS_CREATING || allowChangeRemark || allowChangeComment)}>
              <Button disabled={!this.props.canSave} onClick={this.handleSubmitWrap}>Сохранить</Button>
            </Div>
          </Modal.Footer>
        </Modal>
      );
    }
    return null;
  }
}
