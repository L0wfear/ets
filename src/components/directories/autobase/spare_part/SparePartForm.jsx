import React from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';

import ModalBody from 'components/ui/Modal';
import { connectToStores } from 'utils/decorators';
import Div from 'components/ui/Div.jsx';
import { ExtField } from 'components/ui/Field.jsx';
import { defaultSelectListMapper } from 'components/ui/input/EtsSelect';
import Form from 'components/compositions/Form.jsx';

@connectToStores(['autobase'])
export default class SparePartForm extends Form {
  handleSubmitWrap = () => this.handleSubmit();

  render() {
    const [state, errors] = [this.props.formState, this.props.formErrors];
    const { sparePartGroupList = [], measureUnitList = [] } = this.props;

    const SPARE_PART_GROUP_OPTION = sparePartGroupList.map(defaultSelectListMapper);
    const MEASURE_UNIT_OPTIONS = measureUnitList.map(defaultSelectListMapper);

    const IS_CREATING = !state.id;

    let title = 'Изменение записи';
    if (IS_CREATING) title = 'Создание записи';

    return (
      <Modal {...this.props} backdrop="static">
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
                onChange={this.handleChange}
                boundKeys={['spare_part_group_id']}
              />
              <ExtField
                type="string"
                label="Подгруппа"
                value={state.name}
                error={errors.name}
                onChange={this.handleChange}
                boundKeys={['name']}
              />
              <ExtField
                type="string"
                label="Номер поставки"
                value={state.number}
                error={errors.number}
                onChange={this.handleChange}
                boundKeys={['number']}
              />
              <ExtField
                type="select"
                label="Единица измерения"
                error={errors.measure_unit_id}
                options={MEASURE_UNIT_OPTIONS}
                value={state.measure_unit_id}
                onChange={this.handleChange}
                boundKeys={['measure_unit_id']}
              />
              <ExtField
                type="number"
                label="Количество"
                value={state.quantity}
                error={errors.quantity}
                onChange={this.handleChange}
                boundKeys={['quantity']}
              />
              <ExtField
                type="date"
                label="Дата поставки"
                date={state.supplied_at}
                time={false}
                error={errors.supplied_at}
                onChange={this.handleChange}
                boundKeys={['supplied_at']}
              />
            </Col>
          </Row>
        </Div>
        <ModalBody />
        <Modal.Footer>
          <Button disabled={!this.props.canSave} onClick={this.handleSubmitWrap}>Сохранить</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
