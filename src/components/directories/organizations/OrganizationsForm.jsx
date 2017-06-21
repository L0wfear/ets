import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import ModalBody from 'components/ui/Modal';
import Field from 'components/ui/Field.jsx';
import Form from 'components/compositions/Form.jsx';
import { YES_NO_SELECT_OPTIONS_BOOL } from 'constants/dictionary';


export default class OrganizationsForm extends Form {

  render() {
    const state = this.props.formState;
    const errors = this.props.formErrors;
    const { isPermitted } = this.props;

    return (
      <Modal {...this.props} backdrop="static" bgSize="small">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">Карточка организации</Modal.Title>
        </Modal.Header>
        <ModalBody>
          <Field
            type="string"
            label="Наименование"
            value={state.short_name}
            error={errors.short_name}
            onChange={e => this.handleChange('short_name', e)}
            disabled
          />
          <Field
            type="select"
            label="Наличие дистанционного мед. осмотра"
            value={state.has_remote_checkup ? 'Да' : 'Нет'}
            error={errors.has_remote_checkup}
            options={YES_NO_SELECT_OPTIONS_BOOL}
            onChange={e => this.handleChange('has_remote_checkup', e)}
            disabled={!isPermitted}
          />
        </ModalBody>
        <Modal.Footer>
          <Button
            onClick={() => this.handleSubmit()}
            disabled={!this.props.canSave || !isPermitted || !this.props.saveButtonEnability}
          >{this.props.saveButtonLabel}</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
