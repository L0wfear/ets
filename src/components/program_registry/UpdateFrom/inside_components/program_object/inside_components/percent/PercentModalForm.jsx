import React from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';

import ModalBody from 'components/ui/Modal';
import { connectToStores } from 'utils/decorators';
import Div from 'components/ui/Div.jsx';
import { ExtField } from 'components/ui/Field.jsx';
import Form from 'components/compositions/Form.jsx';

@connectToStores(['autobase'])
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
    } = this.props;

    const IS_CREATING = !state.id;

    let title = 'Просмотр записи';
    if (IS_CREATING) title = 'Добавление записи';

    return (
      <Modal {...this.props} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{ title }</Modal.Title>
        </Modal.Header>
        <Div style={{ padding: 15 }}>
          <Row>
            <Col md={12}>
              <ExtField
                type="date"
                label="Дата осмотра"
                date={state.reviewed_at}
                error={IS_CREATING ? errors.reviewed_at : null}
                onChange={this.handleChange}
                boundKeys={['reviewed_at']}
                disabled={!isPermitted || !IS_CREATING}
              />
              <ExtField
                type="string"
                label="Процент выполнения"
                value={state.percent}
                error={IS_CREATING ? errors.percent : null}
                onChange={this.handleChange}
                boundKeys={['percent']}
                disabled={!isPermitted || !IS_CREATING}
              />
              <ExtField
                type="string"
                label="Комментарий"
                value={state.comment}
                error={errors.comment}
                onChange={this.handleChange}
                boundKeys={['comment']}
                disabled={!isPermitted || !IS_CREATING}
              />
            </Col>
          </Row>
        </Div>
        <ModalBody />
        <Modal.Footer>
          <Div hidden={!IS_CREATING} >
            <Button disabled={!this.props.canSave} onClick={this.handleSubmitWrap}>Сохранить</Button>
          </Div>
        </Modal.Footer>
      </Modal>
    );
  }
}
