import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';

import ModalBody from 'components/old/ui/Modal';
import Div from 'components/old/ui/Div';
import ExtField from 'components/@next/@ui/renderFields/Field';
import UNSAFE_Form from 'components/old/compositions/UNSAFE_Form';

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
        <EtsBootstrap.ModalContainer
          id="modal-program-remark"
          show={this.props.show}
          onHide={this.props.onHide}>
          <EtsBootstrap.ModalHeader closeButton>
            <EtsBootstrap.ModalTitle>{title}</EtsBootstrap.ModalTitle>
          </EtsBootstrap.ModalHeader>
          <ModalBody style={{ padding: 15 }}>
            <EtsBootstrap.Row>
              <Div hidden={!allowCreateRemark}>
                <EtsBootstrap.Col md={12}>
                  <ExtField
                    type="text"
                    label="Замечание"
                    value={state.remark}
                    error={errors.remark}
                    onChange={this.handleChange}
                    boundKeys="remark"
                    disabled={!(IS_CREATING || allowChangeRemark)}
                  />
                </EtsBootstrap.Col>
              </Div>
              <Div hidden={!allowCreateComment}>
                <EtsBootstrap.Col md={12}>
                  <ExtField
                    type="text"
                    label="Комментарий"
                    value={state.comment}
                    error={errors.comment}
                    onChange={this.handleChange}
                    boundKeys="comment"
                    disabled={!(IS_CREATING || allowChangeComment)}
                  />
                </EtsBootstrap.Col>
              </Div>
            </EtsBootstrap.Row>
          </ModalBody>
          <EtsBootstrap.ModalFooter>
            <Div
              hidden={
                !(IS_CREATING || allowChangeRemark || allowChangeComment)
              }>
              <EtsBootstrap.Button
                disabled={!this.props.canSave}
                onClick={this.handleSubmitWrap}>
                Сохранить
              </EtsBootstrap.Button>
            </Div>
          </EtsBootstrap.ModalFooter>
        </EtsBootstrap.ModalContainer>
      );
    }
    return null;
  }
}
