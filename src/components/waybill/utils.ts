import * as R from 'ramda';
import { diffDates } from 'utils/dates.js';

import { IVehicle } from 'api/@types/services/index.h';
import {
  checkErrorDate,
} from 'components/waybill/utils_react';

import {
  isNotEqualAnd,
  hasMotohours,
} from 'utils/functions';

const VALID_VEHICLES_TYPES = {
  GENERATOR: 69,
  COMPRESSOR: 15,
};

// declarative functional approach
const vehicleFilter = (structure_id: string) => R.filter<IVehicle>(c =>
  !structure_id ||
  c.is_common ||
  c.company_structure_id === structure_id,
);

// todo вернуть интерфес
//  R.filter<IVehicle>(c =>
const carFilter = structure_id => R.pipe(
  vehicleFilter(structure_id),
  R.filter<any>(c =>
    !c.is_trailer ||
    [
      VALID_VEHICLES_TYPES.COMPRESSOR,
      VALID_VEHICLES_TYPES.GENERATOR,
    ].includes (c.type_id),
  ),
);
// todo вернуть интерфейс
//  R.filter<IVehicle>(c => c.is_trailer),
const trailerFilter = structure_id => R.pipe(
  vehicleFilter(structure_id),
  R.filter<any>(c => c.is_trailer),
);

// <IVehicle, any>
const vehicleMapper = R.map<any, any>(c => ({
  value: c.asuods_id,
  model_id: c.model_id,
  gov_number: c.gov_number,
  label: `${c.gov_number} [${c.special_model_name || ''}${c.special_model_name ? '/' : ''}${c.model_name || ''}${c.type_name ? '/' : ''}${c.type_name || ''}]`,
}));

export const getCars = structure_id => R.pipe(
  carFilter(structure_id),
  vehicleMapper,
);

export const getTrailers = structure_id => R.pipe(
  trailerFilter(structure_id),
  vehicleMapper,
);

const isNotEmpty = value => isNotEqualAnd([undefined, null, ''], value);
export const driverHasLicense = ({ drivers_license }) => isNotEmpty(drivers_license);
export const driverHasSpecialLicense = ({ special_license }) => isNotEmpty(special_license);

const hasOdometr = gov_number => !hasMotohours(gov_number);

export const getDrivers = (state: any = {}, driversList) => {
  const licenceSwitcher = R.cond([
    [hasOdometr, R.always(driverHasLicense)],
    [hasMotohours, R.always(driverHasSpecialLicense)],
    [R.T, R.always(R.identity)],
  ]);

  const driverFilter = licenceSwitcher(state.gov_number);

  return driversList
    .filter(d => (!d.prefer_car ? true : d.prefer_car === state.car_id) && driverFilter(d))
    .map(d => {
      const personnel_number = d.personnel_number ? `[${d.personnel_number}] ` : '';
      return {
        value: d.id,
        label: `${personnel_number}${d.last_name || ''} ${d.first_name || ''} ${d.middle_name || ''}`,
      };
    });
};

export function validateTaxesControl(taxes: Array<Array<any>>): boolean {
  const isAllTaxesEmpty = taxes.every((tax = []) => tax.length === 0);

  if (isAllTaxesEmpty) {
    return false;
  }

  const nonEmptyTaxes = taxes.filter((tax = []) => tax.length > 0);

  return !nonEmptyTaxes.
    map(taxData =>
      taxData.map(t =>
        t && t.OPERATION !== undefined,
      ).includes(false),
    ).includes(true);
}

// хе хе
export function checkDateMission({ dateTo: { date_start, date_end }, dateWaybill: { plan_departure_date, plan_arrival_date } }) {
  return diffDates(date_end, plan_departure_date) < 0 || diffDates(plan_arrival_date, date_start) < 0;
}

export const getDatesToByOrderOperationId = (order, order_operation_id) => {
  const {
    date_from = '',
    date_to = '',
  } = order.technical_operations.find(({ id }) => id === order_operation_id) || {};
  const date_start = date_from || order.order_date;
  const date_end = date_to || order.order_date_to;

  return {
    dateTo: {
      date_start,
      date_end,
    },
  };
};

export const getFuelCorrectionRate = (carsList, { car_id }) => Promise.resolve(
  (carsList.find(({ asuods_id }) => asuods_id === car_id ) || { fuel_correction_rate: 1 }).fuel_correction_rate,
);

export const getFuelRatesByCarModel = (action, { car_id, date_create: datetime }) =>
  action({ car_id, datetime })
    .then(({ result: fuelRatesList}) => ({
      fuelRates: fuelRatesList.map(({ operation_id, rate_on_date }) => ({ operation_id, rate_on_date })),
      fuelRatesIndex: fuelRatesList.reduce((newObj, { id, ...other }) => ({ ...newObj, [id]: { id, ...other }}), {}),
    }));
export const getEquipmentFuelRatesByCarModel = (action, { car_id, date_create: datetime }) =>
  action({ car_id, datetime })
    .then(({ result: equipmentFuelRatesList }) => ({
      equipmentFuelRates: equipmentFuelRatesList.map(({ operation_id, rate_on_date }) => ({ operation_id, rate_on_date })),
      equipmentFuelRatesIndex: equipmentFuelRatesList.reduce((newObj, { id, ...other }) => ({ ...newObj, [id]: { id, ...other }}), {}),
    }));

export const checkMissionSelectBeforeClose = (formState, missionsIndex, order_mission_source_id, orderAction) =>
  Promise.all<any>(
    formState.mission_id_list.map(mission_id => {
      const missionData = missionsIndex[mission_id];
      const mainMissionData = {
        ...missionData,
        date_start_mission: missionData.date_start,
        date_end_mission: missionData.date_end,
      };

      if (missionData.mission_source_id === order_mission_source_id) {
        const { order_id } = missionData;
        return orderAction(order_id)
          .then(([order]) => {
            const missionOrderTo = order.technical_operations.find(({ id: to_id }) => to_id === missionData.order_operation_id);

            return {
              ...mainMissionData,
              isOrderSource: true,
              date_from: missionOrderTo.date_from || order.order_date,
              date_to: missionOrderTo.date_to || order.order_date_to,
            };
          })
          .catch(e => {
            console.error(`Ошибка получения централизованного задания| id = ${order_id}`, e);
            return {
              ...mainMissionData,
              isOrderSource: true,
            };
          });
      }

      return Promise.resolve({
        ...mainMissionData,
        isOrderSource: false,
      });
    }))
  .then(missions =>
    missions.reduce((errors, mission) => {
      const {
        fact_departure_date,
        fact_arrival_date,
      } = formState;
      const { number } = mission;

      if (!(diffDates(fact_departure_date, mission.date_start_mission) <= 0 && diffDates(mission.date_end_mission, fact_arrival_date) <= 0)) {
        if (mission.isOrderSource) {
          if (status === 'complete' || status === 'fail') {
            errors.fromOrder.cf_list.push(number);
          } else if (status === 'assigned') {
            if (diffDates(mission.date_to, fact_departure_date) <= 0 || diffDates(fact_arrival_date, mission.date_from) <= 0) {
              errors.fromOrder.confirmDialogList.push(number);
            }
          }
        } else if (status === 'complete' || status === 'fail') {
          errors.notFromOrder.cf_list.push(number);
        }
      }

      return errors;
    }, {
      notFromOrder: {
        cf_list: [],
      },
      fromOrder: {
        cf_list: [],
        confirmDialogList: [],
      },
    }),
  )
  .then(checkErrorDate);

export const getWaybillDrivers = (action, formState) => {
  const { status } = formState;
  if (!status || status === 'draft') {
    return action({
      company_id: formState.company_id,
      date_from: formState.plan_departure_date,
      date_to: formState.plan_arrival_date,
    });
  }

  return Promise.resolve();
};

export const getTitleByStatus = ({ status }) => {
  switch (status) {
    case 'active': return 'Активный путевой лист';
    case 'draft': return 'Создание нового путевого листа';
    case 'closed': return 'Просмотр путевого листа ';
    default: return 'Создать новый путевой лист';
  }
};
