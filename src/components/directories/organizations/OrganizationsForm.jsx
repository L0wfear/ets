import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import ModalBody from 'components/ui/Modal';
import { ExtField } from 'components/ui/Field.jsx';
import Form from 'components/compositions/Form.jsx';

const boundKeysObj = {
  short_name: ['short_name'],
};

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
          <ExtField
            type="string"
            label="Наименование"
            value={state.short_name}
            error={errors.short_name}
            onChange={this.handleChange}
            boundKeys={boundKeysObj.short_name}
            disabled
          />
          <ExtField
            type={'boolean'}
            label="Наличие дистанционного мед. осмотра"
            value={state.has_remote_checkup}
            error={errors.has_remote_checkup}
            onChange={this.handleChange}
            boundKeys={['has_remote_checkup', !state.has_remote_checkup]}
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
