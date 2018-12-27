import React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Col from 'react-bootstrap/lib/Col';
import * as Row from 'react-bootstrap/lib/Row';
import * as Button from 'react-bootstrap/lib/Button';
import { get } from 'lodash';

import { onChangeWithKeys } from 'components/compositions/hoc';
import ModalBody from 'components/ui/Modal';
import { connectToStores } from 'utils/decorators';
import { ExtDiv } from 'components/ui/Div';
import { ExtField } from 'components/ui/new/field/ExtField';
import Form from 'components/compositions/Form';
import TireToVehicleBlockComponent from 'components/directories/autobase/tire/vehicle-block/TireToVehicleBlock';

const TireToVehicleBlock = onChangeWithKeys(TireToVehicleBlockComponent);

@connectToStores(['autobase'])
export default class TireForm extends Form {
  state = {
    canSave: true,
  };
  componentDidMount() {
    const { flux } = this.context;

    flux.getActions('autobase').getAutobaseListByType('tireSize');
    flux.getActions('autobase').getAutobaseListByType('tireModel');
  }
  handleTireToCarValidity = ({ isValidInput }) => {
    this.setState({
      canSave: isValidInput,
    });
  }
  render() {
    const state = this.props.formState;
    const errors = this.props.formErrors;
    const {
      tireModelList = [],
      tireSizeList = [],
      isPermitted = false,
    } = this.props;

    const TIRE_MODEL = tireModelList.map(({ id, name, tire_manufacturer_name }) => ({ value: id, label: name, tire_manufacturer_name }));
    const TIRE_SIZE = tireSizeList.map(({ id, name }) => ({ value: id, label: name }));

    const IS_CREATING = state.id === undefined;

    let title = 'Редактирование карточки шины';
    if (IS_CREATING) title = 'Создание записи';

    return (
      <Modal id="modal-tire" show={this.props.show} onHide={this.props.onHide} bsSize="large" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{ title }</Modal.Title>
        </Modal.Header>
        <ExtDiv style={{ padding: 15 }}>
          <Row>
            <Col md={12}>
              <ExtField
                type="select"
                label="Модель шины"
                options={TIRE_MODEL}
                value={state.tire_model_id}
                error={errors.tire_model_id}
                disabled={!isPermitted}
                onChange={this.handleChange}
                boundKeys="tire_model_id"
                clearable={false}
              />
            </Col>
            <Col md={12}>
              <ExtField
                type={'string'}
                label={'Производитель'}
                value={get(TIRE_MODEL.find((s) => s.value === state.tire_model_id), 'tire_manufacturer_name', '')}
                disabled
              />
            </Col>
            <Col md={12}>
              <ExtField
                type="select"
                label="Размер"
                options={TIRE_SIZE}
                value={state.tire_size_id}
                error={errors.tire_size_id}
                disabled={!isPermitted}
                onChange={this.handleChange}
                boundKeys="tire_size_id"
                clearable={false}
              />
            </Col>
            <ExtDiv hidden={IS_CREATING}>
              <Col sm={6} md={6}>
                <label htmlFor=" ">Пробег, км:</label>
                <span style={{ marginLeft: 10 }}>{state.odometr_diff}</span>
              </Col>
              <Col sm={6} md={6}>
                <label htmlFor=" ">Наработка, мч:</label>
                <span style={{ marginLeft: 10 }}>{state.motohours_diff}</span>
              </Col>
            </ExtDiv>
            <Col md={12}>
              <ExtField
                type="string"
                label="Комментарий"
                value={state.comment}
                error={errors.comment}
                disabled={!isPermitted}
                onChange={this.handleChange}
                boundKeys="comment"
              />
            </Col>
            <ExtDiv nonExist={IS_CREATING}>
              <Col md={12}>
                <h4>Транспортное средство, на котором установлена шина</h4>
                <TireToVehicleBlock
                  onChange={this.handleChange}
                  boundKeys="tire_to_car"
                  inputList={state.tire_to_car || []}
                  onValidation={this.handleTireToCarValidity}
                  disabled={!isPermitted}
                  tireId={state.id}
                  selectField="customId"
                  isPermitted={isPermitted}
                />
              </Col>
            </ExtDiv>
          </Row>
        </ExtDiv>
        <ModalBody />
        <Modal.Footer>
          <Button disabled={!this.props.canSave || !this.state.canSave} onClick={this.handleSubmit}>Сохранить</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
