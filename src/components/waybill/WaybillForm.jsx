import * as React from 'react';
import * as PropTypes from 'prop-types';
import connectToStores from 'flummox/connect';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Col from 'react-bootstrap/lib/Col';
import * as Row from 'react-bootstrap/lib/Row';
import {
  isEqual,
  find,
  keyBy,
  map,
  uniqBy,
  groupBy,
  get,
} from 'lodash';

import ModalBody from 'components/ui/Modal';
import Field from 'components/ui/Field';
import { ExtField } from 'components/ui/new/field/ExtField';

import Div from 'components/ui/Div';
import {
  isNotNull,
  isEmpty,
  hasMotohours,
} from 'utils/functions';

import { employeeFIOLabelFunction } from 'utils/labelFunctions';
import { notifications } from 'utils/notifications';
import { diffDates, getCurrentSeason } from 'utils/dates';

import {
  checkDateMission,
  checkMissionSelectBeforeClose,
  getCars,
  getDatesToByOrderOperationId,
  getDrivers,
  getEquipmentFuelRatesByCarModel,
  getFuelCorrectionRate,
  getFuelRatesByCarModel,
  getTitleByStatus,
  getTrailers,
  getWaybillDrivers,
  validateTaxesControl,
} from 'components/waybill/utils';

import { confirmDialogChangeDate } from 'components/waybill/utils_react';

import {
  defaultSortingFunction,
} from 'components/ui/input/ReactSelect/utils';

import Form from 'components/compositions/Form';
import Taxes from 'components/waybill/Taxes';

import WaybillFooter from 'components/waybill/form/WaybillFooter';
import BsnoStatus from 'components/waybill/form/BsnoStatus';

import MissionFiled from 'components/waybill/form/MissionFiled';
import { isNullOrUndefined, isNumber } from 'util';

// const MISSIONS_RESTRICTION_STATUS_LIST = ['active', 'draft'];

const boundKeysObj = {
  fact_fuel_end: ['fact_fuel_end'],
};

const modalKey = 'waybill';

class WaybillForm extends Form {
  constructor(props) {
    super(props);

    this.state = {
      operations: [],
      equipmentOperations: [],
      fuelRates: [],
      equipmentFuelRates: [],
      fuel_correction_rate: 1,
      canEditIfClose: null,
      loadingFields: {},
      fuelRateAllList: [],
      tooLongFactDates: false,
      notAvailableMissions: [],
    };
  }

  componentDidUpdate(prevProps) {
    const oldFormState = prevProps.formState;
    const nextFormState = this.props.formState;
    if (nextFormState.car_id !== oldFormState.car_id && nextFormState.car_id) {
      this.getLatestWaybillDriver(nextFormState);
    }

    // при смене планируемых дат или ТС запрашиваются новые доступные задания
    if (oldFormState.car_id !== nextFormState.car_id
        || !isEqual(oldFormState.plan_arrival_date, nextFormState.plan_arrival_date)
        || !isEqual(oldFormState.plan_departure_date, nextFormState.plan_departure_date)) {
      this.getMissionsByCarAndDates(nextFormState);
    }
    if (oldFormState.status === 'active' && diffDates(nextFormState.fact_departure_date, nextFormState.fact_arrival_date, 'minutes') <= 0) {
      if (oldFormState.car_id !== nextFormState.car_id
          || !isEqual(oldFormState.fact_arrival_date, nextFormState.fact_arrival_date)
          || !isEqual(oldFormState.fact_departure_date, nextFormState.fact_departure_date)) {
        this.getCarDistance(nextFormState);
        this.getMissionsByCarAndDates(nextFormState);
      }
    }
  }

  async componentDidMount() {
    const {
      formState,
      formState: { status },
    } = this.props;
    const { flux } = this.context;

    const IS_CREATING = !status;
    const IS_DRAFT = status === 'draft';
    const IS_ACTIVE = status === 'active';
    const IS_CLOSED = status === 'closed';

    this.getMissionsByCarAndDates(formState, false);

    await Promise.all([
      flux.getActions('objects').getCars(),
      flux.getActions('employees').getEmployees(),
      flux.getActions('objects').getWorkMode(),
      flux.getActions('missions').getMissionSources(),
      getWaybillDrivers(
        this.context.flux.getActions('employees').getWaybillDrivers,
        this.props.formState,
      ),
    ]);

    if (IS_CREATING || IS_DRAFT) {
      flux.getActions('fuelRates').getFuelRates()
        .then(({ result: fuelRateAll }) => this.setState({ fuelRateAllList: fuelRateAll.map(d => d.car_model_id) }))
        .catch((e) => {
          console.error(e); // eslint-disable-line
          this.setState({ fuelRateAllList: [] });
        });
    }

    if (!IS_CREATING) {
      flux.getActions('waybills').getWaybill(formState.id)
        .then(({ result: { closed_editable } }) => this.setState({
          canEditIfClose: closed_editable ? flux.getStore('session').getPermission('waybill.update_closed') : false,
          origFormState: formState,
        }))
        .catch((e) => {
          console.error(e); // eslint-disable-line
          this.setState({
            canEditIfClose: false,
            origFormState: formState,
          });
        });
    }

    if (IS_ACTIVE || IS_CLOSED) {
      this.getCarDistance(formState);
      const currentSeason = getCurrentSeason(this.props.appConfig.summer_start_date, this.props.appConfig.summer_end_date);

      Promise.all([
        getFuelRatesByCarModel(flux.getActions('fuelRates').getFuelRatesByCarModel, formState, currentSeason),
        flux.getActions('fuelRates').getFuelOperations({ is_active: true }).then(({ result: fuelOperationsList }) => fuelOperationsList),
        getEquipmentFuelRatesByCarModel(flux.getActions('fuelRates').getEquipmentFuelRatesByCarModel, formState, currentSeason),
        getFuelCorrectionRate(this.props.carsList, formState),
      ])
        .then(([fuelRates, fuelOperationsList, equipmentFuelRates, fuel_correction_rate]) => {
          const fuelOperationsListById = keyBy(fuelOperationsList, 'id');

          this.setState({
            fuelRates,
            operations: fuelRates.reduce((newArr, { id, operation_id, is_excluding_mileage, measure_unit_name, rate_on_date, comment }) => {
              if (fuelOperationsListById[operation_id]) {
                newArr.push({
                  ...fuelOperationsListById[operation_id],
                  uniqKey: id,
                  rate_on_date,
                  comment,
                  measure_unit_name,
                  is_excluding_mileage,
                });
              }

              return newArr;
            }, []),
            fuel_correction_rate,
            equipmentFuelRates,
            equipmentOperations: equipmentFuelRates.reduce((newArr, { id, operation_id, is_excluding_mileage, measure_unit_name, rate_on_date, comment }) => {
              if (fuelOperationsListById[operation_id]) {
                newArr.push({
                  ...fuelOperationsListById[operation_id],
                  uniqKey: id,
                  rate_on_date,
                  measure_unit_name,
                  is_excluding_mileage,
                  comment,
                });
              }

              return newArr;
            }, []),
          });
        })
        .catch((e) => {
          console.error(e); // eslint-disable-line

          this.setState({
            fuelRates: [],
            operations: [],
            fuel_correction_rate: 1,
            equipmentFuelRates: [],
            equipmentOperations: [],
          });
        });
    }
  }

  handlePlanDepartureDates = (field, value) => {
    if (value === null) {
      return;
    }
    const {
      missionsList: oldMissionsList = [],
    } = this.state;
    const {
      missionSourcesList = [],
      formState,
      formState: { mission_id_list = [] },
    } = this.props;
    const dateWaybill = {
      plan_departure_date: formState.plan_departure_date,
      plan_arrival_date: formState.plan_arrival_date,
      [field]: value,
    };

    const missionsList = [...oldMissionsList];

    const idOrder = (missionSourcesList.find(({ auto }) => auto) || {}).id;

    const missionsFromOrder = uniqBy(missionsList.concat(...this.state.notAvailableMissions), 'id')
      .reduce((missions, mission) => {
        if (formState.mission_id_list.includes(mission.id) && idOrder === mission.mission_source_id) {
          missions.push(mission);
        }
        return missions;
      },
      []);

    Promise.all(missionsFromOrder.map(mission => this.context.flux.getActions('objects').getOrderById(mission.order_id)
      .then(({ result: [order] }) => ({
        ...mission,
        ...getDatesToByOrderOperationId(order, mission.order_operation_id),
      }))))
      .then(missions => missions.reduce((newObj, { id, number, dateTo }) => {
        if (checkDateMission({ dateTo, dateWaybill })) {
          newObj[id] = number;
        }

        return newObj;
      }, {}))
      .then(missionsWithSourceOrder => confirmDialogChangeDate(Object.values(missionsWithSourceOrder).map(num => `задание ${num}`))
        .then(() => {
          if (Object.keys(missionsWithSourceOrder).length) {
            this.handleChange('mission_id_list', mission_id_list.filter(id => !missionsWithSourceOrder[id]));
            this.setState({
              missionsList: oldMissionsList.filter(({ id }) => !missionsWithSourceOrder[id]),
            });
          }

          getWaybillDrivers(
            this.context.flux.getActions('employees').getWaybillDrivers,
            {
              ...this.props.formState,
              [field]: value,
            },
          );
          this.handleChange(field, value);
        })
        .catch(() => {}));
  }

  getMissionsByCarAndDates = (formState, notificate = true) => {
    const {
      missionsList: oldMissionsList = [],
    } = this.state;
    const {
      car_id,
      mission_id_list: currentMissions,
      status,
    } = formState;

    if (!car_id) {
      return;
    }

    const { formState: oldFormState } = this.props;

    this.context.flux.getActions('missions').getMissionsByCarAndDates(
      car_id,
      formState.fact_departure_date || formState.plan_departure_date,
      formState.fact_arrival_date || formState.plan_arrival_date,
      status,
      formState.id,
    ).then(({ result: { rows: newMissionsList = [] } = {} }) => {
      const missionsList = uniqBy(newMissionsList, 'id');
      const availableMissions = missionsList.map(el => el.id);
      let { notAvailableMissions = [] } = this.state;

      let newMissionIdList = formState.mission_id_list;

      if (formState.car_id !== oldFormState.car_id) {
        newMissionIdList = currentMissions.filter(el => availableMissions.includes(el));
      } else {
        notAvailableMissions = notAvailableMissions
          .concat(currentMissions
            .filter(el => !availableMissions.includes(el) && !notAvailableMissions.find(m => m.id === el))
            .map(id => oldMissionsList.find(el => el.id === id)))
          .filter(m => m);
      }

      this.handleChange('mission_id_list', newMissionIdList);

      if (!isEqual(oldMissionsList, missionsList) && availableMissions.length > 0 && notificate) {
        global.NOTIFICATION_SYSTEM.notify(notifications.missionsByCarAndDateUpdateNotification);
      }

      this.setState({ missionsList, notAvailableMissions });
    });
  }

  getCarDistance = (formState) => {
    if (diffDates(formState.fact_arrival_date, formState.fact_departure_date, 'days') > 3) {
      this.setState({ tooLongFactDates: true });
      return;
    }
    const { loadingFields: { ...loadingFields } } = this.state;
    // Если ПЛ закрыт,то ничего не получаем
    if (formState.status === 'closed') {
      loadingFields.distance = false;
      loadingFields.consumption = false;
      this.setState({ loadingFields, tooLongFactDates: false });
      return;
    }
    const { gps_code = null } = this.props.carsList.find(({ asuods_id }) => asuods_id === formState.car_id) || {};

    const {
      fact_departure_date,
      fact_arrival_date,
    } = formState;

    if (gps_code && fact_departure_date && fact_arrival_date && diffDates(fact_arrival_date, fact_departure_date) > 0) {
      loadingFields.distance = true;
      loadingFields.consumption = true;
      this.setState({ loadingFields });

      this.context.flux.getActions('cars').getInfoFromCar(gps_code, fact_departure_date, fact_arrival_date)
        .then(({ distance, consumption }) => {
          this.props.handleMultipleChange({
            car_id: formState.car_id,
            distance: isNullOrUndefined(distance) ? null : parseFloat(distance).toFixed(3),
            consumption: isNullOrUndefined(consumption) ? null : parseFloat(consumption).toFixed(3),
          });

          this.setState({
            loadingFields: {
              distance: false,
              consumption: false,
            },
          });
        })
        .catch(() => {
          // this.props.handleFormChange('distance', parseFloat(distance / 100).toFixed(2));
          this.setState({
            loadingFields: {
              distance: false,
              consumption: false,
            },
          });
        });
    } else {
      this.setState({
        loadingFields: {
          distance: false,
          consumption: false,
        },
      });
    }
  }

  getLatestWaybillDriver = (formState) => {
    const { car_id } = formState;
    this.context.flux.getActions('employees').getEmployeeBindedToCar(car_id);
    this.context.flux.getActions('waybills').getLatestWaybillDriver(
      car_id,
      formState.driver_id,
    ).then(({ result: { driver_id = null } }) => {
      if (driver_id) {
        const DRIVERS = getDrivers({ ...formState, driver_id }, this.props.employeesIndex, this.props.waybillDriversList);

        if (DRIVERS.some(({ value }) => value === driver_id)) {
          this.props.handleFormChange('driver_id', driver_id);
        }
      } else {
        /**
         * Сбрасываем водителя, так как в новом, отфильтрованнои по ТС
         * списке, водителей может уже не быть.
         */
        this.props.handleFormChange('driver_id', null);
      }
    });
  }

  onCarChange = (car_id, selectedCar = {}) => new Promise((res) => {
    const fieldsToChange = {
      car_id,
      gov_number: '',
    };

    if (!isEmpty(car_id)) {
      if (!this.state.fuelRateAllList.includes(selectedCar.model_id)) {
        global.NOTIFICATION_SYSTEM.notify(notifications.missionFuelRateByCarUpdateNotification);
      }

      this.props.clearSomeData();
      return this.context.flux.getActions('waybills').getLastClosedWaybill(car_id)
        .then(({ result: lastCarUsedWaybill }) => res({
          ...fieldsToChange,
          ...this.getFieldsToChangeBasedOnLastWaybill(lastCarUsedWaybill),
          gov_number: selectedCar.gov_number,
        }));
    }
    /**
       * Если ТС не выбрано, то и ранее выбранного водителя не должно быть.
       */
    return Promise.resolve(res({
      ...fieldsToChange,
      driver_id: null,
    }));
  })
    .then(fieldsToChange => this.props.handleMultipleChange(fieldsToChange));


  handleEquipmentFuelChange = async (equipment_fuel) => {
    const fieldsToChange = {
      equipment_fuel,
    };
    this.props.clearSomeData();
    const { result: lastCarUsedWaybill } = await this.context.flux.getActions('waybills').getLastClosedWaybill(this.props.formState.car_id);

    if (lastCarUsedWaybill && lastCarUsedWaybill.equipment_fuel) {
      fieldsToChange.equipment_fuel_type = lastCarUsedWaybill.equipment_fuel_type;
      fieldsToChange.equipment_fuel_start = lastCarUsedWaybill.equipment_fuel_end;
    }

    this.props.handleMultipleChange(fieldsToChange);
  }

  getFieldsToChangeBasedOnLastWaybill = ([lastCarUsedWaybill]) => {
    const fieldsToChange = {};
    if (isNotNull(lastCarUsedWaybill)) {
      if (isNotNull(lastCarUsedWaybill.fact_fuel_end)) {
        fieldsToChange.fuel_start = lastCarUsedWaybill.fact_fuel_end;
        fieldsToChange.fact_fuel_end = fieldsToChange.fuel_start;
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
      if (isNotNull(lastCarUsedWaybill.fuel_type)) {
        fieldsToChange.fuel_type = lastCarUsedWaybill.fuel_type;
      }
      if (isNotNull(lastCarUsedWaybill.trailer_id)) {
        fieldsToChange.trailer_id = lastCarUsedWaybill.trailer_id;
      }
    } else {
      fieldsToChange.fuel_start = 0;
      fieldsToChange.fact_fuel_end = fieldsToChange.fuel_start;
      fieldsToChange.odometr_start = 0;
      fieldsToChange.motohours_start = 0;
      fieldsToChange.motohours_equip_start = 0;
    }

    return fieldsToChange;
  }

  /**
   * Обновляет данные формы на основе закрытого ПЛ
   */
  refresh = async () => {
    const state = this.props.formState;
    const { flux } = this.context;

    const { result: lastCarUsedWaybill } = await flux.getActions('waybills').getLastClosedWaybill(state.car_id);
    const plan_departure_date = (diffDates(new Date(), state.plan_departure_date) > 0) ? new Date() : state.plan_departure_date;
    const fieldsToChange = { ...this.getFieldsToChangeBasedOnLastWaybill(lastCarUsedWaybill), plan_departure_date };
    this.props.handleMultipleChange(fieldsToChange);
  }

  handleStructureIdChange = (structure_id) => {
    const {
      formState: {
        driver_id,
        car_id,
      },
    } = this.props;
    const carData = this.props.carsIndex[car_id];

    const changeObj = { structure_id };
    if (carData && !(carData.is_common || carData.company_structure_id === structure_id)) {
      changeObj.car_id = null;
      changeObj.driver_id = null;
    } else if (driver_id) {
      const driver = this.props.employeesIndex[driver_id];
      const DRIVERS = getDrivers({ ...this.props.formState, structure_id }, this.props.employeesIndex, this.props.waybillDriversList);

      if (!driver || !DRIVERS.some(({ value }) => value === driver_id)) {
        if (structure_id && !driver.is_common && driver.company_structure_id !== structure_id) {
          changeObj.driver_id = null;
        }
      }
    }

    this.props.handleMultipleChange(changeObj);
  }

  handleClose = taxesControl => checkMissionSelectBeforeClose(
    this.props.formState,
    groupBy([...this.state.missionsList, ...this.state.notAvailableMissions], 'id'),
    this.props.missionSourcesList.find(({ auto }) => auto).id,
    this.context.flux.getActions('objects').getOrderById,
  )
    .then(() => this.props.handleClose(taxesControl))
    .catch(() => {});

  sortingDrivers = (a, b) => {
    if (a.isPrefer === b.isPrefer) {
      return defaultSortingFunction(a, b);
    }

    return b.isPrefer - a.isPrefer;
  }

  handleSubmit = () => {
    delete this.props.formState.is_bnso_broken;
    this.props.onSubmit();
  }

  render() {
    const {
      loadingFields,
      origFormState = {},
      notAvailableMissions = [],
      missionsList = [],
    } = this.state;

    const {
      formState: state,
      formErrors: errors,
      entity,
      carsList = [],
      carsIndex = {},
      waybillDriversList = [],
      employeesList = [],
      employeesBindedoOCarList = [],
      appConfig,
      workModeOptions,
      employeesIndex = {},
      isPermittedByKey = {},
    } = this.props;

    let taxesControl = false;

    const getCarsByStructId = getCars(state.structure_id, state.car_id);
    const getTrailersByStructId = getTrailers(state.structure_id, state.trailer_id);

    const CARS = getCarsByStructId(carsList);
    const TRAILERS = getTrailersByStructId(carsList);
    const FUEL_TYPES = map(appConfig.enums.FUEL_TYPE, (v, k) => ({ value: k, label: v }));

    const driversEnability = state.car_id !== null && state.car_id !== '';

    const currentStructureId = this.context.flux.getStore('session').getCurrentUser().structure_id;
    const STRUCTURES = this.context.flux.getStore('session').getCurrentUser().structures.map(({ id, name }) => ({ value: id, label: name }));

    let STRUCTURE_FIELD_VIEW = false;
    let STRUCTURE_FIELD_READONLY = false;
    let STRUCTURE_FIELD_DELETABLE = false;
    if (currentStructureId !== null && STRUCTURES.length === 1 && currentStructureId === STRUCTURES[0].value) {
      STRUCTURE_FIELD_VIEW = true;
      STRUCTURE_FIELD_READONLY = true;
    } else if (currentStructureId !== null && STRUCTURES.length > 1 && find(STRUCTURES, el => el.value === currentStructureId)) {
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
    const IS_KAMAZ = (get(carsIndex, [state.car_id, 'model_name'], '') || '').toLowerCase().includes('камаз');
    const CAR_HAS_ODOMETER = state.gov_number ? !hasMotohours(state.gov_number) : null;
    const DRIVERS = (IS_CREATING || IS_DRAFT) ? getDrivers(state, employeesIndex, employeesBindedoOCarList.length ? employeesBindedoOCarList : waybillDriversList) : [];

    const title = getTitleByStatus(state);
    const {
      tax_data = [],
      equipment_tax_data = [],
    } = state;

    taxesControl = validateTaxesControl([tax_data, equipment_tax_data]);
    const allTaxes = [...tax_data, ...equipment_tax_data];
    const taxesTotal = allTaxes.reduce((summ, { FUEL_RATE, FACT_VALUE }) => summ + (FUEL_RATE * FACT_VALUE), 0);
    const taxeTotalHidden = allTaxes.length === 0;

    if (state.driver_id && !DRIVERS.some(d => d.value === state.driver_id)) {
      DRIVERS.push({ label: employeeFIOLabelFunction(this.props.employeesIndex, state.driver_id), value: state.driver_id });
    }
    const { gps_code } = carsList.find(({ asuods_id }) => asuods_id === state.car_id) || {};
    let distanceOrTrackOrNodata = state.distance;

    if (isNullOrUndefined(distanceOrTrackOrNodata)) {
      distanceOrTrackOrNodata = isNumber(parseInt(state.track_length, 10))
        ? parseFloat(state.track_length / 1000).toFixed(3)
        : 'Нет данных';
    } else {
      distanceOrTrackOrNodata /= 1000;
    }

    return (
      <Modal id="modal-waybill" show={this.props.show} onHide={this.props.onHide} bsSize="large" backdrop="static">

        <Modal.Header closeButton>
          <Modal.Title>
            {title}
            {' '}
            { IS_DRAFT && '(возможна корректировка)'}
            {' '}
            { (IS_CLOSED || IS_ACTIVE) && `№ ${state.number}`}
          </Modal.Title>
        </Modal.Header>

        <ModalBody>
          <Row>
            <Div>
              {IS_CLOSED || IS_ACTIVE ? (
                <Col md={3}>
                  <Field
                    id="activated-by-employee-name"
                    type="string"
                    label="Выдан"
                    readOnly
                    hidden={!IS_CLOSED && !IS_ACTIVE}
                    value={state.activated_by_employee_name}
                  />
                  <Field
                    id="closed-by-employee-name"
                    type="string"
                    label="Закрыт"
                    readOnly
                    hidden={!IS_CLOSED}
                    value={state.closed_by_employee_name}
                  />
                </Col>
              ) : ''}
              <Col md={!IS_CLOSED && !IS_ACTIVE ? 6 : 3}>
                {STRUCTURE_FIELD_VIEW
                  && (
                  <Field
                    id="waybill-structure-id"
                    type="select"
                    modalKey={modalKey}
                    label="Подразделение"
                    error={errors.structure_id}
                    disabled={STRUCTURE_FIELD_READONLY || !(IS_CREATING || IS_DRAFT) || !isPermittedByKey.update}
                    clearable={STRUCTURE_FIELD_DELETABLE}
                    options={STRUCTURES}
                    emptyValue={null}
                    value={state.structure_id}
                    onChange={this.handleStructureIdChange}
                  />
                  )}
                <Field
                  id="accompanying-person-id"
                  type="select"
                  modalKey={modalKey}
                  label="Сопровождающий"
                  error={errors.accompanying_person_id}
                  clearable
                  disabled={IS_ACTIVE || IS_CLOSED || !isPermittedByKey.update}
                  options={EMPLOYEES}
                  value={state.accompanying_person_id}
                  onChange={this.handleChange.bind(this, 'accompanying_person_id')}
                />
              </Col>
            </Div>
            <Div hidden={!(IS_CREATING || IS_DRAFT)}>
              <Col md={3}>
                <Field
                  id="plan-departure-date"
                  type="date"
                  label="Выезд план."
                  error={errors.plan_departure_date}
                  date={state.plan_departure_date}
                  onChange={this.handlePlanDepartureDates.bind(this, 'plan_departure_date')}
                  disabled={!isPermittedByKey.update}
                />
              </Col>
            </Div>
            <Div hidden={!(IS_CREATING || IS_DRAFT)}>
              <Col md={3}>
                <Field
                  id="plan-arrival-date"
                  type="date"
                  label="Возвращение план."
                  error={errors.plan_arrival_date}
                  date={state.plan_arrival_date}
                  min={state.plan_departure_date}
                  onChange={this.handlePlanDepartureDates.bind(this, 'plan_arrival_date')}
                  disabled={!isPermittedByKey.update}
                />
              </Col>
            </Div>
            <Col md={6}>
              <Field
                id="work_mode_id"
                type="select"
                label="Режим работы"
                error={errors.work_mode_id}
                clearable
                hidden={!(IS_CREATING || IS_DRAFT)}
                disabled={IS_ACTIVE || IS_CLOSED || !isPermittedByKey.update}
                options={workModeOptions}
                value={state.work_mode_id}
                onChange={this.handleChange.bind(this, 'work_mode_id')}
              />
            </Col>
            <Div hidden={!(IS_ACTIVE || IS_CLOSED)}>
              <Col md={3}>
                <Field
                  id="plan-departure-date"
                  type="date"
                  label="Выезд план."
                  error={errors.plan_departure_date}
                  date={state.plan_departure_date}
                  disabled
                  onChange={() => true}
                />
                <Field
                  id="fact-departure-date"
                  type="date"
                  label="Выезд факт."
                  error={errors.fact_departure_date}
                  date={state.fact_departure_date}
                  disabled={IS_CLOSED || (!isPermittedByKey.update && !isPermittedByKey.departure_and_arrival_values)}
                  onChange={this.handleChange.bind(this, 'fact_departure_date')}
                />
              </Col>
              <Col md={3}>
                <Field
                  id="plan-arrival-date"
                  type="date"
                  label="Возвращение план."
                  error={errors.plan_arrival_date}
                  date={state.plan_arrival_date}
                  disabled
                  onChange={() => true}
                />
                <Field
                  id="fact-arrival-date"
                  type="date"
                  label="Возвращение факт."
                  error={errors.fact_arrival_date}
                  date={state.fact_arrival_date}
                  disabled={IS_CLOSED || (!isPermittedByKey.update && !isPermittedByKey.departure_and_arrival_values)}
                  onChange={this.handleChange.bind(this, 'fact_arrival_date')}
                />
              </Col>
            </Div>
          </Row>
          <br />
          <Row>
            <Col md={6}>
              <Field
                id="car-id"
                type="select"
                modalKey={modalKey}
                label="Транспортное средство (поиск по рег. номер  ТС)"
                error={errors.car_id}
                className="white-space-pre-wrap"
                hidden={!(IS_CREATING || IS_DRAFT)}
                options={CARS}
                value={state.car_id}
                onChange={this.onCarChange}
                disabled={!isPermittedByKey.update}
              />

              <Field
                id="car-gov-number"
                type="string"
                label="Транспортное средство"
                className="white-space-pre-wrap"
                readOnly
                hidden={IS_CREATING || IS_DRAFT}
                value={car ? `${car.gov_number} [${car.model_name || ''}${car.model_name ? '/' : ''}${car.special_model_name || ''}${car.type_name ? '/' : ''}${car.type_name || ''}]` : 'Н/Д'}
              />
            </Col>
            <Col md={6}>
              <Field
                id="trailer-id"
                type="select"
                modalKey={modalKey}
                label="Прицеп"
                error={errors.trailer_id}
                className="white-space-pre-wrap"
                hidden={!(IS_CREATING || IS_DRAFT)}
                options={TRAILERS}
                value={state.trailer_id}
                onChange={this.handleChange.bind(this, 'trailer_id')}
                disabled={!isPermittedByKey.update}
              />

              <Field
                id="trailer-gov-number"
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
                gps_code={gps_code}
                handleChange={this.handleChange}
              />
            </Col>
            <Col md={(IS_CREATING || IS_DRAFT) ? 12 : 6}>
              <Field
                id="driver-id"
                type="select"
                modalKey={modalKey}
                label="Водитель (возможен поиск по табельному номеру)"
                error={driversEnability ? errors.driver_id : undefined}
                sortingFunction={this.sortingDrivers}
                hidden={!(IS_CREATING || IS_DRAFT)}
                readOnly={!driversEnability}
                options={DRIVERS}
                value={state.driver_id}
                onChange={this.handleChange.bind(this, 'driver_id')}
                disabled={!isPermittedByKey.update}
              />

              <Field
                id="driver-fio"
                type="string"
                label="Водитель"
                readOnly
                hidden={IS_CREATING || IS_DRAFT}
                value={employeeFIOLabelFunction(employeesIndex, state.driver_id, true)}
              />
            </Col>
            <Col md={6}>
              <Field
                id="work_mode_id"
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
                    id="odometr-start"
                    type="number"
                    label="Выезд из гаража, км"
                    error={errors.odometr_start}
                    value={state.odometr_start}
                    disabled={IS_ACTIVE || IS_CLOSED || !isPermittedByKey.update}
                    onChange={this.handleChange.bind(this, 'odometr_start')}
                  />

                  <Field
                    id="odometr-end"
                    type="number"
                    label="Возвращение в гараж, км"
                    error={errors.odometr_end}
                    value={state.odometr_end}
                    hidden={!(IS_ACTIVE || IS_CLOSED)}
                    disabled={(IS_CLOSED && !this.state.canEditIfClose) || (!isPermittedByKey.update && !isPermittedByKey.departure_and_arrival_values)}
                    onChange={this.handleChange.bind(this, 'odometr_end')}
                  />

                  <Field
                    id="odometr-diff"
                    type="number"
                    label="Пробег, км"
                    value={state.odometr_diff}
                    hidden={!(IS_ACTIVE || IS_CLOSED)}
                    disabled
                  />
                </Col>
              </Div>
              <Div hidden={CAR_HAS_ODOMETER}>
                <Col md={4}>
                  <h4>Счетчик моточасов</h4>
                  <Field
                    id="motohours-start"
                    type="number"
                    label="Выезд из гаража, м/ч"
                    error={errors.motohours_start}
                    value={state.motohours_start}
                    disabled={IS_ACTIVE || IS_CLOSED || !isPermittedByKey.update}
                    onChange={this.handleChange.bind(this, 'motohours_start')}
                  />

                  <Field
                    id="motohours-end"
                    type="number"
                    label="Возвращение в гараж, м/ч"
                    error={errors.motohours_end}
                    value={state.motohours_end}
                    hidden={!(IS_ACTIVE || IS_CLOSED)}
                    disabled={(IS_CLOSED && !this.state.canEditIfClose) || (!isPermittedByKey.update && !isPermittedByKey.departure_and_arrival_values)}
                    onChange={this.handleChange.bind(this, 'motohours_end')}
                  />

                  <Field
                    id="motohours_diff"
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
                    id="motohours-equip-start"
                    type="number"
                    label="Выезд из гаража, м/ч"
                    error={errors.motohours_equip_start}
                    value={state.motohours_equip_start}
                    disabled={IS_ACTIVE || IS_CLOSED || !isPermittedByKey.update}
                    onChange={this.handleChange.bind(this, 'motohours_equip_start')}
                  />

                  <Field
                    id="motohours-equip-end"
                    type="number"
                    label="Возвращение в гараж, м/ч"
                    error={errors.motohours_equip_end}
                    value={state.motohours_equip_end}
                    hidden={!(IS_ACTIVE || IS_CLOSED) || (!isPermittedByKey.update && !isPermittedByKey.departure_and_arrival_values)}
                    disabled={IS_CLOSED && !this.state.canEditIfClose}
                    onChange={this.handleChange.bind(this, 'motohours_equip_end')}
                  />

                  <Field
                    id="motohours-equip-diff"
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
                    id="fuel-type"
                    type="select"
                    modalKey={modalKey}
                    label="Тип топлива"
                    error={errors.fuel_type}
                    disabled={IS_ACTIVE || IS_CLOSED || !isPermittedByKey.update}
                    options={FUEL_TYPES}
                    value={state.fuel_type}
                    onChange={this.handleChange.bind(this, 'fuel_type')}
                  />

                  <Field
                    id="fuel_start"
                    type="number"
                    label="Выезд, л"
                    error={errors.fuel_start}
                    value={state.fuel_start}
                    disabled={IS_ACTIVE || IS_CLOSED || !isPermittedByKey.update}
                    onChange={this.handleChange.bind(this, 'fuel_start')}
                  />

                  <Field
                    id="fuel-to-give"
                    type="number"
                    label="Выдать, л"
                    error={errors.fuel_to_give}
                    value={state.fuel_to_give}
                    disabled={(IS_ACTIVE || IS_CLOSED) || !isPermittedByKey.update}
                    onChange={this.handleChange.bind(this, 'fuel_to_give')}
                  />

                  <Field
                    id="fuel-given"
                    type="number"
                    label="Выдано, л"
                    error={errors.fuel_given}
                    value={state.fuel_given}
                    hidden={!(IS_ACTIVE || IS_CLOSED)}
                    disabled={(IS_CLOSED && !this.state.canEditIfClose) || !isPermittedByKey.update}
                    onChange={this.handleChange.bind(this, 'fuel_given')}
                  />

                  <Field
                    id="fuel-end"
                    type="number"
                    label="Возврат по таксировке, л"
                    error={errors.fuel_end}
                    value={state.fuel_end}
                    hidden={!(IS_ACTIVE || IS_CLOSED)}
                    disabled
                  />
                  <ExtField
                    id="fact-fuel-end"
                    type="number"
                    modalKey={modalKey}
                    label="Возврат фактический, л"
                    error={errors.fact_fuel_end}
                    value={state.fact_fuel_end}
                    hidden={!(IS_ACTIVE || IS_CLOSED)}
                    disabled={!(IS_ACTIVE || this.state.canEditIfClose) || !isPermittedByKey.update}
                    onChange={this.handleChange}
                    boundKeys={boundKeysObj.fact_fuel_end}
                    showRedBorder={state.fact_fuel_end <= (IS_KAMAZ ? 15 : 5)}
                  />
                  <div>Значение поля «Возврат фактический, л» обновляется при редактировании таксировки.</div>
                  <Row />
                </Col>
              </Div>
            </Div>
          </Row>

          <Row>
            <Col md={8}>
              <Taxes
                modalKey={modalKey}
                hidden={!isPermittedByKey.update || !(IS_CLOSED || IS_ACTIVE) || state.status === 'draft' || (IS_CLOSED && state.tax_data && state.tax_data.length === 0) || (IS_CLOSED && !state.tax_data)}
                readOnly={IS_CLOSED || !IS_ACTIVE && !this.state.canEditIfClose}
                title="Расчет топлива по норме"
                taxes={state.tax_data}
                operations={this.state.operations}
                fuelRates={this.state.fuelRates}
                onChange={this.handleChange.bind(this, 'tax_data')}
                correctionRate={this.state.fuel_correction_rate}
                baseFactValue={CAR_HAS_ODOMETER ? state.odometr_diff : state.motohours_diff}
                type={CAR_HAS_ODOMETER ? 'odometr' : 'motohours'}
              />
              <Taxes
                modalKey={modalKey}
                hidden={!isPermittedByKey.update || !(IS_CLOSED || IS_ACTIVE) || state.status === 'draft' || (IS_CLOSED && state.equipment_tax_data && state.equipment_tax_data.length === 0) || (IS_CLOSED && !state.equipment_tax_data)}
                readOnly={IS_CLOSED || !IS_ACTIVE && !this.state.canEditIfClose}
                taxes={state.equipment_tax_data}
                operations={this.state.equipmentOperations}
                fuelRates={this.state.equipmentFuelRates}
                title="Расчет топлива по норме для оборудования"
                noDataMessage="Для данного ТС нормы расхода топлива для спецоборудования не указаны."
                onChange={this.handleChange.bind(this, 'equipment_tax_data')}
                correctionRate={this.state.fuel_correction_rate}
                baseFactValue={state.motohours_equip_diff}
                type="motohours"
              />
              <Div>
                <Field
                  type="number"
                  label="Общий расход топлива, л"
                  value={taxesTotal.toFixed(3)}
                  hidden={taxeTotalHidden}
                  disabled
                />
              </Div>
              <Div className="task-container">
                <MissionFiled
                  carsList={this.props.carsList}
                  state={state}
                  errors={errors}
                  missionsList={missionsList}
                  notAvailableMissions={notAvailableMissions}
                  IS_CLOSED={IS_CLOSED}
                  isPermittedByKey={isPermittedByKey}
                  origFormState={origFormState}
                  handleChange={this.handleChange}
                  getMissionsByCarAndDates={this.getMissionsByCarAndDates}
                />
              </Div>
            </Col>
            <Col md={4}>
              <Div hidden={!state.car_id}>
                <Div className="equipment-fuel-checkbox" hidden={!state.car_id}>
                  <div className="form-group">
                    <div className="checkbox">
                      <label htmlFor="show-fuel-consumption">
                        <input id="show-fuel-consumption" type="checkbox" checked={!!state.equipment_fuel} disabled={IS_ACTIVE || IS_CLOSED || !isPermittedByKey.update} onClick={this.handleEquipmentFuelChange.bind(this, !state.equipment_fuel)} readOnly={true}/>
                        <label style={{ cursor: IS_ACTIVE || IS_CLOSED ? 'default' : 'pointer', fontWeight: 800 }}>Показать расход топлива для оборудования</label>
                      </label>
                    </div>
                  </div>
                </Div>
                <Div hidden={!state.equipment_fuel}>
                  <h4> Топливо для оборудования</h4>
                  <Field
                    id="equipment-fuel-type"
                    type="select"
                    label="Тип топлива"
                    error={errors.equipment_fuel_type}
                    disabled={IS_ACTIVE || IS_CLOSED || !isPermittedByKey.update}
                    options={FUEL_TYPES}
                    value={state.equipment_fuel_type}
                    onChange={this.handleChange.bind(this, 'equipment_fuel_type')}
                  />
                  <Field
                    id="equipment-fuel-start"
                    type="number"
                    label="Выезд, л"
                    error={errors.equipment_fuel_start}
                    value={state.equipment_fuel_start}
                    disabled={IS_ACTIVE || IS_CLOSED || !isPermittedByKey.update}
                    onChange={this.handleChange.bind(this, 'equipment_fuel_start')}
                  />
                  <Field
                    id="equipment-fuel-to-give"
                    type="number"
                    label="Выдать, л"
                    error={errors.equipment_fuel_to_give}
                    value={state.equipment_fuel_to_give}
                    disabled={(IS_ACTIVE || IS_CLOSED) || !isPermittedByKey.update}
                    onChange={this.handleChange.bind(this, 'equipment_fuel_to_give')}
                  />
                  <Field
                    id="equipment-fuel-given"
                    type="number"
                    label="Выдано, л"
                    error={errors.equipment_fuel_given}
                    value={state.equipment_fuel_given}
                    hidden={!(IS_ACTIVE || IS_CLOSED)}
                    disabled={(IS_CLOSED && !(this.state.canEditIfClose && !!state.equipment_fuel)) || !isPermittedByKey.update}
                    onChange={this.handleChange.bind(this, 'equipment_fuel_given')}
                  />
                  <Field
                    id="equipment-fuel-end"
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
                  id="distance-by-glonass"
                  type="string"
                  label="Пройдено по Глонасс, км"
                  error={!this.state.tooLongFactDates && errors.distance}
                  value={this.state.tooLongFactDates ? 'Слишком большой период действия ПЛ' : distanceOrTrackOrNodata}
                  isLoading={loadingFields.distance}
                  disabled
                />
              </Div>
              <Div hidden={!(IS_ACTIVE || IS_CLOSED)}>
                <Field
                  id="consumption"
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
                  id="waybill-comment"
                  type="text"
                  label="Комментарий"
                  disabled={IS_CLOSED || !isPermittedByKey.update}
                  value={state.comment}
                  onChange={this.handleChange.bind(this, 'comment')}
                  error={errors.comment}
                />
              </Col>
              <Col md={4}>
                <Field
                  id="failed-medical-stat-types"
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
              <Col md={8}>
                <Col md={6}>
                  <Field
                    id="downtime-hours-work"
                    type="string"
                    label="Работа"
                    disabled={IS_CLOSED || !isPermittedByKey.update}
                    value={state.downtime_hours_work}
                    onChange={this.handleChange.bind(this, 'downtime_hours_work')}
                    error={errors.downtime_hours_work}
                  />
                </Col>
                <Col md={6}>
                  <Field
                    id="downtime-hours-duty"
                    type="string"
                    label="Дежурство"
                    disabled={IS_CLOSED || !isPermittedByKey.update}
                    value={state.downtime_hours_duty}
                    onChange={this.handleChange.bind(this, 'downtime_hours_duty')}
                    error={errors.downtime_hours_duty}
                  />
                </Col>
              </Col>
            </Row>
            <Row>
              <Col md={8}>
                <Col md={6}>
                  <Field
                    id="downtime-hours-dinner"
                    type="string"
                    label="Обед"
                    disabled={IS_CLOSED || !isPermittedByKey.update}
                    value={state.downtime_hours_dinner}
                    onChange={this.handleChange.bind(this, 'downtime_hours_dinner')}
                    error={errors.downtime_hours_dinner}
                  />
                </Col>
                <Col md={6}>
                  <Field
                    id="downtime-hours-repair"
                    type="string"
                    label="Ремонт"
                    disabled={IS_CLOSED || !isPermittedByKey.update}
                    value={state.downtime_hours_repair}
                    onChange={this.handleChange.bind(this, 'downtime_hours_repair')}
                    error={errors.downtime_hours_repair}
                  />
                </Col>
              </Col>
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
            canEditIfClose={!!this.state.canEditIfClose}
            taxesControl={taxesControl}
            refresh={this.refresh}
            handleSubmit={this.handleSubmit}
            handleClose={this.handleClose}
            handlePrint={this.props.handlePrint}
            handlePrintFromMiniButton={this.props.handlePrintFromMiniButton}
            entity={entity}
            isPermittedByKey={isPermittedByKey}
          />
        </Modal.Footer>

      </Modal>
    );
  }
}

WaybillForm.contextTypes = {
  flux: PropTypes.object,
};

export default connectToStores(WaybillForm, ['objects', 'employees', 'waybills', 'missions']);
