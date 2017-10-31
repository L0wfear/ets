import React from 'react';
import { autobind } from 'core-decorators';
import connectToStores from 'flummox/connect';
import { Modal, Row, Col, Button } from 'react-bootstrap';
import _ from 'lodash';

import ModalBody from 'components/ui/Modal';
import Field from 'components/ui/Field.jsx';
import DivForEnhance from 'components/ui/Div.jsx';
import {
  isNotNull,
  isEmpty,
  hasMotohours,
  isEqualOr,
} from 'utils/functions';
import { driverHasLicense, driverHasSpecialLicense, getCars, getDrivers, getTrailers, validateTaxesControl } from './utils';

import { employeeFIOLabelFunction } from 'utils/labelFunctions';
import { notifications } from 'utils/notifications';
import Form from '../compositions/Form.jsx';
import Taxes from './Taxes.jsx';
import WaybillFooter from './form/WaybillFooter';
import BsnoStatus from './form/BsnoStatus';
import MissionFormWrap from '../missions/mission/MissionFormWrap.jsx';
import { getDefaultMission } from '../../stores/MissionsStore.js';
import enhanceWithPermissions from '../util/RequirePermissions.jsx';

const Div = enhanceWithPermissions(DivForEnhance);

const MISSIONS_RESTRICTION_STATUS_LIST = ['active', 'draft'];

@autobind
class WaybillForm extends Form {

  constructor(props) {
    super(props);

    this.state = {
      operations: [],
      equipmentOperations: [],
      fuelRates: [],
      equipmentFuelRates: [],
      fuel_correction_rate: 1,
      showMissionForm: false,
      selectedMission: null,
      canEditIfClose: null,
      loadingFields: {},
      fuelRateAllList: [],
    };

    this.employeeFIOLabelFunction = () => {};
  }
  componentWillUnmount() {
    if (typeof this.ws !== 'undefined') {
      this.ws.close();
      this.ws = null;
    }
  }

  componentWillReceiveProps(props) {
    const currentState = this.props.formState;
    const nextState = props.formState;
    if (nextState.car_id !== currentState.car_id && nextState.car_id) {
      this.getLatestWaybillDriver(nextState);
    }

    // при смене планируемых дат или ТС запрашиваются новые доступные задания
    if (currentState.car_id !== nextState.car_id ||
        !_.isEqual(currentState.plan_arrival_date, nextState.plan_arrival_date) ||
        !_.isEqual(currentState.plan_departure_date, nextState.plan_departure_date)) {
      this.getMissionsByCarAndDates(nextState);
    }

    if (currentState.status === 'active') {
      if (currentState.car_id !== nextState.car_id ||
          !_.isEqual(currentState.fact_arrival_date, nextState.fact_arrival_date) ||
          !_.isEqual(currentState.fact_departure_date, nextState.fact_departure_date)) {
        this.getCarDistance(nextState);
        this.getMissionsByCarAndDates(nextState);
      }
    }
  }

  async componentDidMount() {
    const { formState } = this.props;
    const { flux } = this.context;

    const IS_CREATING = !formState.status;
    const IS_DRAFT = formState.status && formState.status === 'draft';

    if (IS_CREATING || IS_DRAFT) {
      flux.getActions('fuelRates').getFuelRates().then(({ result = [] }) => this.setState({ fuelRateAllList: result.map(d => d.car_model_id) }));
    }

    this.employeeFIOLabelFunction = employeeFIOLabelFunction(flux);

    if (formState.status === 'active') {
      const car = _.find(this.props.carsList, c => c.asuods_id === formState.car_id) || {};
      const fuel_correction_rate = car.fuel_correction_rate || 1;
      flux.getActions('fuelRates').getFuelRatesByCarModel(formState.car_id).then((r) => {
        const fuelRates = r.result.map(({ operation_id, rate_on_date }) => ({ operation_id, rate_on_date }));
        flux.getActions('fuelRates').getFuelOperations().then((fuelOperations) => {
          const operations = _.filter(fuelOperations.result, op => _.find(fuelRates, fr => fr.operation_id === op.id));
          flux.getActions('fuelRates').getEquipmentFuelRatesByCarModel(formState.car_id).then((equipmentFuelRatesResponse) => {
            const equipmentFuelRates = equipmentFuelRatesResponse.result.map(({ operation_id, rate_on_date }) => ({ operation_id, rate_on_date }));
            flux.getActions('fuelRates').getFuelOperations().then((equipmentFuelOperations) => {
              const equipmentOperations = _.filter(equipmentFuelOperations.result, op => _.find(equipmentFuelRates, fr => fr.operation_id === op.id));
              this.setState({ fuelRates, operations, fuel_correction_rate, equipmentFuelRates, equipmentOperations });
            });
          });
        });
      });
      this.getCarDistance(formState);
    } else if (formState.status === 'closed') {
      /* В случае, если ПЛ закрыт, мы получаем список всех операций, чтобы
         отобразить их в таксировке как ТС, так и оборудования, так как
         выбор операций в любом случае недоступен */
      flux.getActions('fuelRates').getFuelOperations().then((fuelOperations) => {
        this.setState({
          operations: fuelOperations.result,
          equipmentOperations: fuelOperations.result,
        });
      });
      this.getCarDistance(formState);
    }

    this.getMissionsByCarAndDates(formState, false);
    await flux.getActions('objects').getCars();
    await flux.getActions('employees').getEmployees();
    flux.getActions('objects').getWorkMode();

    this.getWaybillDrivers();

    if (formState && formState.id) {
      const waybillInfo = await flux.getActions('waybills').getWaybill(formState.id);
      const canEditIfClose = waybillInfo.result.closed_editable && flux.getStore('session').getPermission('waybill.update_closed') || false;
      this.setState({ canEditIfClose, origFormState: formState });
    }
  }
  handlePlanDepartureDates(field, value) {
    if (value === null) {
      return;
    }

    this.getWaybillDrivers({
      [field]: value,
    });
    this.handleChange(field, value);
  }
  async getWaybillDrivers({
    plan_departure_date = this.props.formState.plan_departure_date,
    plan_arrival_date = this.props.formState.plan_arrival_date,
  } = {}) {
    const IS_CREATING = !this.props.formState.status;
    const IS_DRAFT = this.props.formState.status && this.props.formState.status === 'draft';

    if (IS_CREATING || IS_DRAFT) {
      await this.context.flux.getActions('employees').getWaybillDrivers({
        company_id: this.props.formState.company_id,
        date_from: plan_departure_date,
        date_to: plan_arrival_date,
      });
    }
  }
  getMissionsByCarAndDates(formState, notificate = true) {
    const { flux } = this.context;
    const departure_date = formState.fact_departure_date || formState.plan_departure_date;
    const arrival_date = formState.fact_arrival_date || formState.plan_arrival_date;
    const oldMissions = this.props.missionsList;
    flux.getActions('missions').getMissionsByCarAndDates(
      formState.car_id,
      departure_date,
      arrival_date,
      formState.status
    ).then((response) => {
      const availableMissions = response && response.result ? response.result.rows.map(el => el.id) : [];
      const currentMissions = formState.mission_id_list;
      let newMissions = [];
      if (formState.status === 'active') {
        newMissions = currentMissions;
        let { notAvailableMissions = [] } = this.state;
        notAvailableMissions = notAvailableMissions
          .concat(currentMissions
            .filter(el => !availableMissions.includes(el) && !notAvailableMissions.find(m => m.id === el))
            .map(id => oldMissions.find(el => el.id === id))
          )
          .filter(m => m);
        this.setState({ notAvailableMissions });
      } else {
        newMissions = currentMissions.filter(el => availableMissions.includes(el));
      }
      this.props.handleFormChange('mission_id_list', newMissions);
      notificate && global.NOTIFICATION_SYSTEM.notify(notifications.missionsByCarAndDateUpdateNotification);
    });
  }

  getCarDistance(formState) {
    const { flux } = this.context;
    const { loadingFields } = this.state;
    if (formState.status === 'closed') {
      loadingFields.distance = false;
      loadingFields.consumption = false;
      this.setState({ loadingFields });
      return;
    }
    const car = _.find(this.props.carsList, c => c.asuods_id === formState.car_id) || {};
    loadingFields.distance = true;
    loadingFields.consumption = true;
    this.setState({ loadingFields });
    flux.getActions('cars').getInfoFromCar(car.gps_code, formState.fact_departure_date, formState.fact_arrival_date)
      .then(({ distance, consumption }) => {
        this.props.handleFormChange('distance', parseFloat(distance / 1000).toFixed(3));
        this.props.handleFormChange('consumption', consumption !== null ? parseFloat(consumption).toFixed(3) : null);
        const { loadingFields } = this.state;
        loadingFields.distance = false;
        loadingFields.consumption = false;
        this.setState({ loadingFields });
      })
      .catch(() => {
        // this.props.handleFormChange('distance', parseFloat(distance / 100).toFixed(2));
        const { loadingFields } = this.state;
        loadingFields.distance = false;
        loadingFields.consumption = false;
        this.setState({ loadingFields });
      });
  }

  getLatestWaybillDriver(formState) {
    const { flux } = this.context;
    flux.getActions('waybills').getLatestWaybillDriver(
      formState.car_id,
      formState.driver_id
    ).then((response) => {
      const newDriverId = response && response.result ? response.result.driver_id : null;
      if (newDriverId) {
        const driver = this.props.waybillDriversList.find(item => item.id === newDriverId) || null;
        if (driver === null) return;

        const { gov_number } = formState;
        const hasLicense = hasMotohours(gov_number) && driverHasLicense(driver);
        const hasSpecialLicense = !hasMotohours(gov_number) && driverHasSpecialLicense(driver);

        if (hasLicense || hasSpecialLicense) {
          this.props.handleFormChange('driver_id', newDriverId);
        }

        return;
      }

      /**
       * Сбрасываем водителя, так как в новом, отфильтрованнои по ТС
       * списке, водителей может уже не быть.
       */
      this.props.handleFormChange('driver_id', '');
    });
  }

  async onCarChange(car_id, cars) {
    const selectedCar = cars[0] || {};
    const { flux } = this.context;

    let fieldsToChange = {
      car_id,
      gov_number: selectedCar.gov_number,
    };
    if (!isEmpty(car_id)) {

      const [state = {}] = [this.props.formState];
      const { fuelRateAllList = [] } = this.state;

      if (!fuelRateAllList.includes(selectedCar.model_id)) {
        global.NOTIFICATION_SYSTEM.notify(notifications.missionFuelRateByCarUpdateNotification);
      }

      const lastCarUsedWaybillObject = await flux.getActions('waybills').getLastClosedWaybill(car_id);
      const lastCarUsedWaybill = lastCarUsedWaybillObject.result;
      const additionalFields = this.getFieldsToChangeBasedOnLastWaybill(lastCarUsedWaybill);

      fieldsToChange = {
        ...fieldsToChange,
        ...additionalFields,
      };
    } else {
      /**
       * Если ТС не выбрано, то и ранее выбранного водителя не должно быть.
       */
      fieldsToChange = {
        ...fieldsToChange,
        driver_id: '',
      };
    }

    this.props.handleMultipleChange(fieldsToChange);
  }


  async handleEquipmentFuelChange(equipment_fuel) {
    const { flux } = this.context;
    const state = this.props.formState;
    const fieldsToChange = {
      equipment_fuel,
    };
    const lastCarUsedWaybillObject = await flux.getActions('waybills').getLastClosedWaybill(state.car_id);
    const lastCarUsedWaybill = lastCarUsedWaybillObject.result;

    if (lastCarUsedWaybill && lastCarUsedWaybill.equipment_fuel) {
      fieldsToChange.equipment_fuel_type = lastCarUsedWaybill.equipment_fuel_type;
      fieldsToChange.equipment_fuel_start = lastCarUsedWaybill.equipment_fuel_end;
    }

    this.props.handleMultipleChange(fieldsToChange);
  }

  getFieldsToChangeBasedOnLastWaybill([lastCarUsedWaybill]) {
    const fieldsToChange = {};
    if (isNotNull(lastCarUsedWaybill)) {
      if (isNotNull(lastCarUsedWaybill.fuel_end)) {
        fieldsToChange.fuel_start = lastCarUsedWaybill.fuel_end;
      }
      if (isNotNull(lastCarUsedWaybill.odometr_end)) {
        fieldsToChange.odometr_start = lastCarUsedWaybill.odometr_end;
      }
      if (isNotNull(lastCarUsedWaybill.motohours_end)) {
        fieldsToChange.motohours_start = lastCarUsedWaybill.motohours_end;
      }
      if (isNotNull(lastCarUsedWaybill.motohours_equip_end)) {
        fieldsToChange.motohours_equip_start = lastCarUsedWaybill.motohours_equip_end;
      }
    } else {
      fieldsToChange.fuel_start = 0;
      fieldsToChange.odometr_start = 0;
      fieldsToChange.motohours_start = 0;
      fieldsToChange.motohours_equip_start = 0;
    }

    return fieldsToChange;
  }

  onMissionFormHide(result) {
    const id = result && result.result ? result.result.id : null;
    if (id) {
      const { mission_id_list } = this.props.formState;
      mission_id_list.push(id);
      this.handleChange('mission_id_list', mission_id_list);
    }
    this.componentDidMount();
    this.setState({ showMissionForm: false, selectedMission: null });
  }

  createMission() {
    const newMission = getDefaultMission(this.props.formState.plan_departure_date, this.props.formState.plan_arrival_date);
    newMission.car_id = this.props.formState.car_id;
    newMission.structure_id = this.props.formState.structure_id;
    this.setState({ showMissionForm: true, selectedMission: newMission });
  }

  /**
   * Обновляет данные формы на основе закрытого ПЛ
   */
  async refresh() {
    const state = this.props.formState;
    const { flux } = this.context;

    const lastCarUsedWaybillObject = await flux.getActions('waybills').getLastClosedWaybill(state.car_id);
    const lastCarUsedWaybill = lastCarUsedWaybillObject.result;
    const fieldsToChange = this.getFieldsToChangeBasedOnLastWaybill(lastCarUsedWaybill);

    this.props.handleMultipleChange(fieldsToChange);
  }

  handleMissionsChange(v) {
    const { formState } = this.props;
    const newFormData = !isEmpty(v) ? v.split(',').map(d => parseInt(d, 10)) : [];
    const oldFormData = formState.mission_id_list;
    const IS_CREATING = !formState.status;

    const shouldBeChanged = (
      IS_CREATING ||
      (
        isEqualOr(MISSIONS_RESTRICTION_STATUS_LIST, formState.status) &&
        newFormData.length >= 1 &&
        formState.can_delete_missions
      )
    );

    this.handleChange('mission_id_list', shouldBeChanged ? newFormData : oldFormData);
  }

  handleStructureIdChange(v) {
    const carsList = this.props.carsList.filter(c => v == null ? true : (c.company_structure_id === v || c.is_common));
    if (!_.find(carsList, c => c.asuods_id === this.props.formState.car_id)) {
      this.props.handleMultipleChange({ car_id: '', driver_id: '', structure_id: v });
    } else {
      this.handleChange('structure_id', v);
    }
  }

  handleSubmit = () => {
    delete this.props.formState.is_bnso_broken;
    this.props.onSubmit();
  }

  render() {
    const state = this.props.formState;
    const errors = this.props.formErrors;
    const {
      loadingFields,
      origFormState = {},
      notAvailableMissions = [],
    } = this.state;

    const {
      carsList = [],
      carsIndex = {},
      waybillDriversList = [],
      employeesList = [],
      missionsList = [],
      appConfig,
      workModeOptions,
    } = this.props;

    let taxesControl = false;

    const getCarsByStructId = getCars(state.structure_id);
    const getTrailersByStructId = getTrailers(state.structure_id);

    const CARS = getCarsByStructId(carsList);
    const TRAILERS = getTrailersByStructId(carsList);

    const FUEL_TYPES = _.map(appConfig.enums.FUEL_TYPE, (v, k) => ({ value: k, label: v }));

    // const DRIVERS = waybillDriversList.map((d) => {
    //   const personnel_number = d.personnel_number ? `[${d.personnel_number}] ` : '';
    //   return { value: d.id, label: `${personnel_number}${d.last_name || ''} ${d.first_name || ''} ${d.middle_name || ''}` };
    // });


    const driversEnability = state.car_id !== null && state.car_id !== '';

    const DRIVERS = getDrivers(state.gov_number, waybillDriversList);


    const MISSIONS = missionsList.map(({ id, number, technical_operation_name }) => ({ value: id, label: `№${number} (${technical_operation_name})`, clearableValue: false }));
    const OUTSIDEMISSIONS = notAvailableMissions.map(({ id, number, technical_operation_name }) => ({ value: id, label: `№${number} (${technical_operation_name})`, clearableValue: false, number, className: 'yellow' }));

    const currentStructureId = this.context.flux.getStore('session').getCurrentUser().structure_id;
    const STRUCTURES = this.context.flux.getStore('session').getCurrentUser().structures.map(({ id, name }) => ({ value: id, label: name }));

    let STRUCTURE_FIELD_VIEW = false;
    let STRUCTURE_FIELD_READONLY = false;
    let STRUCTURE_FIELD_DELETABLE = false;
    if (currentStructureId !== null && STRUCTURES.length === 1 && currentStructureId === STRUCTURES[0].value) {
      STRUCTURE_FIELD_VIEW = true;
      STRUCTURE_FIELD_READONLY = true;
    } else if (currentStructureId !== null && STRUCTURES.length > 1 && _.find(STRUCTURES, el => el.value === currentStructureId)) {
      STRUCTURE_FIELD_VIEW = true;
    } else if (currentStructureId === null && STRUCTURES.length > 1) {
      STRUCTURE_FIELD_VIEW = true;
      STRUCTURE_FIELD_DELETABLE = true;
    }

    const EMPLOYEES = employeesList.map(({ id, full_name }) => ({ value: id, label: full_name }));

    const IS_CREATING = !state.status;
    const IS_ACTIVE = state.status && state.status === 'active';
    const IS_DRAFT = state.status && state.status === 'draft';
    const IS_CLOSED = state.status && state.status === 'closed';

    const car = carsIndex[state.car_id];
    const trailer = carsIndex[state.trailer_id];
    const CAR_HAS_ODOMETER = state.gov_number ? !hasMotohours(state.gov_number) : null;

    let title = '';

    if (IS_CREATING) {
      title = 'Создать новый путевой лист';
    }

    if (IS_ACTIVE) {
      title = 'Закрыть путевой лист';
    }

    if (IS_CLOSED) {
      title = 'Просмотр путевого листа ';
    }

    if (IS_DRAFT) {
      title = 'Создание нового путевого листа';
    }

    taxesControl = validateTaxesControl([state.tax_data, state.equipment_tax_data]);

    if (IS_DRAFT && state.driver_id !== undefined && DRIVERS.every(d => d.value !== state.driver_id)) {
      DRIVERS.push({ label: this.employeeFIOLabelFunction(state.driver_id), value: state.driver_id });
    }

    return (
      <Modal {...this.props} bsSize="large" backdrop="static">

        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{title} { IS_DRAFT && '(возможна корректировка)'} { (IS_CLOSED || IS_ACTIVE) && `№ ${state.number}`}</Modal.Title>
        </Modal.Header>

        <ModalBody>
          <Row>
            <Div>
              {IS_CLOSED || IS_ACTIVE ? <Col md={3}>
                <Field
                  type="string"
                  label="Выдан"
                  readOnly
                  hidden={!IS_CLOSED && !IS_ACTIVE}
                  value={state.activated_by_employee_name}
                />
                <Field
                  type="string"
                  label="Закрыт"
                  readOnly
                  hidden={!IS_CLOSED}
                  value={state.closed_by_employee_name}
                />
              </Col> : ''}
              <Col md={!IS_CLOSED && !IS_ACTIVE ? 6 : 3}>
                {STRUCTURE_FIELD_VIEW &&
                  <Field
                    type="select"
                    label="Подразделение"
                    error={errors.structure_id}
                    disabled={STRUCTURE_FIELD_READONLY || !IS_CREATING}
                    clearable={STRUCTURE_FIELD_DELETABLE}
                    options={STRUCTURES}
                    emptyValue={null}
                    value={state.structure_id}
                    onChange={this.handleStructureIdChange}
                  />}
                <Field
                  type="select"
                  label="Сопровождающий"
                  error={errors.accompanying_person_id}
                  clearable
                  disabled={IS_ACTIVE || IS_CLOSED}
                  options={EMPLOYEES}
                  value={state.accompanying_person_id}
                  onChange={this.handleChange.bind(this, 'accompanying_person_id')}
                />
              </Col>
            </Div>
            <Div hidden={!(IS_CREATING || IS_DRAFT)}>
              <Col md={3}>
                <Field
                  type="date"
                  label="Выезд план."
                  error={errors.plan_departure_date}
                  date={state.plan_departure_date}
                  onChange={this.handlePlanDepartureDates.bind(this, 'plan_departure_date')}
                />
              </Col>
            </Div>
            <Div hidden={!(IS_CREATING || IS_DRAFT)}>
              <Col md={3}>
                <Field
                  type="date"
                  label="Возвращение план."
                  error={errors.plan_arrival_date}
                  date={state.plan_arrival_date}
                  min={state.plan_departure_date}
                  onChange={this.handlePlanDepartureDates.bind(this, 'plan_arrival_date')}
                />
              </Col>
            </Div>
            <Col md={6}>
              <Field
                type="select"
                label="Режим работы"
                error={errors.work_mode_id}
                clearable
                hidden={!(IS_CREATING || IS_DRAFT)}
                disabled={IS_ACTIVE || IS_CLOSED}
                options={workModeOptions}
                value={state.work_mode_id}
                onChange={this.handleChange.bind(this, 'work_mode_id')}
              />
            </Col>
            <Div hidden={!(IS_ACTIVE || IS_CLOSED)}>
              <Col md={3}>
                <Field
                  type="date"
                  label="Выезд план."
                  error={errors.plan_departure_date}
                  date={state.plan_departure_date}
                  disabled
                  onChange={() => true}
                />
                <Field
                  type="date"
                  label="Выезд факт."
                  error={errors.fact_departure_date}
                  date={state.fact_departure_date}
                  disabled={IS_CLOSED}
                  onChange={this.handleChange.bind(this, 'fact_departure_date')}
                />
              </Col>
              <Col md={3}>
                <Field
                  type="date"
                  label="Возвращение план."
                  error={errors.plan_arrival_date}
                  date={state.plan_arrival_date}
                  disabled
                  onChange={() => true}
                />
                <Field
                  type="date"
                  label="Возвращение факт."
                  error={errors.fact_arrival_date}
                  date={state.fact_arrival_date}
                  disabled={IS_CLOSED}
                  onChange={this.handleChange.bind(this, 'fact_arrival_date')}
                />
              </Col>
            </Div>
          </Row>
          <br />
          <Row>
            <Col md={6}>
              <Field
                type="select"
                label="Транспортное средство (поиск по рег. номер ТС)"
                error={errors.car_id}
                className="white-space-pre-wrap"
                hidden={!(IS_CREATING || IS_DRAFT)}
                options={CARS}
                value={state.car_id}
                onChange={this.onCarChange}
              />

              <Field
                type="string"
                label="Транспортное средство"
                className="white-space-pre-wrap"
                readOnly
                hidden={IS_CREATING || IS_DRAFT}
                value={car ? `${car.gov_number} [${car.special_model_name || ''}${car.special_model_name ? '/' : ''}${car.model_name || ''}${car.type_name ? '/' : ''}${car.type_name || ''}]` : 'Н/Д'}
              />
            </Col>
            <Col md={6}>
              <Field
                type="select"
                label="Прицеп"
                error={errors.trailer_id}
                className="white-space-pre-wrap"
                hidden={!(IS_CREATING || IS_DRAFT)}
                options={TRAILERS}
                value={state.trailer_id}
                onChange={this.handleChange.bind(this, 'trailer_id')}
              />

              <Field
                type="string"
                label="Прицеп"
                className="white-space-pre-wrap"
                readOnly
                hidden={IS_CREATING || IS_DRAFT}
                value={trailer ? `${trailer.gov_number} [${trailer.special_model_name || ''}${trailer.special_model_name ? '/' : ''}${trailer.model_name || ''}]` : 'Н/Д'}
              />
            </Col>
            <Col md={12}>
              <BsnoStatus
                okStatus={IS_CREATING || IS_DRAFT}
                is_bnso_broken={state.is_bnso_broken}
                car_id={state.car_id}
                handleChange={this.handleChange}
              />
            </Col>
            <Col md={(IS_CREATING || IS_DRAFT) ? 12 : 6}>
              <Field
                type="select"
                label="Водитель (возможен поиск по табельному номеру)"
                error={driversEnability ? errors.driver_id : undefined}
                hidden={!(IS_CREATING || IS_DRAFT)}
                readOnly={!driversEnability}
                options={DRIVERS}
                value={state.driver_id}
                onChange={this.handleChange.bind(this, 'driver_id')}
              />

              <Field
                type="string"
                label="Водитель"
                readOnly
                hidden={IS_CREATING || IS_DRAFT}
                value={this.employeeFIOLabelFunction(state.driver_id, true)}
              />
            </Col>
            <Col md={6}>
              <Field
                type="string"
                label="Режим работы"
                readOnly
                hidden={IS_CREATING || IS_DRAFT}
                value={state.work_mode_name}
              />
            </Col>
          </Row>

          <Row>
            <Div hidden={!state.car_id}>
              <Div hidden={!CAR_HAS_ODOMETER}>
                <Col md={4}>
                  <h4>Одометр</h4>
                  <Field
                    type="number"
                    label="Выезд из гаража, км"
                    error={errors.odometr_start}
                    value={state.odometr_start} disabled={IS_ACTIVE || IS_CLOSED} onChange={this.handleChange.bind(this, 'odometr_start')}
                  />

                  <Field
                    type="number"
                    label="Возвращение в гараж, км"
                    error={errors.odometr_end}
                    value={state.odometr_end} hidden={!(IS_ACTIVE || IS_CLOSED)} disabled={IS_CLOSED && !this.state.canEditIfClose} onChange={this.handleChange.bind(this, 'odometr_end')}
                  />

                  <Field
                    type="number"
                    label="Пробег, км"
                    value={state.odometr_diff} hidden={!(IS_ACTIVE || IS_CLOSED)} disabled
                  />
                </Col>
              </Div>
              <Div hidden={CAR_HAS_ODOMETER}>
                <Col md={4}>
                  <h4>Счетчик моточасов</h4>
                  <Field
                    type="number"
                    label="Выезд из гаража, м/ч"
                    error={errors.motohours_start}
                    value={state.motohours_start}
                    disabled={IS_ACTIVE || IS_CLOSED}
                    onChange={this.handleChange.bind(this, 'motohours_start')}
                  />

                  <Field
                    type="number"
                    label="Возвращение в гараж, м/ч"
                    error={errors.motohours_end}
                    value={state.motohours_end}
                    hidden={!(IS_ACTIVE || IS_CLOSED)}
                    disabled={IS_CLOSED && !this.state.canEditIfClose}
                    onChange={this.handleChange.bind(this, 'motohours_end')}
                  />

                  <Field
                    type="number"
                    label="Пробег, м/ч"
                    value={state.motohours_diff}
                    hidden={!(IS_ACTIVE || IS_CLOSED)}
                    disabled
                  />
                </Col>
              </Div>
              <Div>
                <Col md={4}>
                  <h4>Счетчик моточасов оборудования</h4>
                  <Field
                    type="number"
                    label="Выезд из гаража, м/ч"
                    error={errors.motohours_equip_start}
                    value={state.motohours_equip_start}
                    disabled={IS_ACTIVE || IS_CLOSED}
                    onChange={this.handleChange.bind(this, 'motohours_equip_start')}
                  />

                  <Field
                    type="number"
                    label="Возвращение в гараж, м/ч"
                    error={errors.motohours_equip_end}
                    value={state.motohours_equip_end}
                    hidden={!(IS_ACTIVE || IS_CLOSED)}
                    disabled={IS_CLOSED && !this.state.canEditIfClose}
                    onChange={this.handleChange.bind(this, 'motohours_equip_end')}
                  />

                  <Field
                    type="number"
                    label="Пробег, м/ч"
                    value={state.motohours_equip_diff}
                    hidden={!(IS_ACTIVE || IS_CLOSED)}
                    disabled
                  />
                </Col>
              </Div>

              <Div>
                <Col md={4}>
                  <h4> Топливо </h4>
                  <Field
                    type="select"
                    label="Тип топлива"
                    error={errors.fuel_type}
                    disabled={IS_ACTIVE || IS_CLOSED}
                    options={FUEL_TYPES}
                    value={state.fuel_type}
                    onChange={this.handleChange.bind(this, 'fuel_type')}
                  />

                  <Field
                    type="number"
                    label="Выезд, л"
                    error={errors.fuel_start}
                    value={state.fuel_start}
                    disabled={IS_ACTIVE || IS_CLOSED}
                    onChange={this.handleChange.bind(this, 'fuel_start')}
                  />

                  <Field
                    type="number"
                    label="Выдать, л"
                    error={errors.fuel_to_give}
                    value={state.fuel_to_give}
                    disabled={(IS_ACTIVE || IS_CLOSED)}
                    onChange={this.handleChange.bind(this, 'fuel_to_give')}
                  />

                  <Field
                    type="number"
                    label="Выдано, л"
                    error={errors.fuel_given}
                    value={state.fuel_given}
                    hidden={!(IS_ACTIVE || IS_CLOSED)}
                    disabled={IS_CLOSED && !this.state.canEditIfClose}
                    onChange={this.handleChange.bind(this, 'fuel_given')}
                  />

                  <Field
                    type="number"
                    label="Возврат, л"
                    error={errors.fuel_end}
                    value={state.fuel_end}
                    hidden={!(IS_ACTIVE || IS_CLOSED)}
                    disabled
                  />

                </Col>
              </Div>
            </Div>
          </Row>

          <Row>
            <Col md={8}>
              <Taxes
                hidden={!(IS_CLOSED || IS_ACTIVE) || state.status === 'draft' || (IS_CLOSED && state.tax_data && state.tax_data.length === 0) || (IS_CLOSED && !state.tax_data)}
                readOnly={!IS_ACTIVE && !this.state.canEditIfClose}
                title={'Расчет топлива по норме'}
                taxes={state.tax_data}
                operations={this.state.operations}
                fuelRates={this.state.fuelRates}
                onChange={this.handleChange.bind(this, 'tax_data')}
                correctionRate={this.state.fuel_correction_rate}
                baseFactValue={CAR_HAS_ODOMETER ? state.odometr_diff : state.motohours_diff}
                type={CAR_HAS_ODOMETER ? 'odometr' : 'motohours'}
              />
              <Taxes
                hidden={!(IS_CLOSED || IS_ACTIVE) || state.status === 'draft' || (IS_CLOSED && state.equipment_tax_data && state.equipment_tax_data.length === 0) || (IS_CLOSED && !!!state.equipment_tax_data)}
                readOnly={!IS_ACTIVE && !this.state.canEditIfClose}
                taxes={state.equipment_tax_data}
                operations={this.state.equipmentOperations}
                fuelRates={this.state.equipmentFuelRates}
                title={'Расчет топлива по норме для оборудования'}
                noDataMessage={'Для данного ТС нормы расхода топлива для спецоборудования не указаны.'}
                onChange={this.handleChange.bind(this, 'equipment_tax_data')}
                correctionRate={this.state.fuel_correction_rate}
                baseFactValue={state.motohours_equip_diff}
                type={'motohours'}
              />
              <Div className="task-container">
                <h4>Задание</h4>
                <Field
                  type="select"
                  error={errors.mission_id_list}
                  multi
                  className="task-container"
                  options={MISSIONS.concat(OUTSIDEMISSIONS)}
                  value={state.mission_id_list}
                  disabled={isEmpty(state.car_id) || IS_CLOSED}
                  clearable={false}
                  onChange={this.handleMissionsChange}
                />
                {(new Date(origFormState.fact_arrival_date).getTime() > new Date(state.fact_arrival_date).getTime()) && (state.status === 'active') && (
                  <div style={{ color: 'red' }}>{`Задания: ${OUTSIDEMISSIONS.map(m => `№${m.number}`).join(', ')} не входят в интервал путевого листа. После сохранения путевого листа время задания будет уменьшено и приравнено к времени "Возвращение факт." данного путевого листа`}</div>
                )}
                <Button style={{ marginTop: 10 }} onClick={this.createMission} disabled={isEmpty(state.car_id) || IS_CLOSED}>Создать задание</Button>
                <MissionFormWrap
                  onFormHide={this.onMissionFormHide}
                  showForm={this.state.showMissionForm}
                  element={this.state.selectedMission}
                  fromWaybill
                  waybillStartDate={state.plan_departure_date}
                  waybillEndDate={state.plan_arrival_date}
                  {...this.props}
                />
              </Div>
            </Col>
            <Col md={4}>
              <Div hidden={!state.car_id}>
                <Div className="equipment-fuel-checkbox" hidden={!state.car_id}>
                  <div className="form-group">
                    <div className="checkbox">
                      <label className="">
                        <input type="checkbox" checked={!!state.equipment_fuel} disabled={IS_ACTIVE || IS_CLOSED} onClick={this.handleEquipmentFuelChange.bind(this, !!!state.equipment_fuel)} />
                        <label style={{ cursor: IS_ACTIVE || IS_CLOSED ? 'default' : 'pointer', fontWeight: 800 }}>Показать расход топлива для оборудования</label>
                      </label>
                    </div>
                  </div>
                </Div>
                <Div hidden={!state.equipment_fuel}>
                  <h4> Топливо для оборудования</h4>
                  <Field
                    type="select"
                    label="Тип топлива"
                    error={errors.equipment_fuel_type}
                    disabled={IS_ACTIVE || IS_CLOSED}
                    options={FUEL_TYPES}
                    value={state.equipment_fuel_type}
                    onChange={this.handleChange.bind(this, 'equipment_fuel_type')}
                  />
                  <Field
                    type="number"
                    label="Выезд, л"
                    error={errors.equipment_fuel_start}
                    value={state.equipment_fuel_start}
                    disabled={IS_ACTIVE || IS_CLOSED}
                    onChange={this.handleChange.bind(this, 'equipment_fuel_start')}
                  />
                  <Field
                    type="number"
                    label="Выдать, л"
                    error={errors.equipment_fuel_to_give}
                    value={state.equipment_fuel_to_give}
                    disabled={(IS_ACTIVE || IS_CLOSED)}
                    onChange={this.handleChange.bind(this, 'equipment_fuel_to_give')}
                  />
                  <Field
                    type="number"
                    label="Выдано, л"
                    error={errors.equipment_fuel_given}
                    value={state.equipment_fuel_given}
                    hidden={!(IS_ACTIVE || IS_CLOSED)}
                    disabled={IS_CLOSED && !(this.state.canEditIfClose && !!state.equipment_fuel)}
                    onChange={this.handleChange.bind(this, 'equipment_fuel_given')}
                  />
                  <Field
                    type="number"
                    label="Возврат, л"
                    error={errors.equipment_fuel_end}
                    value={state.equipment_fuel_end}
                    hidden={!(IS_ACTIVE || IS_CLOSED)}
                    disabled
                  />
                </Div>
              </Div>
              <Div hidden={!(IS_ACTIVE || IS_CLOSED)}>
                <Field
                  type="string"
                  label="Пройдено по Глонасс, км"
                  error={errors.distance}
                  value={state.distance || state.track_length}
                  isLoading={loadingFields.distance}
                  disabled
                />
              </Div>
              <Div hidden={!(IS_ACTIVE || IS_CLOSED)}>
                <Field
                  type="string"
                  label="Расход по ДУТ, л"
                  error={errors.consumption}
                  value={state.consumption || state.sensor_consumption}
                  isLoading={loadingFields.consumption}
                  disabled
                />
              </Div>
            </Col>
            <Div hidden={!(IS_ACTIVE || IS_CLOSED)}>
              <Col md={8}>
                <Field
                  type="string"
                  label="Комментарий"
                  disabled={IS_CLOSED}
                  value={state.comment}
                  onChange={this.handleChange.bind(this, 'comment')}
                  error={errors.comment}
                />
              </Col>
              <Col md={4}>
                <Field
                  type="string"
                  label="Непройденные мед. осмотры"
                  disabled
                  value={state.failed_medical_stat_types}
                  onChange={this.handleChange.bind(this, 'failed_medical_stat_types')}
                  error={errors.failed_medical_stat_types}
                />
              </Col>
            </Div>
          </Row>
          <Row>
            <Col md={12}>
              <h4>Простои на линии, ч.</h4>
            </Col>
            <Row>
              <Div style={{ paddingLeft: 15 }}>
                <Col md={4}>
                  <Field
                    type="string"
                    label="Работа"
                    disabled={IS_CLOSED}
                    value={state.downtime_hours_work}
                    onChange={this.handleChange.bind(this, 'downtime_hours_work')}
                    error={errors.downtime_hours_work}
                  />
                </Col>
                <Col md={4}>
                  <Field
                    type="string"
                    label="Дежурство"
                    disabled={IS_CLOSED}
                    value={state.downtime_hours_duty}
                    onChange={this.handleChange.bind(this, 'downtime_hours_duty')}
                    error={errors.downtime_hours_duty}
                  />
                </Col>
              </Div>
            </Row>
            <Row>
              <Div style={{ paddingLeft: 15 }}>
                <Col md={4}>
                  <Field
                    type="string"
                    label="Обед"
                    disabled={IS_CLOSED}
                    value={state.downtime_hours_dinner}
                    onChange={this.handleChange.bind(this, 'downtime_hours_dinner')}
                    error={errors.downtime_hours_dinner}
                  />
                </Col>
                <Col md={4}>
                  <Field
                    type="string"
                    label="Ремонт"
                    disabled={IS_CLOSED}
                    value={state.downtime_hours_repair}
                    onChange={this.handleChange.bind(this, 'downtime_hours_repair')}
                    error={errors.downtime_hours_repair}
                  />
                </Col>
              </Div>
            </Row>
          </Row>
          <Row>
            <Col md={8} />
          </Row>
        </ModalBody>

        <Modal.Footer>
          <WaybillFooter
            isCreating={IS_CREATING}
            isDraft={IS_DRAFT}
            canSave={this.props.canSave}
            canClose={this.props.canClose}
            formState={this.props.formState}
            state={state}
            taxesControl={taxesControl}
            refresh={this.refresh}
            handleSubmit={this.handleSubmit}
            handleClose={this.props.handleClose}
            handlePrint={this.props.handlePrint}
          />
        </Modal.Footer>

      </Modal>
    );
  }
}

WaybillForm.contextTypes = {
  flux: React.PropTypes.object,
};

export default connectToStores(WaybillForm, ['objects', 'employees', 'waybills', 'missions']);
