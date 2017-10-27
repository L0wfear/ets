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
  componentDidMount() {
    const { flux } = this.context;

    flux.getActions('autobase').getAutobaseListByType('measureUnit', {}, { makeOptions: true, selectListMapper: defaultSelectListMapper });
    flux.getActions('autobase').getAutobaseListByType('sparePartGroup', {}, { makeOptions: true, selectListMapper: defaultSelectListMapper });
  }

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
      AutobaseOptions: {
        measureUnitOptions = [],
        sparePartGroupOptions = [],
      },
      isPermitted = false,
    } = this.props;

    return (
      <Modal {...this.props} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{'Создание замечания'}</Modal.Title>
        </Modal.Header>
        <Div style={{ padding: 15 }}>
          <Row>
            <Col md={12}>
              <ExtField
                type="select"
                label="Группа"
                error={errors.spare_part_group_id}
                options={sparePartGroupOptions}
                value={state.spare_part_group_id}
                onChange={this.handleChange}
                boundKeys={['spare_part_group_id']}
                disabled={!isPermitted}
                clearable={false}
              />
              <ExtField
                type="string"
                label="Подгруппа"
                value={state.name}
                error={errors.name}
                onChange={this.handleChange}
                boundKeys={['name']}
                disabled={!isPermitted}
              />
              <ExtField
                type="string"
                label="Номер поставки"
                value={state.number}
                error={errors.number}
                onChange={this.handleChange}
                boundKeys={['number']}
                disabled={!isPermitted}
              />
              <ExtField
                type="select"
                label="Единица измерения"
                error={errors.measure_unit_id}
                options={measureUnitOptions}
                value={state.measure_unit_id}
                onChange={this.handleChange}
                boundKeys={['measure_unit_id']}
                disabled={!isPermitted}
                clearable={false}
              />
              <ExtField
                type="number"
                label="Количество"
                value={state.quantity}
                error={errors.quantity}
                onChange={this.handleChange}
                boundKeys={['quantity']}
                disabled={!isPermitted}
              />
              <ExtField
                type="date"
                label="Дата поставки"
                date={state.supplied_at}
                time={false}
                error={errors.supplied_at}
                onChange={this.handleChange}
                boundKeys={['supplied_at']}
                disabled={!isPermitted}
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
