import React from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';

import { defaultSelectListMapper } from 'components/ui/input/EtsSelect';
import ModalBody from 'components/ui/Modal';
import { connectToStores } from 'utils/decorators';
import Div from 'components/ui/Div.jsx';
import { ExtField } from 'components/ui/Field.jsx';
import Form from 'components/compositions/Form.jsx';

@connectToStores(['repair'])
export default class ProgramRegistryForm extends Form {
  handleSubmitWrap = (...arg) => this.handleSubmit(...arg);

  render() {
    const [state, errors] = [this.props.formState, this.props.formErrors];
    const IS_CREATING = !state.id;

    const STATE_PROGRAM_OPTION = [].map(defaultSelectListMapper);

    let title = 'Изменение записи';
    if (IS_CREATING) title = 'Создание записи';

    return (
      <Modal {...this.props} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{ title }</Modal.Title>
        </Modal.Header>
        <Div style={{ display: 'flex', justifyContent: 'center' }}>
          <h1>Закрой</h1>
        </Div>
        <ModalBody />
        <Modal.Footer>
          <Button disabled={!this.props.canSave} onClick={this.handleSubmitWrap}>Сохранить</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
