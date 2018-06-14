import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import ModalBody from 'components/ui/Modal';
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
    { label: 'Кол-во убираемых остановок (ед.)', value: 'station_number' },
  ] : [
    { label: 'Общая площадь (кв.м.)', value: 'total_area' },
    { label: 'Общая уборочная площадь (кв.м.)', value: 'clean_area' },
    { label: 'Площадь механизированной уборки (кв.м.)', value: 'mechanical_clean_area' },
  ];
  return properties;
}

@connectToStores(['objects', 'odh'])
export default class CleaningRateForm extends Form {

  render() {
    const state = this.props.formState;
    const errors = this.props.formErrors;
    const { isPermitted, technicalOperationsList, measureUnitList, type } = this.props;
    const TECHNICAL_OPERATIONS = technicalOperationsList.map(({ id, name }) => ({ value: id, label: name }));
    const PROPERTIES = getProperties(type);
    const MEASUREUNITS = measureUnitList.map(({ id, name }) => ({ value: id, label: name }));

    return (
      <Modal {...this.props} id="modal-cleaning-rate" backdrop="static" bgSize="small">
        <Modal.Header closeButton>
          <Modal.Title>{!state.id ? 'Добавление' : 'Изменение'} показателя для расчета эффективности</Modal.Title>
        </Modal.Header>
        <ModalBody>
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
          <Field
            type="select"
            label="Единица измерения"
            options={MEASUREUNITS}
            value={state.measure_unit_id}
            error={errors.measure_unit_id}
            onChange={e => this.handleChange('measure_unit_id', e)}
            disabled={!isPermitted}
          />
        </ModalBody>
        <Modal.Footer>
          <Button onClick={() => this.handleSubmit()} disabled={!this.props.canSave || !isPermitted}>Сохранить</Button>
        </Modal.Footer>
      </Modal>
    );
  }

}
