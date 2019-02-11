import React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Button from 'react-bootstrap/lib/Button';

import { defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';
import ModalBody from 'components/ui/Modal';
import Field from 'components/ui/Field';
import Form from 'components/compositions/Form';
import { connectToStores } from 'utils/decorators';

@connectToStores(['odh'])
class MaintenanceWorkForm extends Form {
  render() {
    const state = this.props.formState;
    const errors = this.props.formErrors;
    const { isPermitted = false, measureUnitList = [] } = this.props;
    const MEASUREUNIT_OPTIONS = measureUnitList.map(defaultSelectListMapper);

    return (
      <Modal
        id="modal-mainenance-work"
        show={this.props.show}
        onHide={this.props.onHide}
        bsSize="large"
        backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>
            {!state.id ? 'Добавление' : 'Изменение'} показателя регламентных
            работ
          </Modal.Title>
        </Modal.Header>
        <ModalBody>
          <Field
            type="string"
            label="Наименование"
            value={state.name}
            error={errors.name}
            onChange={(e) => this.handleChange('name', e)}
            disabled={!isPermitted}
          />
          <Field
            type="select"
            label="Единица измерения"
            value={state.measure_unit_id}
            error={errors.measure_unit_id}
            options={MEASUREUNIT_OPTIONS}
            onChange={(e) => this.handleChange('measure_unit_id', e)}
            disabled={!isPermitted}
          />
        </ModalBody>
        <Modal.Footer>
          <Button
            onClick={() => this.handleSubmit()}
            disabled={
              !this.props.canSave
              || !isPermitted
              || !this.props.saveButtonEnability
            }>
            {this.props.saveButtonLabel}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default MaintenanceWorkForm;
