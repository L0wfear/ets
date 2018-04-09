import React from 'react';
import { autobind } from 'core-decorators';
import connectToStores from 'flummox/connect';
import { Modal, Row, Col, Button } from 'react-bootstrap';
import {
  isEqual,
  filter,
  map,
  find,
  uniqBy,
  isEmpty as lodashIsEmpty,
} from 'lodash';

import ModalBody from 'components/ui/Modal';
import Field from 'components/ui/Field.jsx';
import DivForEnhance from 'components/ui/Div.jsx';
import {
  isNotNull,
  isEmpty,
  hasMotohours,
  isEqualOr,
} from 'utils/functions';
import { diffDates } from 'utils/dates.js';

import { employeeFIOLabelFunction } from 'utils/labelFunctions';
import { notifications } from 'utils/notifications';
import { isNumeric } from 'utils/validate/dataTypes';

import { driverHasLicense, driverHasSpecialLicense, getCars, getDrivers, getTrailers, validateTaxesControl, checkDateMission, getDatesToByOrderOperationId } from './utils';
import Form from '../compositions/Form.jsx';
import Taxes from './Taxes.jsx';
import WaybillFooter from './form/WaybillFooter';
import BsnoStatus from './form/BsnoStatus';
import MissionFormWrap from '../missions/mission/MissionFormWrap.jsx';
import { getDefaultMission } from '../../stores/MissionsStore.js';
import enhanceWithPermissions from '../util/RequirePermissions.jsx';

const Div = enhanceWithPermissions(DivForEnhance);

const MISSIONS_RESTRICTION_STATUS_LIST = ['active', 'draft'];

const checkErrorDate = ({ fromOrder: { cf_list: fax_cf_list, confirmDialogList: fax_confirmDialogList }, notFromOrder: { cf_list: not_fax_cf_list } }) => {
  if (!lodashIsEmpty(fax_cf_list)) {
    global.NOTIFICATION_SYSTEM.notify(`
      Время выполнения привязанного к ПЛ закрытого задания: 
      № ${fax_cf_list.join(', ')}, выходит за пределы фактических сроков выполнения ПЛ. Необходимо скорректировать фактические даты ПЛ
    `, 'error', 'tr');
    return Promise.reject();
  }
  if (!lodashIsEmpty(fax_confirmDialogList)) {
    return confirmDialog({
      title: 'Внимание!',
      body: (
        <div>
          <p>{`Привязанные задания № ${fax_confirmDialogList.join(', ')} будут исключены из ПЛ, поскольку период действия централизованного задания, по которому задания созданы, выходит за плановый период действия ПЛ.`}</p>
          <p>Вы уверены, что хотите продолжить?</p>
        </div>
      ),
    });
  }
  if (!lodashIsEmpty(not_fax_cf_list)) {
    global.NOTIFICATION_SYSTEM.notify(`
      Время выполнения привязанного к ПЛ закрытого задания: 
      № ${not_fax_cf_list.join(', ')}, выходит за пределы фактических сроков выполнения ПЛ. Необходимо скорректировать фактические даты ПЛ
    `, 'error', 'tr');
    return Promise.reject();
  }
  return Promise.resolve();
};
const checkMissionSelectBeforeClose = (mission_id_list, missionsList, missionSourcesList, objectActions) => {
  const arrayQuerySync = [...mission_id_list].fill(false);
  const missionsData = [...mission_id_list].map(() => ({}));

  const checkAQS = () => !arrayQuerySync.some(f => !f);

  return new Promise((res) => {
    if (mission_id_list.length) {
      mission_id_list.forEach((m, i) => {
        const dataMission = missionsList.find(({ id }) => m === id);
        const {
          mission_source_id: msi,
          date_start: date_start_mission,
          date_end: date_end_mission,
          status,
          number,
          order_id,
          order_operation_id,
        } = dataMission;

        missionsData[i] = {
          date_start_mission,
          date_end_mission,
          status,
          number,
          isOrderSource: false,
        };

        const isOrderSource = !!(missionSourcesList.find(({ id: id_mission_source }) => id_mission_source === msi) || {}).auto;
        if (isOrderSource) {
          objectActions.getOrderById(order_id).then(({ result: [order] }) => {
            const {
              order_date,
              order_date_to,
              technical_operations = [],
            } = order;

            const toMission = technical_operations.find(({ id: to_id }) => to_id === order_operation_id) || {};
            const {
              date_from: date_from_to,
              date_to: date_to_to,
            } = toMission;

            missionsData[i] = {
              ...missionsData[i],
              isOrderSource,
              date_from: date_from_to || order_date,
              date_to: date_to_to || order_date_to,
            };

            arrayQuerySync[i] = true;
            if (checkAQS()) {
              res(missionsData);
            }
          });
        } else {
          arrayQuerySync[i] = true;
          if (checkAQS()) {
            res(missionsData);
          }
        }
      });
    } else {
      return res([]);
    }
  });
};

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
      tooLongFactDates: false,
    };

    this.employeeFIOLabelFunction = () => {};
  }

  componentWillReceiveProps(props) {
    const currentState = this.props.formState;
    const nextState = props.formState;
    if (nextState.car_id !== currentState.car_id && nextState.car_id) {
      this.getLatestWaybillDriver(nextState);
    }

    // при смене планируемых дат или ТС запрашиваются новые доступные задания
    if (currentState.car_id !== nextState.car_id ||
        !isEqual(currentState.plan_arrival_date, nextState.plan_arrival_date) ||
        !isEqual(currentState.plan_departure_date, nextState.plan_departure_date)) {
      this.getMissionsByCarAndDates(nextState);
    }
    if (currentState.status === 'active' && diffDates(nextState.fact_departure_date, nextState.fact_arrival_date, 'minutes') <= 0) {
      if (currentState.car_id !== nextState.car_id ||
          !isEqual(currentState.fact_arrival_date, nextState.fact_arrival_date) ||
          !isEqual(currentState.fact_departure_date, nextState.fact_departure_date)) {
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
    flux.getActions('missions').getMissionSources();
    if (formState.status === 'active') {
      const car = find(this.props.carsList, c => c.asuods_id === formState.car_id) || {};
      const fuel_correction_rate = car.fuel_correction_rate || 1;
      flux.getActions('fuelRates').getFuelRatesByCarModel({ car_id: formState.car_id, datetime: formState.date_create }).then((r) => {
        const fuelRates = r.result.map(({ operation_id, rate_on_date }) => ({ operation_id, rate_on_date }));

        flux.getActions('fuelRates').getFuelOperations().then((fuelOperations) => {
          const operations = filter(fuelOperations.result, op => find(fuelRates, fr => fr.operation_id === op.id));

          flux.getActions('fuelRates').getEquipmentFuelRatesByCarModel({ car_id: formState.car_id, datetime: formState.date_create }).then((equipmentFuelRatesResponse) => {
            const equipmentFuelRates = equipmentFuelRatesResponse.result.map(({ operation_id, rate_on_date }) => ({ operation_id, rate_on_date }));

            const equipmentOperations = filter(fuelOperations.result, op => find(equipmentFuelRates, fr => fr.operation_id === op.id));
            this.setState({ fuelRates, operations, fuel_correction_rate, equipmentFuelRates, equipmentOperations });
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
    const {
      notAvailableMissions = [],
      missionsList: oldMissionsList = [],
    } = this.state;
    const {
      missionSourcesList = [],
      formState: {
        mission_id_list = [],
        plan_departure_date,
        plan_arrival_date,
      } = {},
    } = this.props;
    const dateWaybill = {
      plan_departure_date,
      plan_arrival_date,
      [field]: value,
    };

    const missionsList = [...oldMissionsList];

    const idOrder = (missionSourcesList.find(({ auto }) => auto) || {}).id;

    const missionsFromOrder = uniqBy(missionsList.concat(...notAvailableMissions), 'id').reduce((missions, mission) => {
      if (mission_id_list.includes(mission.id) && idOrder === mission.mission_source_id) {
        missions.push(mission);
      }
      return missions;
    },
    []);

    Promise.all(missionsFromOrder.map(mission =>
      this.context.flux.getActions('objects').getOrderById(mission.order_id)
        .then(({ result: [order] }) => ({
          ...mission,
          ...getDatesToByOrderOperationId(order, mission.order_operation_id),
        }))
    ))
    .then(missions => missions.reduce((newObj, { id, number, dateTo }) => {
      if (checkDateMission({ dateTo, dateWaybill })) {
        newObj[id] = number;
      }

      return newObj;
    }, {}))
    .then((missionsWithSourceOrder) => {
      const missionsNum = Object.values(missionsWithSourceOrder).map(num => `задание ${num}`);
      const missionIds = Object.keys(missionsWithSourceOrder);

      return this.confirmDialogChangeDate(missionsNum).then(() => {
        if (missionIds.length) {
          const newMission_id_list = mission_id_list.filter(id => !missionsWithSourceOrder[id]);
          const newMissionList = oldMissionsList.filter(({ id }) => !missionsWithSourceOrder[id]);
          this.handleChange('mission_id_list', newMission_id_list);
          this.setState({
            ...this.state,
            missionsList: newMissionList,
          });
        }
        this.getWaybillDrivers({
          [field]: value,
        });
        this.handleChange(field, value);
      })
      .catch(() => {});
    });
  }

  confirmDialogChangeDate(missionsNum) {
    if (missionsNum.length) {
      return confirmDialog({
        title: 'Внимание!',
        body: (
          <div>
            <p>{`Привязанные ${missionsNum.join(', ')} будут исключены из ПЛ, поскольку выходят за период действия ПЛ.`}</p>
            <p>Вы уверены, что хотите продолжить?</p>
          </div>
        ),
      });
    }
    return new Promise(res => res());
  }

  getWaybillDrivers({
    plan_departure_date = this.props.formState.plan_departure_date,
    plan_arrival_date = this.props.formState.plan_arrival_date,
  } = {}) {
    const IS_CREATING = !this.props.formState.status;
    const IS_DRAFT = this.props.formState.status && this.props.formState.status === 'draft';

    if (IS_CREATING || IS_DRAFT) {
      this.context.flux.getActions('employees').getWaybillDrivers({
        company_id: this.props.formState.company_id,
        date_from: plan_departure_date,
        date_to: plan_arrival_date,
      });
    }
  }
  getMissionsByCarAndDates(formState, notificate = true) {
    const { flux } = this.context;
    const {
      missionsList: oldMissionsList = [],
    } = this.state;
    const {
      car_id,
      fact_departure_date,
      plan_departure_date,
      fact_arrival_date,
      plan_arrival_date,
      mission_id_list: currentMissions,
      status,
    } = formState;
    if (!car_id) {
      return;
    }

    const departure_date = status === 'active' ? fact_departure_date : plan_departure_date;
    const arrival_date = status === 'active' ? fact_arrival_date : plan_arrival_date;

    flux.getActions('missions').getMissionsByCarAndDates(
      car_id,
      departure_date,
      arrival_date,
      status
    ).then(({
      result: {
        rows: newMissionsList = [],
      } = {},
    }) => {
      const missionsList = uniqBy(newMissionsList, 'id');
      const availableMissions = missionsList.map(el => el.id);
      let newMissions = [];
      let { notAvailableMissions = [] } = this.state;

      if (status === 'active' || status === 'draft') {
        newMissions = currentMissions;
        notAvailableMissions = notAvailableMissions
          .concat(currentMissions
            .filter(el => !availableMissions.includes(el) && !notAvailableMissions.find(m => m.id === el))
            .map(id => oldMissionsList.find(el => el.id === id))
          )
          .filter(m => m);
      } else {
        newMissions = currentMissions.filter(el => availableMissions.includes(el));
      }
      this.setState({ missionsList, notAvailableMissions });
      this.props.handleFormChange('mission_id_list', newMissions);

      availableMissions.length > 0 && notificate && global.NOTIFICATION_SYSTEM.notify(notifications.missionsByCarAndDateUpdateNotification);
    });
  }

  getCarDistance(formState) {
    if (diffDates(formState.fact_arrival_date, formState.fact_departure_date, 'days') > 3) {
      this.setState({ tooLongFactDates: true });
      return;
    }
    const { flux } = this.context;
    const { loadingFields } = this.state;
    if (formState.status === 'closed') {
      loadingFields.distance = false;
      loadingFields.consumption = false;
      this.setState({ loadingFields, tooLongFactDates: false });
      return;
    }
    const car = find(this.props.carsList, c => c.asuods_id === formState.car_id) || {};
    loadingFields.distance = true;
    loadingFields.consumption = true;
    this.setState({ loadingFields });
    const {
      fact_departure_date,
      fact_arrival_date,
    } = formState;

    if (car.gps_code && fact_departure_date && fact_arrival_date && diffDates(fact_arrival_date, fact_departure_date) > 0) {
      flux.getActions('cars').getInfoFromCar(car.gps_code, fact_departure_date, fact_arrival_date)
        .then(({ distance, consumption }) => {
          this.props.handleFormChange('distance', distance);
          this.props.handleFormChange('consumption', consumption !== null ? parseFloat(consumption).toFixed(3) : null);
          const { loadingFields: then_loadingFields } = this.state;
          then_loadingFields.distance = false;
          then_loadingFields.consumption = false;
          this.setState({ loadingFields: then_loadingFields });
        })
        .catch(() => {
          // this.props.handleFormChange('distance', parseFloat(distance / 100).toFixed(2));
          const { loadingFields: catch_loadingFields } = this.state;
          catch_loadingFields.distance = false;
          catch_loadingFields.consumption = false;
          this.setState({ loadingFields: catch_loadingFields });
        });
    }
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
        const hasLicense = !hasMotohours(gov_number) && driverHasLicense(driver);
        const hasSpecialLicense = hasMotohours(gov_number) && driverHasSpecialLicense(driver);

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

  async onCarChange(car_id, selectedCar = {}) {
    console.log(car_id)
    const { flux } = this.context;

    let fieldsToChange = {
      car_id,
      gov_number: '',
    };
    if (!isEmpty(car_id)) {
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
        gov_number: selectedCar.gov_number,
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
      if (isNotNull(lastCarUsedWaybill.fuel_type)) {
        fieldsToChange.fuel_type = lastCarUsedWaybill.fuel_type;
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
    const {
      carsList = [],
      formState: {
        car_id,
        structure_id,
        plan_arrival_date,
        plan_departure_date,
        fact_departure_date,
        status,
      },
    } = this.props;

    const { type_id } = carsList.find(({ asuods_id }) => asuods_id === car_id) || { type_id: null };

    const IS_ACTIVE = status === 'active';
    const IS_DRAFT = status === 'draft';
    let date_start;

    if (IS_DRAFT && diffDates(plan_departure_date, new Date()) > 0) {
      date_start = plan_departure_date;
    } else if (IS_ACTIVE && diffDates(fact_departure_date, new Date()) > 0) {
      date_start = fact_departure_date;
    }

    const newMission = getDefaultMission(date_start, plan_arrival_date);
    newMission.car_id = car_id;
    newMission.type_id = type_id;
    newMission.structure_id = structure_id;
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

  handleMissionsChange(newFormData) {
    /*
    const { formState } = this.props;
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
    */
    this.handleChange('mission_id_list',newFormData);
  }

  handleStructureIdChange(v) {
    const carsList = this.props.carsList.filter(c => v == null ? true : (c.company_structure_id === v || c.is_common));
    if (!find(carsList, c => c.asuods_id === this.props.formState.car_id)) {
      this.props.handleMultipleChange({ car_id: '', driver_id: '', structure_id: v });
    } else {
      this.handleChange('structure_id', v);
    }
  }

  handleClose = async (taxesControl) => {
    const {
      notAvailableMissions = [],
      missionsList: oldMissionsList = [],
    } = this.state;

    const {
      formState: {
        mission_id_list = [],
        fact_departure_date: fdd,
        fact_arrival_date: fad,
      } = {},
      missionSourcesList = [],
    } = this.props;

    const errors = {
      notFromOrder: {
        cf_list: [],
      },
      fromOrder: {
        cf_list: [],
        confirmDialogList: [],
      },
    };
    console.log(taxesControl)
    const missionsList = uniqBy([...oldMissionsList].concat(...notAvailableMissions), 'id');
    const objectActions = this.context.flux.getActions('objects');

    const missionsData = await checkMissionSelectBeforeClose(mission_id_list, missionsList, missionSourcesList, objectActions);
    console.log(missionsData)
    missionsData.forEach((mission) => {
      const {
        date_start_mission: dsm,
        date_end_mission: dem,
        status,
        number,
        isOrderSource,
      } = mission;

      if (!(diffDates(fdd, dsm) <= 0 && diffDates(dem, fad) <= 0)) {
        if (isOrderSource) {
          if (status === 'complete' || status === 'fail') {
            errors.fromOrder.cf_list.push(number);
          } else if (status === 'assigned') {
            const {
              date_from: df_to,
              date_to: dt_to,
            } = mission;

            if (diffDates(dt_to, fdd) <= 0 || diffDates(fad, df_to) <= 0) {
              errors.fromOrder.confirmDialogList.push(number);
            }
          }
        } else if (status === 'complete' || status === 'fail') {
          errors.notFromOrder.cf_list.push(number);
        }
      }
    });
    console.log(errors)
    checkErrorDate(errors).then(() => {
      this.props.handleClose(taxesControl);
    }).catch(() => {});
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
      missionsList = [],
    } = this.state;

    const {
      entity,
      carsList = [],
      carsIndex = {},
      waybillDriversList = [],
      employeesList = [],
      appConfig,
      workModeOptions,
    } = this.props;

    let taxesControl = false;

    const getCarsByStructId = getCars(state.structure_id);
    const getTrailersByStructId = getTrailers(state.structure_id);

    const CARS = getCarsByStructId(carsList);
    const TRAILERS = getTrailersByStructId(carsList);

    const FUEL_TYPES = map(appConfig.enums.FUEL_TYPE, (v, k) => ({ value: k, label: v }));

    // const DRIVERS = waybillDriversList.map((d) => {
    //   const personnel_number = d.personnel_number ? `[${d.personnel_number}] ` : '';
    //   return { value: d.id, label: `${personnel_number}${d.last_name || ''} ${d.first_name || ''} ${d.middle_name || ''}` };
    // });


    const driversEnability = state.car_id !== null && state.car_id !== '';
    const countMissionMoreOne = true; // state.mission_id_list.length > 1;

    const DRIVERS = getDrivers({ car_id: state.car_id, gov_number: state.gov_number }, waybillDriversList);
    const MISSIONS = missionsList.map(({ id, number, technical_operation_name }) => ({ value: id, label: `№${number} (${technical_operation_name})`, clearableValue: countMissionMoreOne }));
    const OUTSIDEMISSIONS = notAvailableMissions.map(({ id, number, technical_operation_name }) => ({ value: id, label: `№${number} (${technical_operation_name})`, clearableValue: countMissionMoreOne, number, className: 'yellow' }));

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
    const CAR_HAS_ODOMETER = state.gov_number ? !hasMotohours(state.gov_number) : null;

    let title = '';

    if (IS_CREATING) {
      title = 'Создать новый путевой лист';
    }

    if (IS_ACTIVE) {
      title = 'Активный путевой лист';
    }

    if (IS_CLOSED) {
      title = 'Просмотр путевого листа ';
    }

    if (IS_DRAFT) {
      title = 'Создание нового путевого листа';
    }

    const {
      tax_data = [],
      equipment_tax_data = [],
    } = state;

    taxesControl = validateTaxesControl([tax_data, equipment_tax_data]);
    const allTaxes = [...tax_data, ...equipment_tax_data];
    const taxesTotal = allTaxes.reduce((summ, { FUEL_RATE, FACT_VALUE }) => summ + (FUEL_RATE * FACT_VALUE), 0);
    const taxeTotalHidden = allTaxes.length === 0;

    if (IS_DRAFT && state.driver_id && !DRIVERS.some(d => d.value === state.driver_id)) {
      DRIVERS.push({ label: this.employeeFIOLabelFunction(state.driver_id), value: state.driver_id });
    }
    const { gps_code } = carsList.find(({ asuods_id }) => asuods_id === state.car_id) || {};

    const distanceOrTrackOrNodata = isNumeric(parseInt(state.distance, 10)) ? parseFloat(state.distance / 1000).toFixed(3) :
                                    isNumeric(parseInt(state.track_length, 10)) ? parseFloat(state.track_length / 1000).toFixed(3) :
                                    'Нет данных';

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
              </Col> : ''}
              <Col md={!IS_CLOSED && !IS_ACTIVE ? 6 : 3}>
                {STRUCTURE_FIELD_VIEW &&
                  <Field
                    id="waybill-structure-id"
                    type="select"
                    label="Подразделение"
                    error={errors.structure_id}
                    disabled={STRUCTURE_FIELD_READONLY || !(IS_CREATING || IS_DRAFT)}
                    clearable={STRUCTURE_FIELD_DELETABLE}
                    options={STRUCTURES}
                    emptyValue={null}
                    value={state.structure_id}
                    onChange={this.handleStructureIdChange}
                  />}
                <Field
                  id="accompanying-person-id"
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
                  id="plan-departure-date"
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
                  id="plan-arrival-date"
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
                  disabled={IS_CLOSED}
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
                id="car-id"
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
                id="car-gov-number"
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
                id="trailer-id"
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
                label="Водитель (возможен поиск по табельному номеру)"
                error={driversEnability ? errors.driver_id : undefined}
                hidden={!(IS_CREATING || IS_DRAFT)}
                readOnly={!driversEnability}
                options={DRIVERS}
                value={state.driver_id}
                onChange={this.handleChange.bind(this, 'driver_id')}
              />

              <Field
                id="driver-fio"
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
                    id="odometr-start"
                    type="number"
                    label="Выезд из гаража, км"
                    error={errors.odometr_start}
                    value={state.odometr_start} disabled={IS_ACTIVE || IS_CLOSED}
                    onChange={this.handleChange.bind(this, 'odometr_start')}
                  />

                  <Field
                    id="odometr-end"
                    type="number"
                    label="Возвращение в гараж, км"
                    error={errors.odometr_end}
                    value={state.odometr_end}
                    hidden={!(IS_ACTIVE || IS_CLOSED)}
                    disabled={IS_CLOSED && !this.state.canEditIfClose}
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
                    disabled={IS_ACTIVE || IS_CLOSED}
                    onChange={this.handleChange.bind(this, 'motohours_start')}
                  />

                  <Field
                    id="motohours-end"
                    type="number"
                    label="Возвращение в гараж, м/ч"
                    error={errors.motohours_end}
                    value={state.motohours_end}
                    hidden={!(IS_ACTIVE || IS_CLOSED)}
                    disabled={IS_CLOSED && !this.state.canEditIfClose}
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
                    disabled={IS_ACTIVE || IS_CLOSED}
                    onChange={this.handleChange.bind(this, 'motohours_equip_start')}
                  />

                  <Field
                    id="motohours-equip-end"
                    type="number"
                    label="Возвращение в гараж, м/ч"
                    error={errors.motohours_equip_end}
                    value={state.motohours_equip_end}
                    hidden={!(IS_ACTIVE || IS_CLOSED)}
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
                    label="Тип топлива"
                    error={errors.fuel_type}
                    disabled={IS_ACTIVE || IS_CLOSED}
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
                    disabled={IS_ACTIVE || IS_CLOSED}
                    onChange={this.handleChange.bind(this, 'fuel_start')}
                  />

                  <Field
                    id="fuel-to-give"
                    type="number"
                    label="Выдать, л"
                    error={errors.fuel_to_give}
                    value={state.fuel_to_give}
                    disabled={(IS_ACTIVE || IS_CLOSED)}
                    onChange={this.handleChange.bind(this, 'fuel_to_give')}
                  />

                  <Field
                    id="fuel-given"
                    type="number"
                    label="Выдано, л"
                    error={errors.fuel_given}
                    value={state.fuel_given}
                    hidden={!(IS_ACTIVE || IS_CLOSED)}
                    disabled={IS_CLOSED && !this.state.canEditIfClose}
                    onChange={this.handleChange.bind(this, 'fuel_given')}
                  />

                  <Field
                    id="fuel-end"
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
                <h4>Задание</h4>
                <Field
                  id="mission-id-list"
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
                <Div permissions={['mission.create']}>
                  <Button
                    id="create-mission"
                    style={{ marginTop: 10 }}
                    onClick={this.createMission}
                    disabled={isEmpty(state.car_id) || IS_CLOSED || (IS_ACTIVE && state.fact_arrival_date)}
                  >
                    Создать задание
                  </Button>
                </Div>
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
                      <label htmlFor="show-fuel-consumption">
                        <input id="show-fuel-consumption" type="checkbox" checked={!!state.equipment_fuel} disabled={IS_ACTIVE || IS_CLOSED} onClick={this.handleEquipmentFuelChange.bind(this, !!!state.equipment_fuel)} />
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
                    disabled={IS_ACTIVE || IS_CLOSED}
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
                    disabled={IS_ACTIVE || IS_CLOSED}
                    onChange={this.handleChange.bind(this, 'equipment_fuel_start')}
                  />
                  <Field
                    id="equipment-fuel-to-give"
                    type="number"
                    label="Выдать, л"
                    error={errors.equipment_fuel_to_give}
                    value={state.equipment_fuel_to_give}
                    disabled={(IS_ACTIVE || IS_CLOSED)}
                    onChange={this.handleChange.bind(this, 'equipment_fuel_to_give')}
                  />
                  <Field
                    id="equipment-fuel-given"
                    type="number"
                    label="Выдано, л"
                    error={errors.equipment_fuel_given}
                    value={state.equipment_fuel_given}
                    hidden={!(IS_ACTIVE || IS_CLOSED)}
                    disabled={IS_CLOSED && !(this.state.canEditIfClose && !!state.equipment_fuel)}
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
                  disabled={IS_CLOSED}
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
            canEditIfClose={!!this.state.canEditIfClose}
            taxesControl={taxesControl}
            refresh={this.refresh}
            handleSubmit={this.handleSubmit}
            handleClose={this.handleClose}
            handlePrint={this.props.handlePrint}
            handlePrintFromMiniButton={this.props.handlePrintFromMiniButton}
            entity={entity}
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
