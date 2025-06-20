import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';

import ModalBody from 'components/old/ui/Modal';
import Div from 'components/old/ui/Div';
import ExtField from 'components/@next/@ui/renderFields/Field';
import UNSAFE_Form from 'components/old/compositions/UNSAFE_Form';

type Props = {
  [k: string]: any;
};
type State = any;

export default class PercentModalForm extends UNSAFE_Form<Props, State> {
  handleSubmitWrap = () => this.handleSubmit();

  render() {
    const [state, errors] = [this.props.formState, this.props.formErrors];

    const {
      isPermitted: isPermittedOuter = false,
      isPermittedPercentByStatus,
    } = this.props;

    const isPermitted = isPermittedOuter && isPermittedPercentByStatus;

    const IS_CREATING = !state.id;

    let title = 'Просмотр записи';
    if (IS_CREATING) {
      title = 'Добавление записи';
    }

    return (
      <EtsBootstrap.ModalContainer
        id="modal-percent"
        show={this.props.show}
        onHide={this.props.onHide}>
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>{title}</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <ModalBody style={{ padding: 15 }}>
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
        </ModalBody>
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
