import * as React from 'react';
import { compose } from 'recompose';
import { get } from 'lodash';
import { connect } from 'react-redux';
import * as moment from 'moment';
import { Option } from 'react-select/src/filters';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import ExtField from 'components/@next/@ui/renderFields/Field';
import { FileField } from 'components/old/ui/input/fields';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { employeeFormSchema } from 'components/new/pages/nsi/employee/form/schema';
import employeeActions from 'redux-main/reducers/modules/employee/actions-employee';
import { getSetCompanyStructureDescendantsByUser } from 'redux-main/reducers/modules/company_structure/actions';

import { getDefaultEmployeeElement, filterCars } from 'components/new/pages/nsi/employee/form/utils';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import {
  OwnEmployeeProps,
  PropsEmployee,
  StateEmployee,
  StatePropsEmployee,
  PropsEmployeeWithForm,
} from 'components/new/pages/nsi/employee/form/@types/EmployeeForm.h';
import { Employee } from 'redux-main/reducers/modules/employee/@types/employee.h';
import { defaultSelectListMapper } from 'components/old/ui/input/ReactSelect/utils';
import employeePermissions from 'components/new/pages/nsi/employee/_config-data/permissions';

import AsigmentView from 'components/new/pages/nsi/employee/form/asigmentView';
import { employeePositionGetSetPosition } from 'redux-main/reducers/modules/employee/position/actions';
import { autobaseGetSetCar } from 'redux-main/reducers/modules/autobase/car/actions';
import memoizeOne from 'memoize-one';
import { carActualOptionLabelGarage } from 'components/@next/@utils/formatData/formatDataOptions';

class EmployeeForm extends React.PureComponent<PropsEmployee, StateEmployee> {
  constructor(props) {
    super(props);

    const categoryDriversLicenseOptions = props.category_license.category_drivers_license.map((name) => ({
      value: name,
      label: name
    }));
    const categorySpecialLicenseOptions = props.category_license.category_special_license.map((name) => ({
      value: name,
      label: name
    }));

    const driverStateOptions = [
      {
        label: 'Работает',
        value: 1
      }, {
        label: 'Не работает',
        value: 0
      },
    ];
    
    const isCommonOptions = [
      {
        label: 'Да',
        value: 1
      }, {
        label: 'Нет',
        value: 0
      },
    ];

    this.state = {
      carList: [],
      categoryDriversLicenseOptions,
      categorySpecialLicenseOptions,
      companyStructureOptions: [],
      driverStateOptions,
      isCommonOptions,
      positionOptions: [],
      preferCarOptions: [],
      secondaryCarOptions: []
    };
  }

  public componentDidMount() {
    this.loadCars();
    this.loadEmployeePosition();
    this.loadCompanyStructurePosition();
  }

  public componentDidUpdate(prevProps) {
    if (this.props.formState.secondary_car !== prevProps.formState.secondary_car 
      || this.props.formState.prefer_car !== prevProps.formState.prefer_car) {
      this.updateCarOptions(this.props.formState);
    }
  }

  private async loadCars(): Promise<void> {
    const { data } = await this.props.dispatch(
      autobaseGetSetCar(
        {},
        this.props,
      ),
    );

    this.setState({
      carList: data,
      preferCarOptions: this.makeCarOptions(data, this.props.formState, 'prefer_car'),
      secondaryCarOptions: this.makeCarOptions(data, this.props.formState, 'secondary_car'),
    });
  }

  private async loadEmployeePosition(): Promise<void>  {
    const { data, dataIndex } = await this.props.dispatch(
      employeePositionGetSetPosition(
        {},
        this.props,
      ),
    );
    const positionOptions = data
      .map((rowData) => ({
        value: rowData.id,
        label: rowData.position,
        rowData,
      }));

    this.setState({
      positionOptions,
    });

    const { formState: { position_id } } = this.props;

    if (position_id) {
      const positionInfo = dataIndex[position_id];

      this.props.handleChange({
        is_driver: positionInfo ? positionInfo.is_driver : false,
      });
    }
  }

  private async loadCompanyStructurePosition(): Promise<void>  {
    const { data } = await this.props.dispatch(
      getSetCompanyStructureDescendantsByUser(
        {},
        this.props,
      ),
    );
    this.setState({
      companyStructureOptions: data.map(defaultSelectListMapper),
    });
  }

  private readonly makeCarOptions = memoizeOne((
    carList: StateEmployee['carList'],
    formState: PropsEmployee['formState'],
    fieldType: 'prefer_car' | 'secondary_car',
  ) => {
    return carList
      .filter((car) => 
        filterCars(car, formState, fieldType)
      ).map((rowData) => ({
        value: rowData.asuods_id,
        label: carActualOptionLabelGarage(rowData),
        rowData,
        is_invalid: rowData.asuods_id === formState.prefer_car,
      }));
  });

  private readonly handleChangeDateEnd = (type: 'special_license_date_end' | 'drivers_license_date_end', value: Date): void => {
    const { handleChange, formState } = this.props;

    handleChange({
      [type]: value,
    });

    this.updateCarOptions({
      ...formState,
      [type]: value,
    });
  };

  private readonly handleChangeWithValidate = (field, e): void => {
    const value = get(e, ['target', 'value'], e);
    if (this.props.formState[field] !== value) {
      const changeObject: any = {
        [field]: value,
      };

      if (field === 'special_license') {
        if (!changeObject[field]) {
          changeObject.special_license_date_end = null;
          changeObject.category_special_license = [];
        }
      }
      if (field === 'drivers_license') {
        if (!changeObject[field]) {
          changeObject.drivers_license_date_end = null;
          changeObject.category_drivers_license = [];
        }
      }

      if (!changeObject[field]) {
        changeObject.prefer_car = null;
        changeObject.secondary_car = [];

        this.updateCarOptions({
          ...{
            ...this.props.formState,
            ...changeObject,
          },
        });
      }
      
      this.props.handleChange(changeObject);
    }
  };

  private readonly handleChangePositionId = (field, value): void => {
    if (value !== this.props.formState.position_id) {
      const changeObject: any = {
        [field]: value,
        is_driver: false,
        prefer_car: null,
        secondary_car: [],
      };

      if (value) {
        changeObject.is_driver = this.state.positionOptions
          .some(({ rowData }) => (
            rowData.id === value && rowData.is_driver
          ));
      }

      this.props.handleChange(changeObject);
    }
  };

  private readonly handleChangeCar = (field, value): void => {
    const { formState } = this.props;

    if (formState[field] !== value) {
      const changeObject = {
        [field]: value,
      };

      this.props.handleChange(changeObject);
    }
  };

  private updateCarOptions(formState: PropsEmployee['formState']): void {
    this.setState({
      preferCarOptions: this.makeCarOptions(this.state.carList, formState, 'prefer_car'),
      secondaryCarOptions: this.makeCarOptions(this.state.carList, formState, 'secondary_car'),
    });
  }

  // ХХХ-ХХХ-ХХХ YY
  private readonly handleChangeSnils = (fieldKey: keyof Employee, fieldValue: string): void => {
    let value = get(fieldValue, 'target.value', null);

    if (value) {
      value = value.match(/\d+/g).join('');
      value = [
        value.slice(0, 3),
        value.slice(3, 6),
        value.slice(6, 9),
        value.slice(9, 11),
      ].filter((v) => Boolean(v)).reduce(
        (str, partStr, index) => {
          if (index === 0) {
            return partStr;
          }
          if (index === 3) {
            return `${str} ${partStr}`;
          }
          return `${str}-${partStr}`;
        },
        '',
      );
    }

    this.props.handleChange({
      [fieldKey]: value,
    });
  };

  private readonly licenseEndDateFilterOption = (option: Option, value: string): boolean => {
    const { formState } = this.props;
    const { special_license_date_end, drivers_license_date_end } = formState;

    const licencePeriod: [string, string] = [special_license_date_end, drivers_license_date_end];
    const isValidOptionForLicencePeriod: boolean = licencePeriod.some((license_date_end: string): boolean =>
      Boolean(license_date_end) && moment(license_date_end).isSameOrAfter(moment(), 'day'));

    if (isValidOptionForLicencePeriod) {
      return option.label.toLocaleLowerCase().includes(value.toLocaleLowerCase());
    }

    return isValidOptionForLicencePeriod;
  };

  public render() {
    const {
      formState: state,
      formErrors: errors,
      page,
      path,
    } = this.props;

    const IS_CREATING = !state.id;

    const title = !IS_CREATING ? 'Изменение записи' : 'Создание сотрудника';
    const isPermitted = !IS_CREATING ? this.props.isPermittedToUpdate : this.props.isPermittedToCreate;
    
    return (
      <EtsBootstrap.ModalContainer id="modal-battery-registry" show onHide={this.props.hideWithoutChanges} bsSize="large">
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>{ title }</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={12}>
              <EtsBootstrap.Row>
                <EtsBootstrap.Col md={6}>
                  <ExtField
                    id="last_name"
                    type="string"
                    label="Фамилия"
                    value={state.last_name}
                    error={errors.last_name}
                    disabled={!isPermitted}
                    onChange={this.props.handleChange}
                    boundKeys="last_name"
                  />
                </EtsBootstrap.Col>
                <EtsBootstrap.Col md={6}>
                  <ExtField
                    id="personnel_number"
                    type="string"
                    label="Табельный номер"
                    value={state.personnel_number}
                    error={errors.personnel_number}
                    disabled={!isPermitted}
                    onChange={this.props.handleChange}
                    boundKeys="personnel_number"
                  />
                </EtsBootstrap.Col>
              </EtsBootstrap.Row>
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={12}>
              <EtsBootstrap.Row>
                <EtsBootstrap.Col md={6}>
                  <ExtField
                    id="first_name"
                    type="string"
                    label="Имя"
                    value={state.first_name}
                    error={errors.first_name}
                    disabled={!isPermitted}
                    onChange={this.props.handleChange}
                    boundKeys="first_name"
                  />
                </EtsBootstrap.Col>
                <EtsBootstrap.Col md={6}>
                  <ExtField
                    id="snils"
                    type="string"
                    label="СНИЛС"
                    value={state.snils}
                    error={errors.snils}
                    disabled={!isPermitted}
                    onChange={this.handleChangeSnils}
                    boundKeys="snils"
                    maxLength={14}
                  />
                </EtsBootstrap.Col>
              </EtsBootstrap.Row>
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={12}>
              <EtsBootstrap.Row>
                <EtsBootstrap.Col md={6}>
                  <ExtField
                    id="middle_name"
                    type="string"
                    label="Отчество"
                    value={state.middle_name}
                    error={errors.middle_name}
                    disabled={!isPermitted}
                    onChange={this.props.handleChange}
                    boundKeys="middle_name"
                  />
                </EtsBootstrap.Col>
                <EtsBootstrap.Col md={6}>
                  <ExtField
                    id="special_license"
                    type="string"
                    label="Специальное удостоверение"
                    value={state.special_license}
                    error={errors.special_license}
                    disabled={!isPermitted}
                    onChange={this.handleChangeWithValidate}
                    boundKeys="special_license"
                    hint="Поле «Специальное удостоверение» должно содержать 10 символов. В качестве символов допустимо использовать цифры (0-9) и 12 букв алфавита кириллицы в верхнем регистре: А, В, Е, К, М, Н, О, Р, С, Т, У и Х."
                    toUpperCase
                  />
                </EtsBootstrap.Col>
              </EtsBootstrap.Row>
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={12}>
              <EtsBootstrap.Row>
                <EtsBootstrap.Col md={6}>
                  <ExtField
                    id="birthday"
                    type="date"
                    label="Дата рождения"
                    date={state.birthday}
                    time={false}
                    error={errors.birthday}
                    disabled={!isPermitted}
                    onChange={this.props.handleChange}
                    boundKeys="birthday"
                  />
                </EtsBootstrap.Col>
                <EtsBootstrap.Col md={6}>
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
                    onChange={this.props.handleChange}
                    boundKeys="category_special_license"
                  />
                </EtsBootstrap.Col>
              </EtsBootstrap.Row>
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={12}>
              <EtsBootstrap.Row>
                <EtsBootstrap.Col md={6}>
                  <ExtField
                    id="phone"
                    type="string"
                    label="Телефон"
                    value={state.phone}
                    error={errors.phone}
                    disabled={!isPermitted}
                    onChange={this.props.handleChange}
                    boundKeys="phone"
                  />
                </EtsBootstrap.Col>
                <EtsBootstrap.Col md={6}>
                  <ExtField
                    id="special_license_date_end"
                    type="date"
                    label="Срок действия специального удостоверения"
                    date={state.special_license_date_end}
                    time={false}
                    error={errors.special_license_date_end}
                    disabled={!isPermitted || !state.special_license}
                    onChange={this.handleChangeDateEnd}
                    boundKeys="special_license_date_end"
                  />
                </EtsBootstrap.Col>
              </EtsBootstrap.Row>
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={12}>
              <EtsBootstrap.Row>
                <EtsBootstrap.Col md={6}>
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
                </EtsBootstrap.Col>
                <EtsBootstrap.Col md={6}>
                  <ExtField
                    id="drivers_license"
                    type="string"
                    label="Водительское удостоверение"
                    value={state.drivers_license}
                    error={errors.drivers_license}
                    disabled={!isPermitted }
                    onChange={this.handleChangeWithValidate}
                    boundKeys="drivers_license"
                    hint="Поле «Водительское удостоверение» должно содержать 10 символов. В качестве символов допустимо использовать цифры (0-9) и 12 букв алфавита кириллицы в верхнем регистре: А, В, Е, К, М, Н, О, Р, С, Т, У и Х."
                    toUpperCase
                  />
                </EtsBootstrap.Col>
              </EtsBootstrap.Row>
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={12}>
              <EtsBootstrap.Row>
                <EtsBootstrap.Col md={6}>
                  <ExtField
                    id="active"
                    type="select"
                    modalKey={path}
                    label="Состояние"
                    value={state.active ? 1 : 0}
                    options={this.state.driverStateOptions}
                    error={errors.active}
                    disabled={!isPermitted}
                    onChange={this.props.handleChange}
                    clearable={false}
                    boundKeys="active"
                  />
                </EtsBootstrap.Col>
                <EtsBootstrap.Col md={6}>
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
                    onChange={this.props.handleChange}
                    boundKeys="category_drivers_license"
                  />
                </EtsBootstrap.Col>
              </EtsBootstrap.Row>
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={12}>
              <EtsBootstrap.Row>
                <EtsBootstrap.Col md={6}>
                  <ExtField
                    id="special_marks"
                    type="string"
                    modalKey={path}
                    label="Особые отметки"
                    value={state.special_marks}
                    error={errors.special_marks}
                    disabled={!isPermitted}
                    onChange={this.props.handleChange}
                    boundKeys="special_marks"
                  />
                </EtsBootstrap.Col>
                <EtsBootstrap.Col md={6}>
                  <ExtField
                    id="drivers_license_date_end"
                    type="date"
                    label="Срок действия водительского удостоверения"
                    date={state.drivers_license_date_end}
                    time={false}
                    error={errors.drivers_license_date_end}
                    disabled={!isPermitted || !state.drivers_license}
                    onChange={this.handleChangeDateEnd}
                    boundKeys="drivers_license_date_end"
                  />
                </EtsBootstrap.Col>
              </EtsBootstrap.Row>
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={12}>
              <EtsBootstrap.Row>
                <EtsBootstrap.Col md={6}>
                  <ExtField
                    id="prefer_car"
                    type="select"
                    modalKey={path}
                    label="Основное ТС"
                    value={state.prefer_car}
                    options={this.state.preferCarOptions}
                    filterOption={this.licenseEndDateFilterOption}
                    error={errors.prefer_car}
                    disabled={!isPermitted}
                    onChange={this.handleChangeCar}
                    boundKeys="prefer_car"
                  />
                </EtsBootstrap.Col>
                <EtsBootstrap.Col md={6}>
                  <ExtField
                    id="secondary_car"
                    type="select"
                    modalKey={path}
                    multi
                    label="Вторичное ТС"
                    value={state.secondary_car}
                    filterOption={this.licenseEndDateFilterOption}
                    options={this.state.secondaryCarOptions}
                    error={errors.secondary_car}
                    disabled={!isPermitted }
                    onChange={this.props.handleChange}
                    boundKeys="secondary_car"
                  />
                </EtsBootstrap.Col>
              </EtsBootstrap.Row>
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={12}>
              <EtsBootstrap.Row>
                <EtsBootstrap.Col md={6}>
                  <ExtField
                    id="company_structure_id"
                    type="select"
                    modalKey={path}
                    label="Подразделение"
                    options={this.state.companyStructureOptions}
                    value={state.company_structure_id}
                    disabled={!isPermitted}
                    emptyValue={null}
                    onChange={this.props.handleChange}
                    boundKeys="company_structure_id"
                  />
                </EtsBootstrap.Col>
                <EtsBootstrap.Col md={6}>
                  <ExtField
                    id="medical_certificate"
                    type="string"
                    label="Медицинская справка №"
                    value={state.medical_certificate}
                    error={errors.medical_certificate}
                    disabled={!isPermitted}
                    onChange={this.props.handleChange}
                    boundKeys="medical_certificate"
                  />
                </EtsBootstrap.Col>
              </EtsBootstrap.Row>
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={12}>
              <EtsBootstrap.Row>
                <EtsBootstrap.Col md={6}>
                  <ExtField
                    id="is_common"
                    type="select"
                    modalKey={path}
                    label="Общее"
                    options={this.state.isCommonOptions}
                    value={state.is_common ? 1 : 0}
                    disabled={!isPermitted}
                    onChange={this.props.handleChange}
                    boundKeys="is_common"
                    clearable={false}
                  />
                </EtsBootstrap.Col>
              </EtsBootstrap.Row>
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={12}>
              <EtsBootstrap.Row>
                <EtsBootstrap.Col md={6}>
                  <FileField
                    button_id="button-medical_certificate_files"
                    id="medical_certificate_files"
                    label="Медицинские справки"
                    modalKey={path}
                    multiple
                    value={state.medical_certificate_files}
                    onChange={this.props.handleChange}
                    boundKeys="medical_certificate_files"
                    disabled={!isPermitted}
                  />
                </EtsBootstrap.Col>
                <EtsBootstrap.Col md={6}>
                  <FileField
                    button_id="button-driver_license_files"
                    id="driver_license_files"
                    modalKey={path}
                    label="Водительские удостоверения"
                    multiple
                    value={state.driver_license_files}
                    onChange={this.props.handleChange}
                    boundKeys="driver_license_files"
                    disabled={!isPermitted}
                  />
                </EtsBootstrap.Col>
              </EtsBootstrap.Row>
            </EtsBootstrap.Col>
            <AsigmentView
              handleChange = {this.props.handleChange}
              state = {state}
              errors = {errors}
              IS_CREATING = {IS_CREATING}
              isPermitted = {isPermitted}
              path= {path}
            >
            </AsigmentView>
          </EtsBootstrap.Row>
        </ModalBodyPreloader>
        <EtsBootstrap.ModalFooter>
          {
            isPermitted && (
              <EtsBootstrap.Button id="save_employee" disabled={!this.props.canSave} onClick={this.props.defaultSubmit}>Сохранить</EtsBootstrap.Button>
            )
          }
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  }
}

export default compose<PropsEmployee, OwnEmployeeProps>(
  connect<StatePropsEmployee, {}, OwnEmployeeProps, ReduxState>(
    (state) => ({
      category_license: state.session.appConfig.category_license,
    }),
  ),
  withForm<PropsEmployeeWithForm, Employee>({
    uniqField: 'id',
    createAction: employeeActions.employeeCreateEmployee,
    updateAction: employeeActions.employeeUpdateEmployee,
    mergeElement: (props) => {
      return getDefaultEmployeeElement(props.element);
    },
    schema: employeeFormSchema,
    permissions: employeePermissions,
  }),
)(EmployeeForm);
