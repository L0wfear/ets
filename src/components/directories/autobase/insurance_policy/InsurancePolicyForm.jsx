import React from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';

import ModalBody from 'components/ui/Modal';
import { ExtDiv } from 'components/ui/Div.jsx';
import { ExtField } from 'components/ui/Field.jsx';
import { FileField } from 'components/ui/input/fields';
import { defaultSelectListMapper } from 'components/ui/input/EtsSelect';
import Form from 'components/compositions/Form.jsx';
import { connectToStores } from 'utils/decorators';


@connectToStores(['autobase', 'objects'])
export default class InsurancePolicyForm extends Form {
  state = {
    areFilesLoading: false,
  }
  componentWillMount() {
    const { flux } = this.context;
    flux.getActions('objects').getCars();

    const { car_id = -1 } = this.props;

    if (car_id >= 0) {
      this.handleChange('car_id', car_id);
    }
    flux.getActions('autobase').getAutobaseListByType('insuranceType', {}, { makeOptions: true, selectListMapper: defaultSelectListMapper });
  }
  handleSubmitWrap = () => this.handleSubmit();
  hanleFileLoading = indicator => this.setState({ areFilesLoading: indicator })

  render() {
    const {
      car_id = -1,
      carsList = [],
      AutobaseOptions: {
        insuranceTypeOptions = [],
      },
      isPermitted = false,
    } = this.props;

    const [
      state = {},
      errors = {},
    ] = [this.props.formState, this.props.formErrors];

    const CAR_LIST_OPTION = carsList.map(el => ({ value: el.asuods_id, label: el.gov_number }));

    const IS_CREATING = !state.id;

    let title = 'Изменение записи';
    if (IS_CREATING) title = 'Добавление записи';

    return (
      <Modal {...this.props} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{ title }</Modal.Title>
        </Modal.Header>
        <ExtDiv style={{ padding: 15 }}>
          <Row>
            <Col md={12}>
              {IS_CREATING && car_id === -1 &&
                <ExtField
                  type="select"
                  label="Номер транспортного средства"
                  value={state.car_id}
                  error={errors.car_id}
                  options={CAR_LIST_OPTION}
                  emptyValue={null}
                  onChange={this.handleChange}
                  boundKeys={['car_id']}
                  clearable={false}
                  disabled={!isPermitted}
                />
              }
              <ExtField
                type={'string'}
                label={'Страховая организация'}
                value={state.insurer}
                error={errors.insurer}
                onChange={this.handleChange}
                boundKeys={['insurer']}
                disabled={!isPermitted}
              />
              <ExtField
                type={'select'}
                label={'Тип страхования'}
                value={state.insurance_type_id}
                error={errors.insurance_type_id}
                options={insuranceTypeOptions}
                emptyValue={null}
                onChange={this.handleChange}
                boundKeys={['insurance_type_id']}
                clearable={false}
                disabled={!isPermitted}
              />
              <ExtField
                type={'string'}
                label={'Серия'}
                value={state.seria}
                error={errors.seria}
                onChange={this.handleChange}
                boundKeys={['seria']}
                disabled={!isPermitted}
              />
              <ExtField
                type={'number'}
                label={'Номер'}
                value={state.number}
                error={errors.number}
                onChange={this.handleChange}
                boundKeys={['number']}
                disabled={!isPermitted}
              />
              <ExtField
                type={'date'}
                label={'Дата начала действия'}
                date={state.date_start}
                time={false}
                error={errors.date_start}
                onChange={this.handleChange}
                boundKeys={['date_start']}
                disabled={!isPermitted}
              />
              <ExtField
                type={'date'}
                label={'Дата окончания действия'}
                date={state.date_end}
                time={false}
                error={errors.date_end}
                onChange={this.handleChange}
                boundKeys={['date_end']}
                disabled={!isPermitted}
              />
              <ExtField
                type={'number'}
                label={'Стоимость, руб.'}
                value={state.price}
                error={errors.price}
                onChange={this.handleChange}
                boundKeys={['price']}
                disabled={!isPermitted}
              />
              <ExtField
                type={'text'}
                label={'Примечание'}
                value={state.note}
                error={errors.note}
                onChange={this.handleChange}
                boundKeys={['note']}
                disabled={!isPermitted}
              />
              <FileField
                label="Файл"
                value={state.files}
                error={errors.files}
                onChange={this.handleChange}
                boundKeys={['files']}
                isLoading={this.hanleFileLoading}
                disabled={!isPermitted}
              />
            </Col>
          </Row>
        </ExtDiv>
        <ModalBody />
        <Modal.Footer>
          <Button disabled={!this.props.canSave} onClick={this.handleSubmitWrap}>Сохранить</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
