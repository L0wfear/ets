import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import Field from 'components/ui/Field.jsx';
import Form from 'components/compositions/Form.jsx';
import { connectToStores } from 'utils/decorators';

function getProperties(type = 'odh') {
  const properties = type === 'odh' ? [
    { label: 'Общая площадь (кв.м.)', value: 'total_area' },
    { label: 'Протяженность (п.м.)', value: 'distance' },
    { label: 'Площадь проезжей части (кв.м.)', value: 'roadway_area' },
    { label: 'Площадь тротуаров (кв.м.)', value: 'footway_area' },
    { label: 'Площадь уборки (кв.м.)', value: 'cleaning_area' },
    { label: 'Площадь механизированной уборки тротуаров (кв.м.)', value: 'auto_footway_area' },
    { label: 'Площадь ручной уборки тротуаров (кв.м.)', value: 'manual_footway_area' },
    { label: 'Площадь уборки снега (кв.м.)', value: 'snow_area' },
    { label: 'Протяженность лотков (п.м.)', value: 'gutters_length' },
  ] : [
    { label: 'Общая площадь (кв.м.)', value: 'total_area' },
    { label: 'Общая уборочная площадь (кв.м.)', value: 'clean_area' },
    { label: 'Площадь механизированной уборки (кв.м.)', value: 'mechanical_clean_area' },
  ];
  return properties;
}

@connectToStores(['objects'])
export default class CleaningRateForm extends Form {

  render() {
    const state = this.props.formState;
    const errors = this.props.formErrors;
    const { isPermitted, technicalOperationsList, type } = this.props;
    const TECHNICAL_OPERATIONS = technicalOperationsList.map(({ id, name }) => ({ value: id, label: name }));
    const PROPERTIES = getProperties(type);
    return (
      <Modal {...this.props} backdrop="static" bgSize="small">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{!state.id ? 'Добавление' : 'Изменение'} показателя для расчета эффективности</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Field
            type="select"
            label="Технологическая операция"
            value={state.technical_operation_id}
            error={errors.technical_operation_id}
            options={TECHNICAL_OPERATIONS}
            onChange={e => this.handleChange('technical_operation_id', e)}
            disabled={!isPermitted}
          />
          <Field
            type="select"
            label="Площадная характеристика"
            value={state.property}
            error={errors.property}
            options={PROPERTIES}
            onChange={e => this.handleChange('property', e)}
            disabled={!isPermitted}
          />
          <Field
            type="string"
            label="Коэффициент"
            value={state.value}
            error={errors.value}
            onChange={e => this.handleChange('value', e)}
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
