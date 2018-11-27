import React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Button from 'react-bootstrap/lib/Button';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';

import { get } from 'lodash';

import { defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';
import { connectToStores } from 'utils/decorators';

import ModalBody from 'components/ui/Modal';
import { ExtDiv } from 'components/ui/Div';
import { ExtField } from 'components/ui/new/field/ExtField';
import { loadingOverlay } from 'components/ui/LoadingOverlay';
import { FileField } from 'components/ui/input/fields';
import { diffDates } from 'utils/dates';

import Form from 'components/compositions/Form';
import { isArray } from 'util';

function filterCars(car, formState) {
  let norm = false;
  const secondary_car = get(formState, 'secondary_car', []);
  const prefer_car = get(formState, 'prefer_car', null);

  if (prefer_car && prefer_car === car.asuods_id || isArray(secondary_car) && secondary_car.includes(car.asuods_id)) {
    norm = true;
  } else if (car.available_to_bind) {
    if (
      formState &&
      formState.drivers_license_date_end &&
      diffDates(formState.drivers_license_date_end, new Date()) > 0 &&
      car.for_driver_license
    ) {
      norm = true;
    }
    if (
      formState.special_license &&
      formState.special_license_date_end &&
      diffDates(formState.special_license_date_end, new Date()) > 0 &&
      car.for_special_license
    ) {
      norm = true;
    }
  }

  return norm;
}

const modalKey = 'employee';


@connectToStores(['objects'])
@loadingOverlay
export default class EmployeeForm extends Form {
  handleSave = () => this.handleSubmit();

  handleChangeWithValidate = (field, e) => {
    if (field === 'special_license') {
      if (!e.target.value) {
        this.handleChange('special_license_date_end', null);
      }
    }
    if (field === 'drivers_license') {
      if (!e.target.value) {
        this.handleChange('drivers_license_date_end', null);
      }
    }

    this.handleChange(field, e);
    if (!e.target.value) {
      this.handleChange('prefer_car', null);
      this.handleChange('secondary_car', null);
    }
  }

  handleChangePositionId =(field, e) => {
    this.handleChange(field, e);
    this.handleChange('prefer_car', null);
    this.handleChange('secondary_car', null);
  }

  render() {
    const [state, errors] = [this.props.formState, this.props.formErrors];
    const {
      carsList = [],
      positionsList = [],
      companyStructureLinearForUserList = [],
      isPermitted = false,
      onOverlayLoading,
    } = this.props;

    const CARS = carsList
      .filter((car) => filterCars(car, state))
      .map((c) => ({ value: c.asuods_id, label: `${c.gov_number}/ ${c.garage_number ? c.garage_number : '-'}/ ${c.type_name}/ ${c.full_model_name}/ ${c.special_model_name || c.model_name}` }));
    const COMPANY_ELEMENTS = companyStructureLinearForUserList.map(defaultSelectListMapper);
    const DRIVER_STATES = [{ value: 1, label: 'Работает' }, { value: 0, label: 'Не работает' }];
    const POSITION_ELEMENTS = positionsList.map((el) => ({ value: el.id, label: el.position, isDriver: el.is_driver }));
    const positionIsDriver = (POSITION_ELEMENTS.find(({ value }) => value === state.position_id) || {}).isDriver; // флаг, если должность подразумевает управление транспортным средством
    const IS_CREATING = !state.id;

    let title = 'Изменение сотрудника';
    if (IS_CREATING) title = 'Создание сотрудника';

    return (
      <Modal id="modal-employee" show={this.props.show} onHide={this.props.onHide} bsSize="large" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{ title }</Modal.Title>
        </Modal.Header>
        <ExtDiv style={{ padding: 15 }}>
          <Row>
            <Col md={6}>
              <ExtField
                id="last_name"
                type="string"
                label="Фамилия"
                value={state.last_name}
                error={errors.last_name}
                disabled={!isPermitted}
                onChange={this.handleChange}
                boundKeys={['last_name']}
              />
            </Col>
            <Col md={6}>
              <ExtField
                id="personnel_number"
                type="string"
                label="Табельный номер"
                value={state.personnel_number}
                error={errors.personnel_number}
                disabled={!isPermitted}
                onChange={this.handleChange}
                boundKeys={['personnel_number']}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <ExtField
                id="first_name"
                type="string"
                label="Имя"
                value={state.first_name}
                error={errors.first_name}
                disabled={!isPermitted}
                onChange={this.handleChange}
                boundKeys={['first_name']}
              />
            </Col>
            <Col md={6}>
              <ExtField
                id="special_license"
                type="string"
                label="Специальное удостоверение"
                value={state.special_license}
                error={errors.special_license}
                disabled={!isPermitted}
                onChange={this.handleChangeWithValidate}
                boundKeys={['special_license']}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <ExtField
                id="middle_name"
                type="string"
                label="Отчество"
                value={state.middle_name}
                error={errors.middle_name}
                disabled={!isPermitted}
                onChange={this.handleChange}
                boundKeys={['middle_name']}
              />
            </Col>
            <Col md={6}>
              <ExtField
                id="special_license_date_end"
                type="date"
                label="Срок действия специального удостоверения"
                date={state.special_license_date_end}
                time={false}
                error={errors.special_license_date_end}
                disabled={!isPermitted || !state.special_license}
                onChange={this.handleChange}
                boundKeys={['special_license_date_end']}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <ExtField
                id="birthday"
                type="date"
                label="Дата рождения"
                date={state.birthday}
                time={false}
                error={errors.birthday}
                disabled={!isPermitted}
                onChange={this.handleChange}
                boundKeys={['birthday']}
              />
            </Col>
            <Col md={6}>
              <ExtField
                id="drivers_license"
                label="Водительское удостоверение"
                value={state.drivers_license}
                error={errors.drivers_license}
                disabled={!isPermitted}
                onChange={this.handleChangeWithValidate}
                boundKeys={['drivers_license']}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <ExtField
                id="phone"
                label="Телефон"
                value={state.phone}
                error={errors.phone}
                disabled={!isPermitted}
                onChange={this.handleChange}
                boundKeys={['phone']}
              />
            </Col>
            <Col md={6}>
              <ExtField
                id="drivers_license_date_end"
                type="date"
                label="Срок действия водительского удостоверения"
                date={state.drivers_license_date_end}
                time={false}
                error={errors.drivers_license_date_end}
                disabled={!isPermitted || !state.drivers_license}
                onChange={this.handleChange}
                boundKeys={['drivers_license_date_end']}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <ExtField
                id="position_id"
                type="select"
                modalKey={modalKey}
                label="Должность"
                options={POSITION_ELEMENTS}
                value={state.position_id}
                error={errors.position_id}
                disabled={!isPermitted}
                onChange={this.handleChangePositionId}
                boundKeys={['position_id']}
                clearable={false}
              />
            </Col>
            <Col md={6}>
              <ExtField
                id="prefer_car"
                type="select"
                modalKey={modalKey}
                label="Основное ТС"
                value={state.prefer_car}
                options={CARS}
                error={errors.prefer_car}
                disabled={!isPermitted || !positionIsDriver}
                onChange={this.handleChange}
                boundKeys={['prefer_car']}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <ExtField
                id="active"
                type="select"
                modalKey={modalKey}
                label="Состояние"
                value={state.active ? 1 : 0}
                options={DRIVER_STATES}
                error={errors.active}
                disabled={!isPermitted}
                onChange={this.handleChange}
                boundKeys={['active']}
              />
            </Col>
            <Col md={6}>
              <ExtField
                id="secondary_car"
                type="select"
                modalKey={modalKey}
                multi
                label="Вторичное ТС"
                value={state.secondary_car}
                options={CARS}
                error={errors.secondary_car}
                disabled={!isPermitted || !positionIsDriver}
                onChange={this.handleChange}
                boundKeys={['secondary_car']}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <ExtField
                id="company_structure_id"
                type="select"
                modalKey={modalKey}
                label="Подразделение"
                options={COMPANY_ELEMENTS}
                value={state.company_structure_id}
                disabled={!isPermitted}
                emptyValue={null}
                onChange={this.handleChange}
                boundKeys={['company_structure_id']}
              />
            </Col>
            <Col md={6}>
              <ExtField
                id="medical_certificate"
                type="string"
                label="Медицинская справка №"
                value={state.medical_certificate}
                error={errors.medical_certificate}
                disabled={!isPermitted}
                onChange={this.handleChange}
                boundKeys={['medical_certificate']}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <ExtField
                id="is_common"
                type="select"
                modalKey={modalKey}
                label="Общее"
                options={[{ label: 'Да', value: 1 }, { label: 'Нет', value: 0 }]}
                value={state.is_common ? 1 : 0}
                disabled={!isPermitted}
                onChange={this.handleChange}
                boundKeys={['is_common']}
              />
            </Col>
            <Col md={6}>
              <ExtField
                id="medical_certificate_date"
                type="date"
                label="Срок действия медицинской справки"
                date={state.medical_certificate_date}
                time={false}
                error={errors.medical_certificate_date}
                disabled={!isPermitted}
                onChange={this.handleChange}
                boundKeys={['medical_certificate_date']}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FileField
                button_id="button-medical_certificate_files"
                id="medical_certificate_files"
                label="Медицинские справки"
                modalKey={modalKey}
                multiple
                value={state.medical_certificate_files}
                onChange={this.handleChange}
                boundKeys={['medical_certificate_files']}
                isLoading={onOverlayLoading}
                disabled={!isPermitted}
              />
            </Col>
            <Col md={6}>
              <FileField
                button_id="button-driver_license_files"
                id="driver_license_files"
                modalKey={modalKey}
                label="Водительские удостоверения"
                multiple
                value={state.driver_license_files}
                onChange={this.handleChange}
                boundKeys={['driver_license_files']}
                isLoading={onOverlayLoading}
                disabled={!isPermitted}
              />
            </Col>
          </Row>
        </ExtDiv>
        <ModalBody />
        <Modal.Footer>
          <Button id="save_employee" disabled={!this.props.canSave} onClick={this.handleSave}>Сохранить</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
