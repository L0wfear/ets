import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import Field from 'components/ui/Field.jsx';
import Form from 'components/compositions/Form.jsx';
import { connectToStores } from 'utils/decorators';

@connectToStores(['odh'])
export default class MaintenanceWorkForm extends Form {

  render() {
    const state = this.props.formState;
    const errors = this.props.formErrors;
    const { isPermitted, measureUnitList } = this.props;
    const MEASUREUNITS = measureUnitList.map(({ id, name }) => ({ value: id, label: name }));

    return (
      <Modal {...this.props} backdrop="static" bgSize="small">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{!state.id ? 'Добавление' : 'Изменение'} показателя регламентных работ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Field
            type="string"
            label="Наименование"
            value={state.name}
            error={errors.name}
            onChange={e => this.handleChange('name', e)}
            disabled={!isPermitted}
          />
          <Field
            type="select"
            label="Единица измерения"
            value={state.measure_unit_id}
            error={errors.measure_unit_id}
            options={MEASUREUNITS}
            onChange={e => this.handleChange('measure_unit_id', e)}
            disabled={!isPermitted}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => this.handleSubmit()} disabled={!this.props.canSave || !isPermitted}>Сохранить</Button>
        </Modal.Footer>
      </Modal>
    );
  }

}
