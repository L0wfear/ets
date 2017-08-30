import React from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';
import ModalBody from 'components/ui/Modal';
import Div from 'components/ui/Div.jsx';
import Field from 'components/ui/Field.jsx';
import Form from '../../compositions/Form.jsx';
import { connectToStores } from 'utils/decorators';

@connectToStores(['objects', 'companyStructure'])
export default class EmployeeForm extends Form {
  handleSave = () => {
    if (Object.keys(this.props.location.query).length > 0) {
      this.props.history.replaceState(null, this.props.location.pathname, {});
    }

    this.handleSubmit();
  }
  render() {
    const [state, errors] = [this.props.formState, this.props.formErrors];
    const {
      carsList = [],
      positionsList = [],
      companyStructureList = [],
      isPermitted = false,
    } = this.props;

    const CARS = carsList.map(c => ({ value: c.asuods_id, label: `${c.gov_number} [${c.special_model_name || ''}${c.special_model_name ? '/' : ''}${c.model_name || ''}]` }));
    const COMPANY_ELEMENTS = companyStructureList.map(el => ({ value: el.id, label: el.name }));
    const DRIVER_STATES = [{ value: 1, label: 'Работает' }, { value: 0, label: 'Не работает' }];
    const POSITION_ELEMENTS = positionsList.map(el => ({ value: el.id, label: el.position }));

    const IS_CREATING = !!!state.id;

    let title = 'Изменение сотрудника';
    if (IS_CREATING) title = 'Создание сотрудника';

    return (
      <Modal {...this.props} bsSize="large" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{ title }</Modal.Title>
        </Modal.Header>
        <Div style={{ padding: 15 }}>
          <Row>
            <Col md={6}>
              <Field
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
                type="string"
                label="Специальное удостоверение"
                value={state.special_license}
                error={errors.special_license}
                disabled={!isPermitted}
                onChange={this.handleChange.bind(this, 'special_license')}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Field
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
                type="string"
                label="Водительское удостоверение"
                value={state.drivers_license}
                error={errors.drivers_license}
                disabled={!isPermitted}
                onChange={this.handleChange.bind(this, 'drivers_license')}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Field
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
                type="select"
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
                type="select"
                label="Состояние"
                value={state.active ? 1 : 0}
                options={DRIVER_STATES}
                error={errors.active}
                disabled={!isPermitted}
                onChange={this.handleChange.bind(this, 'active')}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Field
                type="select"
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
              <Field type="select" label="Подразделение"
                options={COMPANY_ELEMENTS}
                value={state.company_structure_id}
                disabled={!isPermitted}
                emptyValue={null}
                onChange={this.handleChange.bind(this, 'company_structure_id')}
              />
            </Col>
            <Col md={6}>
              <Field
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
                type="select"
                label="Общее"
                options={[{ label: 'Да', value: 1 }, { label: 'Нет', value: 0 }]}
                value={state.is_common ? 1 : 0}
                disabled={!isPermitted}
                onChange={this.handleChange.bind(this, 'is_common')}
              />
            </Col>
            <Col md={6}>
              <Field
                type="string"
                label="СНИЛС №"
                value={state.snils}
                error={errors.snils}
                disabled={!isPermitted}
                onChange={this.handleChange.bind(this, 'snils')}
              />
            </Col>
          </Row>
        </Div>
        <ModalBody />
        <Modal.Footer>
          <Button disabled={!this.props.canSave} onClick={this.handleSave}>Сохранить</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
