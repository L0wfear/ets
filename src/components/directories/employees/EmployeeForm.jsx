import React, { Component } from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';
import Div from 'components/ui/Div.jsx';
import Field from 'components/ui/Field.jsx';
import Form from '../../compositions/Form.jsx';
import { connectToStores } from 'utils/decorators';

@connectToStores(['objects'])
export default class EmployeeForm extends Form {

  constructor(props) {
    super(props);

    this.state = {
      cars: [],
      companyStructureList: [],
    };
  }

  async componentDidMount() {
    const { flux } = this.context;
    flux.getActions('objects').getCars();
    flux.getActions('objects').getPositions();
    const companyStructureList = await flux.getActions('companyStructure').getLinearCompanyStructureForUser();
    this.setState({ companyStructureList });
  }

  render() {
    const state = this.props.formState;
    const errors = this.props.formErrors;
    const { carsList = [], positionsList = [] } = this.props;
    const { companyStructureList = [] } = this.state;
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

        <Modal.Body>

          <Row>

            <Col md={6}>
              <Div>
                <Field
                  type="string"
                  label="Фамилия"
                  value={state.last_name}
                  error={errors.last_name}
                  onChange={this.handleChange.bind(this, 'last_name')}
                />
              </Div>
              <Div>
                <Field
                  type="string"
                  label="Имя"
                  value={state.first_name}
                  error={errors.first_name}
                  onChange={this.handleChange.bind(this, 'first_name')}
                />
              </Div>
              <Div>
                <Field
                  type="string"
                  label="Отчество"
                  value={state.middle_name}
                  error={errors.middle_name}
                  onChange={this.handleChange.bind(this, 'middle_name')}
                />
              </Div>
              <Div>
                <Field
                  type="date"
                  label="Дата рождения"
                  date={state.birthday}
                  time={false}
                  error={errors.birthday}
                  onChange={this.handleChange.bind(this, 'birthday')}
                />
              </Div>
              <Div>
                <Field
                  type="string"
                  label="Телефон"
                  value={state.phone}
                  error={errors.phone}
                  onChange={this.handleChange.bind(this, 'phone')}
                />
              </Div>
              <Div>
                <Field
                  type="select"
                  label="Должность"
                  options={POSITION_ELEMENTS}
                  value={state.position_id}
                  error={errors.position_id}
                  onChange={this.handleChange.bind(this, 'position_id')}
                />
              </Div>
              <Div>
                <Field type="select" label="Подразделение"
                  options={COMPANY_ELEMENTS}
                  value={state.company_structure_id}
                  onChange={this.handleChange.bind(this, 'company_structure_id')}
                />
              </Div>
            </Col>

            <Col md={6}>
              <Div>
                <Field
                  type="number"
                  label="Табельный номер"
                  value={state.personnel_number}
                  error={errors.personnel_number}
                  onChange={this.handleChange.bind(this, 'personnel_number')}
                />
              </Div>
              <Div>
                <Field
                  type="string"
                  label="Специальное удостоверение"
                  value={state.special_license}
                  error={errors.special_license}
                  onChange={this.handleChange.bind(this, 'special_license')}
                />
              </Div>
              <Div>
                <Field
                  type="string"
                  label="Водительское удостоверение"
                  value={state.drivers_license}
                  error={errors.drivers_license}
                  onChange={this.handleChange.bind(this, 'drivers_license')}
                />
              </Div>
              <Div>
                <Field
                  type="select"
                  label="Предпочитаемое ТрС"
                  value={state.prefer_car}
                  options={CARS}
                  error={errors.prefer_car}
                  onChange={this.handleChange.bind(this, 'prefer_car')}
                />
              </Div>
              <Div>
                <Field
                  type="select"
                  label="Состояние"
                  value={state.active ? 1 : 0}
                  options={DRIVER_STATES}
                  error={errors.active}
                  onChange={this.handleChange.bind(this, 'active')}
                />
              </Div>
              <Div>
                <Field
                  type="string"
                  label="Медицинская справка №"
                  value={state.medical_certificate}
                  error={errors.medical_certificate}
                  onChange={this.handleChange.bind(this, 'medical_certificate')}
                />
              </Div>
              <Div>
                <Field
                  type="date"
                  label="Срок действия медицинской справки"
                  date={state.medical_certificate_date}
                  time={false}
                  error={errors.medical_certificate_date}
                  onChange={this.handleChange.bind(this, 'medical_certificate_date')}
                />
              </Div>
              <Div>
                <Field
                  type="string"
                  label="СНИЛС №"
                  value={state.snils}
                  error={errors.snils}
                  onChange={this.handleChange.bind(this, 'snils')}
                />
              </Div>
            </Col>

          </Row>

        </Modal.Body>
        <Modal.Footer>
          <Button disabled={!this.props.canSave} onClick={this.handleSubmit.bind(this)}>Сохранить</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
