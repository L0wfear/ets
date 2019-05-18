import React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';

import ModalBody from 'components/ui/Modal';
import Div from 'components/ui/Div';
import { ExtField } from 'components/ui/new/field/ExtField';
import UNSAFE_Form from 'components/compositions/UNSAFE_Form';

export default class PercentModalForm extends UNSAFE_Form {
  handleSubmitWrap = () => this.handleSubmit();

  render() {
    const [state, errors] = [this.props.formState, this.props.formErrors];

    const {
      isPermitted: isPermittedOuter = false,
      isPermittedByStatus,
    } = this.props;

    const isPermitted = isPermittedOuter && isPermittedByStatus;

    const IS_CREATING = !state.id;

    let title = 'Просмотр записи';
    if (IS_CREATING) title = 'Добавление записи';

    return (
      <EtsBootstrap.ModalContainer
        id="modal-percent"
        show={this.props.show}
        onHide={this.props.onHide}
        backdrop="static">
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>{title}</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <Div style={{ padding: 15 }}>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={12}>
              <ExtField
                type="date"
                label="Дата осмотра"
                date={state.reviewed_at}
                error={IS_CREATING ? errors.reviewed_at : null}
                onChange={this.handleChange}
                boundKeys="reviewed_at"
                disabled={!isPermitted || !IS_CREATING}
              />
              <ExtField
                type="string"
                label="Процент выполнения"
                value={state.percent}
                error={IS_CREATING ? errors.percent : null}
                onChange={this.handleChange}
                boundKeys="percent"
                disabled={!isPermitted || !IS_CREATING}
              />
              <ExtField
                type="string"
                label="Комментарий"
                value={state.comment}
                error={errors.comment}
                onChange={this.handleChange}
                boundKeys="comment"
                disabled={!isPermitted || !IS_CREATING}
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
        </Div>
        <ModalBody />
        <EtsBootstrap.ModalFooter>
          <Div hidden={!IS_CREATING}>
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
}
