import * as React from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';
import ModalBody from 'components/ui/Modal';
import { ExtField } from 'components/ui/Field.jsx';
import { defaultSelectListMapper } from 'components/ui/input/EtsSelect';
import Div from 'components/ui/Div.jsx';
import connectToStores from 'flummox/connect';

import withFormMethods from 'components/compositions/vokinda-hoc/form/withFormMethods';

const SparePartForm = props => {
  const {
    formState: state,
    formErrors: errors,
  } = props;

  const SPARE_PART_GROUP_OPTION = props.sparePartGroupList.map(defaultSelectListMapper);
  const MEASURE_UNIT_OPTIONS = props.measureUnitList.map(defaultSelectListMapper);

  const IS_CREATING = !state.id;

  let title = 'Изменение записи';
  if (IS_CREATING) title = 'Создание записи';

  return (
    <Modal {...props} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-lg">{ title }</Modal.Title>
      </Modal.Header>
      <Div style={{ padding: 15 }}>
        <Row>
          <Col md={12}>
            <ExtField
              type="select"
              label="Группа"
              error={errors.spare_part_group_id}
              options={SPARE_PART_GROUP_OPTION}
              value={state.spare_part_group_id}
              onChange={props.handleChange}
              boundKeys={['spare_part_group_id']}
            />
            <ExtField
              type="string"
              label="Подгруппа"
              value={state.name}
              error={errors.name}
              onChange={props.handleChange}
              boundKeys={['name']}
            />
            <ExtField
              type="string"
              label="Номер поставки"
              value={state.number}
              error={errors.number}
              onChange={props.handleChange}
              boundKeys={['number']}
            />
            <ExtField
              type="select"
              label="Единица измерения"
              error={errors.measure_unit_id}
              options={MEASURE_UNIT_OPTIONS}
              value={state.measure_unit_id}
              onChange={props.handleChange}
              boundKeys={['measure_unit_id']}
            />
            <ExtField
              type="number"
              label="Количество"
              value={state.quantity}
              error={errors.quantity}
              onChange={props.handleChange}
              boundKeys={['quantity']}
            />
            <ExtField
              type="date"
              label="Дата поставки"
              date={state.supplied_at}
              time={false}
              error={errors.supplied_at}
              onChange={props.handleChange}
              boundKeys={['supplied_at']}
            />
          </Col>
        </Row>
      </Div>
      <ModalBody />
      <Modal.Footer>
        <Button disabled={!props.canSave} onClick={props.handleSubmit}>Сохранить</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default withFormMethods()
  (connectToStores(SparePartForm, ['autobase']));