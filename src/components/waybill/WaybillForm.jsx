import React from 'react';
import { autobind } from 'core-decorators';
import connectToStores from 'flummox/connect';
import { Modal, Input, Row, Col, Button, Dropdown, MenuItem, Glyphicon } from 'react-bootstrap';
import Field from 'components/ui/Field.jsx';
import DivForEnhance from 'components/ui/Div.jsx';
import { isNotNull, isEmpty, hasOdometer } from 'utils/functions';
import { employeeFIOLabelFunction } from 'utils/labelFunctions';
import { notifications } from 'utils/notifications';
import _ from 'lodash';
import Form from '../compositions/Form.jsx';
import Taxes from './Taxes.jsx';
import MissionFormWrap from '../missions/mission/MissionFormWrap.jsx';
import { getDefaultMission } from '../../stores/MissionsStore.js';
import enhanceWithPermissions from '../util/RequirePermissions.jsx';

const Div = enhanceWithPermissions(DivForEnhance);

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
    };
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
      }
    }
  }

  async componentDidMount() {
    const { flux } = this.context;
    const { formState } = this.props;
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
    await flux.getActions('employees').getDrivers();
    if (formState && formState.id) {
      const waybillInfo = await flux.getActions('waybills').getWaybill(formState.id);
      const canEditIfClose = waybillInfo.result.closed_editable && flux.getStore('session').getPermission('waybill.update_closed') || false;
      this.setState({ canEditIfClose });
    }
  }

  getMissionsByCarAndDates(formState, notificate = true) {
    const { flux } = this.context;
    flux.getActions('missions').getMissionsByCarAndDates(
      formState.car_id,
      formState.plan_departure_date,
      formState.plan_arrival_date,
      formState.status
    ).then((response) => {
      const availableMissions = response && response.result ? response.result.rows.map(el => el.id) : [];
      const currentMissions = formState.mission_id_list;
      const newMissions = currentMissions.filter(el => availableMissions.indexOf(el) > -1);
      this.props.handleFormChange('mission_id_list', newMissions);
      notificate && global.NOTIFICATION_SYSTEM.notify(notifications.missionsByCarAndDateUpdateNotification);
    });
  }

  getCarDistance(formState) {
    const { flux } = this.context;
    const { loadingFields } = this.state;
    const car = _.find(this.props.carsList, c => c.asuods_id === formState.car_id) || {};
    loadingFields.distance = true;
    this.setState({ loadingFields });
    flux.getActions('cars').getCarDistance(car.gps_code, formState.fact_departure_date, formState.fact_arrival_date)
      .then(({ distance }) => {
        this.props.handleFormChange('distance', parseFloat(distance / 1000).toFixed(3));
        const { loadingFields } = this.state;
        loadingFields.distance = false;
        this.setState({ loadingFields });
      })
      .catch(() => {
        // this.props.handleFormChange('distance', parseFloat(distance / 100).toFixed(2));
        const { loadingFields } = this.state;
        loadingFields.distance = false;
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
      if (newDriverId) this.props.handleFormChange('driver_id', newDriverId);
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
      const lastCarUsedWaybillObject = await flux.getActions('waybills').getLastClosedWaybill(car_id);
      const lastCarUsedWaybill = lastCarUsedWaybillObject.result;
      const additionalFields = this.getFieldsToChangeBasedOnLastWaybill(lastCarUsedWaybill);
      fieldsToChange = {
        ...fieldsToChange,
        ...additionalFields,
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

  getFieldsToChangeBasedOnLastWaybill(lastCarUsedWaybill) {
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
    const id = result && result.result && result.result[0] ? result.result[0].id : null;
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
    const f = this.props.formState;
    const data = !isEmpty(v) ? v.split(',').map(d => parseInt(d, 10)) : [];
    let shouldBeChanged = true;
    if (f.status === 'active') {
      _.each(f.mission_id_list, (id) => {
        if (data.indexOf(id) === -1) {
          shouldBeChanged = false;
        }
      });
    }
    this.handleChange('mission_id_list', shouldBeChanged ? data : f.mission_id_list);
  }

  render() {
    const state = this.props.formState;
    const errors = this.props.formErrors;
    const { loadingFields } = this.state;
    const { appConfig } = this.props;
    let taxesControl = false;

    const { carsList = [], carsIndex = {}, driversList = [], employeesList = [], missionsList = [] } = this.props;
    const CARS = carsList.map(c => ({
      value: c.asuods_id,
      gov_number: c.gov_number,
      label: `${c.gov_number} [${c.special_model_name || ''}${c.special_model_name ? '/' : ''}${c.model_name || ''}]`,
    }));
    const FUEL_TYPES = _.map(appConfig.enums.FUEL_TYPE, (v, k) => ({ value: k, label: v }));
    const DRIVERS = driversList.map((d) => {
      const personnel_number = d.personnel_number ? `[${d.personnel_number}] ` : '';
      return { value: d.id, label: `${personnel_number}${d.last_name || ''} ${d.first_name || ''} ${d.middle_name || ''}` };
    });
    const MASTERS = employeesList.filter(e => [2, 4, 5, 7, 14].indexOf(e.position_id) > -1).map(m => ({ value: m.id, data: m, label: `${m.last_name} ${m.first_name} ${m.middle_name}` })).filter(e => e.data.active === true);
    const MISSIONS = missionsList.map(({ id, number, technical_operation_name }) => ({ value: id, label: `№${number} (${technical_operation_name})`, clearableValue: false }));


    const IS_CREATING = !state.status;
    const IS_CLOSING = state.status && state.status === 'active';
    const IS_POST_CREATING = state.status && state.status === 'draft';
    const IS_DISPLAY = state.status && state.status === 'closed';

    const car = carsIndex[state.car_id];
    const CAR_HAS_ODOMETER = state.gov_number ? hasOdometer(state.gov_number) : null;

    let title = '';

    if (IS_CREATING) {
      title = 'Создать новый путевой лист';
    }

    if (IS_CLOSING) {
      title = 'Закрыть путевой лист';
    }

    if (IS_DISPLAY) {
      title = 'Просмотр путевого листа ';
    }

    if (IS_POST_CREATING) {
      title = 'Создание нового путевого листа';
    }

    if (state.tax_data) {
      taxesControl = !!state.tax_data[0] && !isEmpty(state.tax_data[0].FACT_VALUE);
    }

    return (
      <Modal {...this.props} bsSize="large" backdrop="static">

        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{title} { IS_POST_CREATING && '(возможна корректировка)'} { (IS_DISPLAY || IS_CLOSING) && `№ ${state.number}`}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row>
            <Col md={6}>
              <Field
                type="select"
                label="Ответственное лицо"
                error={errors.responsible_person_id}
                hidden={!(IS_CREATING || IS_POST_CREATING)}
                options={MASTERS}
                value={employeeFIOLabelFunction(state.responsible_person_id, true)}
                onChange={this.handleChange.bind(this, 'responsible_person_id')}
              />

              <Field
                type="string"
                label="Ответственное лицо"
                readOnly
                hidden={IS_CREATING || IS_POST_CREATING || !state.responsible_person_id}
                value={employeeFIOLabelFunction(state.responsible_person_id, true)}
              />
              <Field
                type="string"
                label="Ответственное лицо"
                readOnly
                hidden={IS_CREATING || IS_POST_CREATING || state.responsible_person_id}
                value={'Не указано'}
              />
            </Col>

            <Div hidden={!(IS_CREATING || IS_POST_CREATING)}>
              <Col md={3}>
                <Field
                  type="date"
                  label="Выезд план."
                  error={errors.plan_departure_date}
                  date={state.plan_departure_date}
                  onChange={this.handleChange.bind(this, 'plan_departure_date')}
                />
              </Col>
            </Div>
            <Div hidden={!(IS_CREATING || IS_POST_CREATING)}>
              <Col md={3}>
                <Field
                  type="date"
                  label="Возвращение план."
                  error={errors.plan_arrival_date}
                  date={state.plan_arrival_date}
                  min={state.plan_departure_date}
                  onChange={this.handleChange.bind(this, 'plan_arrival_date')}
                />
              </Col>
            </Div>

            <Div hidden={!(IS_CLOSING || IS_DISPLAY)}>
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
                  disabled={IS_DISPLAY}
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
                  disabled={IS_DISPLAY}
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
                hidden={!(IS_CREATING || IS_POST_CREATING)}
                options={CARS}
                value={state.car_id}
                onChange={this.onCarChange}
              />

              <Field
                type="string"
                label="Транспортное средство"
                className="white-space-pre-wrap"
                readOnly
                hidden={IS_CREATING || IS_POST_CREATING}
                value={car ? `${car.gov_number} [${car.special_model_name || ''}${car.special_model_name ? '/' : ''}${car.model_name || ''}]` : 'Н/Д'}
              />
            </Col>
            <Col md={6}>
              <Field
                type="select"
                label="Водитель (возможен поиск по табельному номеру)"
                error={errors.driver_id}
                hidden={!(IS_CREATING || IS_POST_CREATING)}
                options={DRIVERS}
                value={state.driver_id}
                onChange={this.handleChange.bind(this, 'driver_id')}
              />

              <Field
                type="string"
                label="Водитель"
                readOnly
                hidden={IS_CREATING || IS_POST_CREATING}
                value={employeeFIOLabelFunction(state.driver_id, true)}
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
                    label="Выезд, км"
                    error={errors.odometr_start}
                    value={state.odometr_start} disabled={IS_CLOSING || IS_DISPLAY} onChange={this.handleChange.bind(this, 'odometr_start')}
                  />

                  <Field
                    type="number"
                    label="Возврат, км"
                    error={errors.odometr_end}
                    value={state.odometr_end} hidden={!(IS_CLOSING || IS_DISPLAY)} disabled={IS_DISPLAY && !this.state.canEditIfClose} onChange={this.handleChange.bind(this, 'odometr_end')}
                  />

                  <Field
                    type="number"
                    label="Пробег, км"
                    value={state.odometr_diff} hidden={!(IS_CLOSING || IS_DISPLAY)} disabled
                  />
                </Col>
              </Div>
              <Div hidden={CAR_HAS_ODOMETER}>
                <Col md={4}>
                  <h4>Счетчик моточасов</h4>
                  <Field type="number" label="Выезд, м/ч" error={errors.motohours_start}
                    value={state.motohours_start} disabled={IS_CLOSING || IS_DISPLAY} onChange={this.handleChange.bind(this, 'motohours_start')}
                  />

                  <Field type="number" label="Возврат, м/ч" error={errors.motohours_end}
                    value={state.motohours_end} hidden={!(IS_CLOSING || IS_DISPLAY)} disabled={IS_DISPLAY && !this.state.canEditIfClose} onChange={this.handleChange.bind(this, 'motohours_end')}
                  />

                  <Field type="number" label="Пробег, м/ч"
                    value={state.motohours_diff} hidden={!(IS_CLOSING || IS_DISPLAY)} disabled
                  />
                </Col>
              </Div>
              <Div>
                <Col md={4}>
                  <h4>Счетчик моточасов оборудования</h4>
                  <Field type="number" label="Выезд, м/ч" error={errors.motohours_equip_start}
                    value={state.motohours_equip_start} disabled={IS_CLOSING || IS_DISPLAY} onChange={this.handleChange.bind(this, 'motohours_equip_start')}
                  />

                  <Field type="number" label="Возврат, м/ч" error={errors.motohours_equip_end}
                    value={state.motohours_equip_end} hidden={!(IS_CLOSING || IS_DISPLAY)} disabled={IS_DISPLAY && !this.state.canEditIfClose} onChange={this.handleChange.bind(this, 'motohours_equip_end')}
                  />

                  <Field type="number" label="Пробег, м/ч"
                    value={state.motohours_equip_diff} hidden={!(IS_CLOSING || IS_DISPLAY)} disabled
                  />
                </Col>
              </Div>

              <Div>
                <Col md={4}>
                  <h4> Топливо </h4>

                  <Field type="select" label="Тип топлива" error={errors.fuel_type}
                    disabled={IS_CLOSING || IS_DISPLAY}
                    options={FUEL_TYPES}
                    value={state.fuel_type}
                    onChange={this.handleChange.bind(this, 'fuel_type')}
                  />

                  <Field
                    type="number"
                    label="Выезд, л"
                    error={errors.fuel_start}
                    value={state.fuel_start} disabled={IS_CLOSING || IS_DISPLAY} onChange={this.handleChange.bind(this, 'fuel_start')}
                  />

                  <Field
                    type="number"
                    label="Выдать, л"
                    error={errors.fuel_to_give}
                    value={state.fuel_to_give}
                    disabled={(IS_CLOSING || IS_DISPLAY)} onChange={this.handleChange.bind(this, 'fuel_to_give')}
                  />

                  <Field
                    type="number"
                    label="Выдано, л"
                    error={errors.fuel_given}
                    value={state.fuel_given} hidden={!(IS_CLOSING || IS_DISPLAY)} disabled={IS_DISPLAY && !this.state.canEditIfClose} onChange={this.handleChange.bind(this, 'fuel_given')}
                  />

                  <Field
                    type="number"
                    label="Возврат, л"
                    error={errors.fuel_end}
                    value={state.fuel_end} hidden={!(IS_CLOSING || IS_DISPLAY)} disabled
                  />

                </Col>
              </Div>
            </Div>
          </Row>

          <Row>
            <Col md={8}>
              <Taxes
                hidden={!(IS_DISPLAY || IS_CLOSING) || state.status === 'draft' || (IS_DISPLAY && state.tax_data && state.tax_data.length === 0) || (IS_DISPLAY && !state.tax_data)}
                readOnly={!IS_CLOSING && !this.state.canEditIfClose}
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
                hidden={!(IS_DISPLAY || IS_CLOSING) || state.status === 'draft' || (IS_DISPLAY && state.equipment_tax_data && state.equipment_tax_data.length === 0) || (IS_DISPLAY && !!!state.equipment_tax_data)}
                readOnly={!IS_CLOSING && !this.state.canEditIfClose}
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
                  options={MISSIONS}
                  value={state.mission_id_list}
                  disabled={isEmpty(state.car_id) || IS_DISPLAY}
                  clearable={false}
                  onChange={this.handleMissionsChange}
                />
                <Button style={{ marginTop: 10 }} onClick={this.createMission} disabled={isEmpty(state.car_id) || IS_DISPLAY}>Создать задание</Button>
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
                  <Input type="checkbox" checked={!!state.equipment_fuel} disabled={IS_CLOSING || IS_DISPLAY} onClick={this.handleEquipmentFuelChange.bind(this, !!!state.equipment_fuel)} />
                  <label>Показать расход топлива для оборудования</label>
                </Div>
                <Div hidden={!state.equipment_fuel}>
                  <h4> Топливо для оборудования</h4>
                  <Field
                    type="select"
                    label="Тип топлива"
                    error={errors.equipment_fuel_type}
                    disabled={IS_CLOSING || IS_DISPLAY}
                    options={FUEL_TYPES}
                    value={state.equipment_fuel_type}
                    onChange={this.handleChange.bind(this, 'equipment_fuel_type')}
                  />
                  <Field
                    type="number"
                    label="Выезд, л"
                    error={errors.equipment_fuel_start}
                    value={state.equipment_fuel_start}
                    disabled={IS_CLOSING || IS_DISPLAY}
                    onChange={this.handleChange.bind(this, 'equipment_fuel_start')}
                  />
                  <Field
                    type="number"
                    label="Выдать, л"
                    error={errors.equipment_fuel_to_give}
                    value={state.equipment_fuel_to_give}
                    disabled={(IS_CLOSING || IS_DISPLAY)}
                    onChange={this.handleChange.bind(this, 'equipment_fuel_to_give')}
                  />
                  <Field
                    type="number"
                    label="Выдано, л"
                    error={errors.equipment_fuel_given}
                    value={state.equipment_fuel_given}
                    hidden={!(IS_CLOSING || IS_DISPLAY)}
                    disabled={IS_DISPLAY && !(this.state.canEditIfClose && !!state.equipment_fuel)}
                    onChange={this.handleChange.bind(this, 'equipment_fuel_given')}
                  />
                  <Field
                    type="number"
                    label="Возврат, л"
                    error={errors.equipment_fuel_end}
                    value={state.equipment_fuel_end}
                    hidden={!(IS_CLOSING || IS_DISPLAY)}
                    disabled
                  />
                </Div>
              </Div>
              <Div hidden={!(IS_CLOSING || IS_DISPLAY)}>
                <Field
                  type="string"
                  label="Пройдено, км"
                  error={errors.distance}
                  value={state.distance}
                  isLoading={loadingFields.distance}
                  disabled
                />
              </Div>
            </Col>
          </Row>

          <Row>
            <Col md={8} />
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Div>
            <Div className={'inline-block'} style={{ marginRight: 5 }} hidden={!(IS_CREATING || IS_POST_CREATING)}>
              <Button title="Обновить" onClick={this.refresh} disabled={isEmpty(state.car_id)}><Glyphicon glyph="refresh" /></Button>
            </Div>
            <Div className="inline-block">
              <Dropdown id="waybill-print-dropdown" dropup disabled={!this.props.canSave} onSelect={this.props.handlePrint.bind(this, state.status !== 'draft' && !IS_CREATING)}>
                <Dropdown.Toggle disabled={!this.props.canSave}>
                  <Glyphicon glyph="download-alt" /> {state.status === 'closed' || state.status === 'active' ? 'Просмотр' : 'Выдать'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <MenuItem eventKey={'plate_special'}>Форма 3-С</MenuItem>
                  <MenuItem eventKey={'plate_truck'}>Форма 4-П</MenuItem>
                  <MenuItem eventKey={'plate_bus'}>Форма №6 (спец)</MenuItem>
                  <MenuItem eventKey={'plate_car'}>Форма №3</MenuItem>
                </Dropdown.Menu>
              </Dropdown>&nbsp;
            </Div>
            <Div permissions={['waybill.update_closed']} className={'inline-block'} hidden={state.status === 'closed' && !this.state.canEditIfClose}>
              <Button onClick={this.handleSubmit} disabled={!this.props.canSave && !this.state.canEditIfClose}>Сохранить</Button>
            </Div>
            <Div className={'inline-block'} style={{ marginLeft: 4 }} hidden={state.status === 'closed' || !(this.props.formState.status && this.props.formState.status === 'active')}>
              <Button onClick={() => this.props.handleClose(taxesControl)} disabled={!this.props.canClose}>Закрыть ПЛ</Button>
            </Div>
          </Div>
        </Modal.Footer>

      </Modal>
    );
  }
}

WaybillForm.contextTypes = {
  flux: React.PropTypes.object,
};

export default connectToStores(WaybillForm, ['objects', 'employees', 'waybills', 'missions']);
