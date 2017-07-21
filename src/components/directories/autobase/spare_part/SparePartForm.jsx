import React from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';

import ModalBody from 'components/ui/Modal';
import { connectToStores } from 'utils/decorators';
import Div from 'components/ui/Div.jsx';
import Field from 'components/ui/Field.jsx';
import Form from 'components/compositions/Form.jsx';

@connectToStores(['autobase'])
export default class SparePartForm extends Form {

  handleChangeWrap = name => (...arg) => this.handleChange(name, ...arg);
  handleSubmitWrap = (...arg) => this.handleSubmit(...arg);

  render() {
    const state = this.props.formState;
    const errors = this.props.formErrors;
    const { sparePartGroupList = [], measureUnitList = [] } = this.props;

    const SPARE_PART_GROUP_OPTION = sparePartGroupList.map(el => ({ value: el.id, label: el.name }));
    const MEASURE_UNIT_OPTIONS = measureUnitList.map(el => ({ value: el.id, label: el.name }));

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
              <Field
                type="select"
                label="Группа"
                error={errors.spare_part_group_id}
                options={SPARE_PART_GROUP_OPTION}
                value={state.spare_part_group_id}
                onChange={this.handleChangeWrap('spare_part_group_id')}
              />
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Field
                type="string"
                label="Номер"
                value={state.number}
                error={errors.number}
                onChange={this.handleChangeWrap('number')}
              />
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Field
                type="string"
                label="Наименование"
                value={state.name}
                error={errors.name}
                onChange={this.handleChangeWrap('name')}
              />
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Field
                type="select"
                label="Единица измерения"
                error={errors.measure_unit_id}
                options={MEASURE_UNIT_OPTIONS}
                value={state.measure_unit_id}
                onChange={this.handleChangeWrap('measure_unit_id')}
              />
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Field
                type="string"
                label="Цена, руб."
                value={state.price}
                error={errors.price}
                onChange={this.handleChangeWrap('price')}
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
