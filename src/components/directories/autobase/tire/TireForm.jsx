import React from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';
import { get } from 'lodash';

import { onChangeWithKeys } from 'components/compositions/hoc';
import ModalBody from 'components/ui/Modal';
import { connectToStores } from 'utils/decorators';
import { ExtDiv } from 'components/ui/Div.jsx';
import { ExtField } from 'components/ui/Field.jsx';
import Form from 'components/compositions/Form.jsx';
import TireToVehicleBlockComponent from './vehicle-block/TireToVehicleBlock';

const TireToVehicleBlock = onChangeWithKeys(TireToVehicleBlockComponent);

@connectToStores(['autobase'])
export default class TireForm extends Form {
  state = {
    canSave: true,
  };
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
    
    const TIRE_MODEL = tireModelList.map(({ id, name }) => ({ value: id, label: name }));
    const TIRE_SIZE = tireSizeList.map(({ id, name }) => ({ value: id, label: name }));

    const IS_CREATING = state.id === undefined;

    let title = 'Редактирование карточки шины';
    if (IS_CREATING) title = 'Создание записи';

    return (
      <Modal {...this.props} id="modal-tire" bsSize="lg" backdrop="static">
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
                boundKeys={['tire_model_id']}
              />
            </Col>
            <Col md={12}>
              <ExtField
                type={'string'}
                label={'Производитель'}
                value={get(tireModelList.find(s => s.id === state.tire_model_id), 'tire_manufacturer_name', '')}
                emptyValue={null}
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
                boundKeys={['tire_size_id']}
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
                boundKeys={['comment']}
              />
            </Col>
            <ExtDiv nonExist={IS_CREATING}>
              <Col md={12}>
                <h4>Транспортное средство, на котором установлена шина</h4>
                <TireToVehicleBlock
                  onChange={this.handleChange}
                  boundKeys={['tire_to_car']}
                  inputList={state.tire_to_car || []}
                  onValidation={this.handleTireToCarValidity}
                  disabled={!isPermitted}
                  tireId={state.id}
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
