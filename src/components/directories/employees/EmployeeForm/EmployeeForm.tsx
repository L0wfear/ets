import * as React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';
import * as Button from 'react-bootstrap/lib/Button';
import { ExtField } from 'components/ui/new/field/ExtField';
import { FileField } from 'components/ui/input/fields';
import employeePermissions from 'components/directories/employees/config-data/permissions';
import { compose } from 'recompose';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { employeeFormSchema } from 'components/directories/employees/EmployeeForm/employeeFrom-schema';
import { get } from 'lodash';
import employeeActions from 'redux-main/reducers/modules/employee/actions-employee';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';
import companyStructureActions from 'redux-main/reducers/modules/company_structure/actions';

import { getDefaultEmployeeElement, filterCars } from 'components/directories/employees/EmployeeForm/utils';
import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  OwnEmployeeProps,
  PropsEmployee,
  StateEmployee,
  StatePropsEmployee,
  DispatchPropsEmployee,
  PropsEmployeeWithForm,
} from 'components/directories/employees/EmployeeForm/@types/EmployeeForm.h';
import { Employee } from 'redux-main/reducers/modules/employee/@types/employee.h';
import { DivNone } from 'global-styled/global-styled';
import { defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';

class EmployeeForm extends React.PureComponent<PropsEmployee, StateEmployee> {
  state = {
    carOptions: [],
    positionOptions: [],
    companyStructureOptions: [],
    isCommonOptions: [
      { label: 'Да', value: 1 },
      { label: 'Нет', value: 0 },
    ],
    driverStateOptions: [
      { value: 1, label: 'Работает' },
      { value: 0, label: 'Не работает' },
    ],
    categoryDriversLicenseOptions: this.props.category_license.category_drivers_license.map((name) => ({
      value: name,
      label: name,
    })),
    categorySpecialLicenseOptions: this.props.category_license.category_special_license.map((name) => ({
      value: name,
      label: name,
    })),
  };

  componentDidMount() {
    this.loadCars();
    this.loadEmployeePosition();
    this.loadCompanyStructurePosition();
  }
  async loadCars() {
    const { payload: { data } } = await this.props.autobaseGetSetCar();

    this.setState({
      carOptions: data
        .filter((car) => filterCars(car, this.props.formState))
        .map((allData) => ({
          value: allData.asuods_id,
          label: `${allData.gov_number} / ${get(allData, 'garage_number', '-') || '-'} / ${allData.type_name}/ ${allData.full_model_name}/ ${allData.special_model_name || allData.model_name}`,
          allData,
        })),
    });
  }
  async loadEmployeePosition() {
    const { payload: { data, dataIndex } } = await this.props.employeePositionGetSetPosition();
    const positionOptions = data
      .map((allData) => ({
        value: allData.id,
        label: allData.position,
        allData,
      }));

    this.setState({
      positionOptions,
    });

    const { formState: { position_id } } = this.props;

    if (position_id) {
      this.props.handleChange({
        is_driver: get(dataIndex, [position_id, 'is_driver'], false),
      });
    }
  }
  async loadCompanyStructurePosition() {
    const { payload: { data } } = await this.props.companyStructureActions();
    this.setState({
      companyStructureOptions: data.map(defaultSelectListMapper),
    });
  }
  handleChange = (name, value) => {
    this.props.handleChange({
      [name]: get(value, ['target', 'value'], value),
    });
  }
  handleChangeWithValidate = (field, e) => {
    const value = get(e, ['target', 'value'], e);
    if (this.props.formState[field] !== value) {
      const changeObject: any = {
        [field]: value,
      };

      if (field === 'special_license') {
        if (!value) {
          changeObject.special_license_date_end = null;
          changeObject.category_special_license = [];
        }
      }
      if (field === 'drivers_license') {
        if (!value) {
          changeObject.drivers_license_date_end = null;
          changeObject.category_drivers_license = [];
        }
      }

      if (!changeObject[field]) {
        changeObject.prefer_car = null;
        changeObject.secondary_car = [];
      }

      this.props.handleChange(changeObject);
    }
  }
  handleChangePositionId = (field, value) => {
    if (value !== this.props.formState.position_id) {
      const changeObject: any = {
        [field]: value,
        is_driver: false,
        prefer_car: null,
        secondary_car: [],
      };

      if (value) {
        changeObject.is_driver = this.state.positionOptions
          .some(({ allData }) => (
            allData.id === value && allData.is_driver
          ));
      }

      this.props.handleChange(changeObject);
    }
  }
  handleChangeCar = (field, value) => {
    const { formState } = this.props;

    if (formState[field] !== value) {
      const changeObject = {
        [field]: value,
      };

      this.props.handleChange(changeObject);
      this.updateCarOptions({
        ...formState,
        ...changeObject,
      });
    }
  }
  updateCarOptions(formState) {
    this.setState({
      carOptions: this.state.carOptions.filter(({ allData }) => (
        filterCars(
          allData,
          formState,
        )
      )),
    });
  }
  handleHide = () => {
    this.props.handleHide(false);
  }

  render() {
    const {
      formState: state,
      formErrors: errors,
      page,
      path,
    } = this.props;

    const IS_CREATING = !state.id;

    const title = !IS_CREATING ? 'Изменение записи' : 'Создание записи';
    const isPermitted = !IS_CREATING ? this.props.isPermittedToUpdate : this.props.isPermittedToCreate;

    return (
      <Modal id="modal-battery-registry" show onHide={this.handleHide} bsSize="large" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{ title }</Modal.Title>
        </Modal.Header>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
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
                boundKeys="last_name"
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
                boundKeys="personnel_number"
              />
            </Col>
            <Col md={6}>
              <ExtField
                id="first_name"
                type="string"
                label="Имя"
                value={state.first_name}
                error={errors.first_name}
                disabled={!isPermitted}
                onChange={this.handleChange}
                boundKeys="first_name"
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
                boundKeys="special_license"
              />
            </Col>
            <Col md={6}>
              <ExtField
                id="middle_name"
                type="string"
                label="Отчество"
                value={state.middle_name}
                error={errors.middle_name}
                disabled={!isPermitted}
                onChange={this.handleChange}
                boundKeys="middle_name"
              />
            </Col>
            <Col md={6}>
              <ExtField
                id="category_special_license"
                type="select"
                modalKey={path}
                multi
                label="Категория специального удостоверения"
                value={state.category_special_license}
                options={this.state.categorySpecialLicenseOptions}
                error={errors.category_special_license}
                disabled={!isPermitted || !state.special_license}
                onChange={this.handleChange}
                boundKeys="category_special_license"
              />
            </Col>
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
                boundKeys="birthday"
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
                boundKeys="special_license_date_end"
              />
            </Col>
            <Col md={6}>
              <ExtField
                id="phone"
                type="string"
                label="Телефон"
                value={state.phone}
                error={errors.phone}
                disabled={!isPermitted}
                onChange={this.handleChange}
                boundKeys="phone"
              />
            </Col>
            <Col md={6}>
              <ExtField
                id="drivers_license"
                type="string"
                label="Водительское удостоверение"
                value={state.drivers_license}
                error={errors.drivers_license}
                disabled={!isPermitted }
                onChange={this.handleChangeWithValidate}
                boundKeys="drivers_license"
              />
            </Col>
            <Col md={6}>
              <ExtField
                id="position_id"
                type="select"
                modalKey={path}
                label="Должность"
                options={this.state.positionOptions}
                value={state.position_id}
                error={errors.position_id}
                disabled={!isPermitted}
                onChange={this.handleChangePositionId}
                boundKeys="position_id"
                clearable={false}
              />
            </Col>
            <Col md={6}>
              <ExtField
                id="category_drivers_license"
                type="select"
                modalKey={path}
                multi
                label="Категория водительского удостоверения"
                value={state.category_drivers_license}
                options={this.state.categoryDriversLicenseOptions}
                error={errors.category_drivers_license}
                disabled={!isPermitted || !state.drivers_license}
                onChange={this.handleChange}
                boundKeys="category_drivers_license"
              />
            </Col>
            <Col md={6}>
              <ExtField
                id="active"
                type="select"
                modalKey={path}
                label="Состояние"
                value={state.active ? 1 : 0}
                options={this.state.driverStateOptions}
                error={errors.active}
                disabled={!isPermitted}
                onChange={this.handleChange}
                clearable={false}
                boundKeys="active"
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
                boundKeys="drivers_license_date_end"
              />
            </Col>
            <Col md={12}>
              <Row>
                <Col md={6}>
                  <ExtField
                    id="special_marks"
                    type="string"
                    modalKey={path}
                    label="Особые отметки"
                    value={state.special_marks}
                    error={errors.special_marks}
                    disabled={!isPermitted}
                    onChange={this.handleChange}
                    boundKeys="special_marks"
                  />
                </Col>
              </Row>
            </Col>
            <Col md={6}>
              <ExtField
                id="prefer_car"
                type="select"
                modalKey={path}
                label="Основное ТС"
                value={state.prefer_car}
                options={this.state.carOptions}
                error={errors.prefer_car}
                disabled={!isPermitted || !state.is_driver}
                onChange={this.handleChangeCar}
                boundKeys="prefer_car"
              />
            </Col>
            <Col md={6}>
              <ExtField
                id="secondary_car"
                type="select"
                modalKey={path}
                multi
                label="Вторичное ТС"
                value={state.secondary_car}
                options={this.state.carOptions}
                error={errors.secondary_car}
                disabled={!isPermitted || !state.is_driver}
                onChange={this.handleChange}
                boundKeys="secondary_car"
              />
            </Col>
            <Col md={6}>
              <ExtField
                id="company_structure_id"
                type="select"
                modalKey={path}
                label="Подразделение"
                options={this.state.companyStructureOptions}
                value={state.company_structure_id}
                disabled={!isPermitted}
                emptyValue={null}
                onChange={this.handleChange}
                boundKeys="company_structure_id"
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
                boundKeys="medical_certificate"
              />
            </Col>
            <Col md={6}>
              <ExtField
                id="is_common"
                type="select"
                modalKey={path}
                label="Общее"
                options={this.state.isCommonOptions}
                value={state.is_common ? 1 : 0}
                disabled={!isPermitted}
                onChange={this.handleChange}
                boundKeys="is_common"
                clearable={false}
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
                boundKeys="medical_certificate_date"
              />
            </Col>
            <Col md={6}>
              <FileField
                button_id="button-medical_certificate_files"
                id="medical_certificate_files"
                label="Медицинские справки"
                modalKey={path}
                multiple
                value={state.medical_certificate_files}
                onChange={this.handleChange}
                boundKeys="medical_certificate_files"
                disabled={!isPermitted}
              />
            </Col>
            <Col md={6}>
              <FileField
                button_id="button-driver_license_files"
                id="driver_license_files"
                modalKey={path}
                label="Водительские удостоверения"
                multiple
                value={state.driver_license_files}
                onChange={this.handleChange}
                boundKeys="driver_license_files"
                disabled={!isPermitted}
              />
            </Col>
          </Row>
        </ModalBodyPreloader>
        <Modal.Footer>
        {
          isPermitted // либо обновление, либо создание
          ? (
            <Button id="save_employee" disabled={!this.props.canSave} onClick={this.props.defaultSubmit}>Сохранить</Button>
          )
          : (
            <DivNone />
          )
        }
        </Modal.Footer>
      </Modal>
    );
  }
}

export default compose<PropsEmployee, OwnEmployeeProps>(
  connect<StatePropsEmployee, DispatchPropsEmployee, OwnEmployeeProps, ReduxState>(
    (state) => ({
      category_license: state.session.appConfig.category_license,
    }),
    (dispatch, { page, path }) => ({
      createAction: (formState) => (
        dispatch(
          employeeActions.employeeCreateEmployee(
            formState,
            { page, path },
          ),
        )
      ),
      updateAction: (formState) => (
        dispatch(
          employeeActions.employeeUpdateEmployee(
            formState,
            { page, path },
          ),
        )
      ),
      autobaseGetSetCar: () => (
        dispatch(
          autobaseActions.autobaseGetSetCar(
            {},
            { page, path },
          ),
        )
      ),
      employeePositionGetSetPosition: () => (
        dispatch(
          employeeActions.employeePositionGetSetPosition(
            {},
            { page, path },
          ),
        )
      ),
      companyStructureActions: () => (
        dispatch(
          companyStructureActions.companyStructureDriverGetSetCompanyStructureLinear(
            { descendants_by_user: true },
            { page, path },
          ),
        )
      ),
    }),
  ),
  withForm<PropsEmployeeWithForm, Employee>({
    uniqField: 'id',
    mergeElement: (props) => {
      return getDefaultEmployeeElement(props.element);
    },
    schema: employeeFormSchema,
    permissions: employeePermissions,
  }),
)(EmployeeForm);
