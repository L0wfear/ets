import React from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';
import ModalBody from 'components/ui/Modal';
import Div from 'components/ui/Div.jsx';
import Field from 'components/ui/Field.jsx';
import { loadingOverlay } from 'components/ui/LoadingOverlay';
import { FileField } from 'components/ui/input/fields';
import { connectToStores } from 'utils/decorators';

import Form from '../../compositions/Form.jsx';

const modalKey = 'employee';

@connectToStores(['objects', 'companyStructure'])
@loadingOverlay
export default class EmployeeForm extends Form {
  handleSave = () => {
    if (Object.keys(this.props.location.query).length > 0) {
      this.props.history.replaceState(null, this.props.location.pathname, {});
    }

    this.handleSubmit();
  }

  handleChangeWithValidate(field, e) {
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
  }

  render() {
    const [state, errors] = [this.props.formState, this.props.formErrors];
    const {
      carsList = [],
      positionsList = [],
      companyStructureList = [],
      isPermitted = false,
      onOverlayLoading,
    } = this.props;

    const CARS = carsList.map(c => ({ value: c.asuods_id, label: `${c.gov_number} [${c.special_model_name || ''}${c.special_model_name ? '/' : ''}${c.model_name || ''}]` }));
    const COMPANY_ELEMENTS = companyStructureList.map(el => ({ value: el.id, label: el.name }));
    const DRIVER_STATES = [{ value: 1, label: 'Работает' }, { value: 0, label: 'Не работает' }];
    const POSITION_ELEMENTS = positionsList.map(el => ({ value: el.id, label: el.position }));

    const IS_CREATING = !!!state.id;

    let title = 'Изменение сотрудника';
    if (IS_CREATING) title = 'Создание сотрудника';

    return (
      <Modal {...this.props} id="modal-employee" bsSize="large" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{ title }</Modal.Title>
        </Modal.Header>
        <Div style={{ padding: 15 }}>
          <Row>
            <Col md={6}>
              <Field
                id="last_name"
                type="string"
                label="Фамилия"
                value={state.last_name}
                error={errors.last_name}
                disabled={!isPermitted}
                onChange={this.handleChange.bind(this, 'last_name')}
              />
            </Col>
            <Col md={6}>
              <Field
                id="personnel_number"
                type="string"
                label="Табельный номер"
                value={state.personnel_number}
                error={errors.personnel_number}
                disabled={!isPermitted}
                onChange={this.handleChange.bind(this, 'personnel_number')}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Field
                id="first_name"
                type="string"
                label="Имя"
                value={state.first_name}
                error={errors.first_name}
                disabled={!isPermitted}
                onChange={this.handleChange.bind(this, 'first_name')}
              />
            </Col>
            <Col md={6}>
              <Field
                id="special_license"
                type="string"
                label="Специальное удостоверение"
                value={state.special_license}
                error={errors.special_license}
                disabled={!isPermitted}
                onChange={this.handleChangeWithValidate.bind(this, 'special_license')}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Field
                id="middle_name"
                type="string"
                label="Отчество"
                value={state.middle_name}
                error={errors.middle_name}
                disabled={!isPermitted}
                onChange={this.handleChange.bind(this, 'middle_name')}
              />
            </Col>
            <Col md={6}>
              <Field
                id="special_license_date_end"
                type="date"
                label="Срок действия специального удостоверения"
                date={state.special_license_date_end}
                time={false}
                error={errors.special_license_date_end}
                disabled={!isPermitted || !state.special_license}
                onChange={this.handleChange.bind(this, 'special_license_date_end')}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Field
                id="birthday"
                type="date"
                label="Дата рождения"
                date={state.birthday}
                time={false}
                error={errors.birthday}
                disabled={!isPermitted}
                onChange={this.handleChange.bind(this, 'birthday')}
              />
            </Col>
            <Col md={6}>
              <Field
                id="drivers_license"
                type="string"
                label="Водительское удостоверение"
                value={state.drivers_license}
                error={errors.drivers_license}
                disabled={!isPermitted}
                onChange={this.handleChangeWithValidate.bind(this, 'drivers_license')}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Field
                id="phone"
                type="string"
                label="Телефон"
                value={state.phone}
                error={errors.phone}
                disabled={!isPermitted}
                onChange={this.handleChange.bind(this, 'phone')}
              />
            </Col>
            <Col md={6}>
              <Field
                id="drivers_license_date_end"
                type="date"
                label="Срок действия водительского удостоверения"
                date={state.drivers_license_date_end}
                time={false}
                error={errors.drivers_license_date_end}
                disabled={!isPermitted || !state.drivers_license}
                onChange={this.handleChange.bind(this, 'drivers_license_date_end')}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Field
                id="position_id"
                type="select"
                modalKey={modalKey}
                label="Должность"
                options={POSITION_ELEMENTS}
                value={state.position_id}
                error={errors.position_id}
                disabled={!isPermitted}
                onChange={this.handleChange.bind(this, 'position_id')}
              />
            </Col>
            <Col md={6}>
              <Field
                id="prefer_car"
                type="select"
                modalKey={modalKey}
                label="Предпочитаемое ТрС"
                value={state.prefer_car}
                options={CARS}
                error={errors.prefer_car}
                disabled={!isPermitted}
                onChange={this.handleChange.bind(this, 'prefer_car')}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Field
                id="active"
                type="select"
                modalKey={modalKey}
                label="Состояние"
                value={state.active ? 1 : 0}
                options={DRIVER_STATES}
                error={errors.active}
                disabled={!isPermitted}
                onChange={this.handleChange.bind(this, 'active')}
              />
            </Col>
            <Col md={6}>
              <Field
                id="medical_certificate"
                type="string"
                label="Медицинская справка №"
                value={state.medical_certificate}
                error={errors.medical_certificate}
                disabled={!isPermitted}
                onChange={this.handleChange.bind(this, 'medical_certificate')}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Field
                id="company_structure_id"
                type="select"
                modalKey={modalKey}
                label="Подразделение"
                options={COMPANY_ELEMENTS}
                value={state.company_structure_id}
                disabled={!isPermitted}
                emptyValue={null}
                onChange={this.handleChange.bind(this, 'company_structure_id')}
              />
            </Col>
            <Col md={6}>
              <Field
                id="medical_certificate_date"
                type="date"
                label="Срок действия медицинской справки"
                date={state.medical_certificate_date}
                time={false}
                error={errors.medical_certificate_date}
                disabled={!isPermitted}
                onChange={this.handleChange.bind(this, 'medical_certificate_date')}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Field
                id="is_common"
                type="select"
                modalKey={modalKey}
                label="Общее"
                options={[{ label: 'Да', value: 1 }, { label: 'Нет', value: 0 }]}
                value={state.is_common ? 1 : 0}
                disabled={!isPermitted}
                onChange={this.handleChange.bind(this, 'is_common')}
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
        </Div>
        <ModalBody />
        <Modal.Footer>
          <Button id="save_employee" disabled={!this.props.canSave} onClick={this.handleSave}>Сохранить</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
