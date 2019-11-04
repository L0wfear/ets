import { get } from 'lodash';
import { isArray, isNumber } from 'util';

import { diffDates } from 'components/@next/@utils/dates/dates';

import { checkErrorDate } from 'components/old/waybill/utils_react';

import { isNotEqualAnd, hasMotohours } from 'utils/functions';
import { Order } from 'redux-main/reducers/modules/order/@types';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { actionLoadFuelRatesByCarModel, actionLoadEquipmentFuelRatesByCarModel } from 'redux-main/reducers/modules/fuel_rates/actions-fuelRates';
import { EtsActionReturnType, EtsDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import { actionGetAndSetInStoreWaybillDriver } from 'redux-main/reducers/modules/employee/driver/actions';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

const VALID_VEHICLES_TYPES = {
  GENERATOR: 69,
  COMPRESSOR: 15,
} as const;

export const getFuelCorrectionRate = (carIndex: Record<Car['asuods_id'], Car>, { car_id }) =>
  Promise.resolve(
    get(carIndex[car_id], 'fuel_correction_rate') || 1,
  );

export const getFuelRatesBySeason = (
  promise: EtsActionReturnType<typeof actionLoadFuelRatesByCarModel | typeof actionLoadEquipmentFuelRatesByCarModel>,
  currentSeason: 'winter' | 'summer',
) => (
  promise.then(({ fuelRatesList }) =>
    fuelRatesList.filter(({ winter_rate, summer_rate }) =>
      currentSeason === 'winter'
        ? isNumber(winter_rate)
        : isNumber(summer_rate),
    ),
  )
);

/** без типизации */

// declarative functional approach
const vehicleFilter = (structure_id: Waybill['structure_id'], car_id: Car['asuods_id']) => (array: Array<Car>) =>
  array.filter(
    (c) =>
      c.asuods_id === car_id
      || ((!structure_id
        || c.is_common
        || c.company_structure_id === structure_id)
        && c.available_to_bind),
  );

const carFilter = (structure_id: Waybill['structure_id'], car_id: Car['asuods_id']) => (array: Array<Car>) =>
  vehicleFilter(structure_id, car_id)(array).filter(
    (c) => (
      !c.is_trailer
      || c.type_id === VALID_VEHICLES_TYPES.COMPRESSOR
      || c.type_id === VALID_VEHICLES_TYPES.GENERATOR
    ),
  );

const trailerFilter = (structure_id: Waybill['structure_id'], trailer_id: Car['asuods_id']) => (array: Array<Car>) =>
  vehicleFilter(structure_id, trailer_id)(array).filter((c) => c.is_trailer);

export const vehicleMapper = (array: Array<Pick<Car, 'asuods_id' | 'model_id' | 'model_name' | 'gov_number' | 'special_model_name' | 'type_name'> & Partial<Car>>) => array.map(
  (c) => {
    return ({
      value: c.asuods_id,
      model_id: c.model_id,
      gov_number: c.gov_number,
      label: `${c.gov_number} [${c.model_name || ''}${c.model_name ? '/' : ''}${c.special_model_name || ''}${c.type_name ? '/' : ''}${c.type_name || ''}]`,
      rowData: {...c},
    });
  });

export const getCars = (structure_id: Waybill['structure_id'], car_id: Car['asuods_id']) => (array: Array<Car>) =>
  vehicleMapper(carFilter(structure_id, car_id)(array));

export const getTrailers = (structure_id: Waybill['structure_id'], trailer_id: Car['asuods_id']) => (array: Array<Car>) => (
  vehicleMapper(trailerFilter(structure_id, trailer_id)(array))
);

const isNotEmpty = (value) => isNotEqualAnd([undefined, null, ''], value);
export const driverHasLicenseWithActiveDate = ({
  drivers_license,
  drivers_license_date_end,
}) =>
  (isNotEmpty(drivers_license) && !isNotEmpty(drivers_license_date_end))
  || (isNotEmpty(drivers_license_date_end)
    && diffDates(new Date(), drivers_license_date_end) < 0);
export const driverHasSpecialLicenseWithActiveDate = ({
  special_license,
  special_license_date_end,
}) =>
  (isNotEmpty(special_license) && !isNotEmpty(special_license_date_end))
  || (isNotEmpty(special_license_date_end)
    && diffDates(new Date(), special_license_date_end) < 0);

const hasOdometr = (gov_number) => !hasMotohours(gov_number);

const licenceSwitcher = (gov_number) => {
  if (hasOdometr(gov_number)) {
    return driverHasLicenseWithActiveDate;
  }
  if (hasMotohours(gov_number)) {
    return driverHasSpecialLicenseWithActiveDate;
  }

  return (d) => d;
};

export const getDrivers = (state, employeeIndex, driversList) => {
  const driverFilter = licenceSwitcher(state.gov_number);
  const driverAfterCheckOnCarEmpl = driversList.filter(
    ({ id, employee_id }) => {
      const key = id || employee_id;
      const driverData = employeeIndex[key];

      if (!driverData) {
        return false;
      }

      let whatCarIWantDrive: boolean | Array<number> = false;

      if (Boolean(driverData.prefer_car)) {
        whatCarIWantDrive = [driverData.prefer_car];
      }
      if (isArray(driverData.secondary_car)) {
        if (isArray(whatCarIWantDrive)) {
          whatCarIWantDrive = [
            ...whatCarIWantDrive,
            ...driverData.secondary_car,
          ];
        } else {
          whatCarIWantDrive = [...driverData.secondary_car];
        }
      }

      return isArray(whatCarIWantDrive)
        ? whatCarIWantDrive.some((car) => car === state.car_id)
        : true;
    },
  );
  const driverListTrue = driverAfterCheckOnCarEmpl.length
    ? driverAfterCheckOnCarEmpl
    : driversList;

  return driverListTrue
    .filter(({ id, employee_id }) => {
      const key = id || employee_id;
      const driverData = employeeIndex[key];

      if (!driverData) {
        return false;
      }

      return (
        (!state.structure_id
          || (driverData.is_common
            || state.structure_id === driverData.company_structure_id))
        && driverFilter(driverData)
      );
    })
    .map(({ id, employee_id }) => {
      const key = id || employee_id;
      const driverData = employeeIndex[key];

      const personnel_number = driverData.personnel_number
        ? `[${driverData.personnel_number}] `
        : '';
      return {
        value: key,
        label: `${personnel_number}${driverData.last_name
          || ''} ${driverData.first_name || ''} ${driverData.middle_name || ''}`,
        isPrefer: driverData.prefer_car === state.car_id,
      };
    });
};

export function validateTaxesControl(taxes: Array<Array<any>>): boolean {
  const isAllTaxesEmpty = taxes.every((tax = []) => tax.length === 0);

  if (isAllTaxesEmpty) {
    return false;
  }

  const nonEmptyTaxes = taxes.filter((tax = []) => tax.length > 0);

  return !nonEmptyTaxes
    .map((taxData) =>
      taxData.map((t) => t && t.OPERATION !== undefined).includes(false),
    )
    .includes(true);
}

// хе хе
export function checkDateMission({
  dateTo: { date_start, date_end },
  dateWaybill: { plan_departure_date, plan_arrival_date },
}) {
  return (
    diffDates(date_end, plan_departure_date) < 0
    || diffDates(plan_arrival_date, date_start) < 0
  );
}

export const getDatesToByOrderOperationId = (order: Order, order_operation_id) => {
  const { date_from = '', date_to = '' }
    = order.technical_operations.find(({ id }) => id === order_operation_id)
    || {};
  const date_start = date_from || order.order_date;
  const date_end = date_to || order.order_date_to;

  return {
    dateTo: {
      date_start,
      date_end,
    },
  };
};

export const checkMissionSelectBeforeClose = (
  formState,
  missionsIndex,
  order_mission_source_id,
  orderAction: (id: number) => Promise<Order>,
) =>
  Promise.all<any>(
    formState.mission_id_list.map((mission_id) => {
      const missionData = missionsIndex[mission_id];
      const mainMissionData = {
        ...missionData,
        date_start_mission: missionData.date_start,
        date_end_mission: missionData.date_end,
      };

      if (missionData.mission_source_id === order_mission_source_id) {
        const { order_id } = missionData;
        return orderAction(order_id)
          .then((order: Order) => {
            const missionOrderTo = order.technical_operations.find(
              ({ id: to_id }) => to_id === missionData.order_operation_id,
            );

            return {
              ...mainMissionData,
              isOrderSource: true,
              date_from: missionOrderTo.date_from || order.order_date,
              date_to: missionOrderTo.date_to || order.order_date_to,
            };
          })
          .catch(({ error_text }) => {
            // tslint:disable-next-line
            console.error(
              `Ошибка получения централизованного задания| id = ${order_id}`,
              error_text,
            );
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
    }),
  )
    .then((missions) =>
      missions.reduce(
        (errors, mission) => {
          const {
            fact_departure_date,
            fact_arrival_date,
            plan_departure_date,
            plan_arrival_date,
          } = formState;
          const { number } = mission;

          if (
            !(
              diffDates(
                fact_departure_date || plan_departure_date,
                mission.date_start_mission,
              ) <= 0
              && diffDates(
                mission.date_end_mission,
                fact_arrival_date || plan_arrival_date,
              ) <= 0
            )
          ) {
            if (mission.isOrderSource) {
              if (status === 'complete' || status === 'fail') {
                errors.fromOrder.cf_list.push(number);
              } else if (
                status === 'assigned'
                || status === 'expired'
                || status === 'in_progress'
              ) {
                if (
                  diffDates(
                    mission.date_to,
                    fact_departure_date || plan_departure_date,
                  ) <= 0
                  || diffDates(
                    fact_arrival_date || plan_arrival_date,
                    mission.date_from,
                  ) <= 0
                ) {
                  errors.fromOrder.confirmDialogList.push(number);
                }
              }
            } else if (status === 'complete' || status === 'fail') {
              errors.notFromOrder.cf_list.push(number);
            }
          }

          return errors;
        },
        {
          notFromOrder: {
            cf_list: [],
          },
          fromOrder: {
            cf_list: [],
            confirmDialogList: [],
          },
        },
      ),
    )
    .then(checkErrorDate);

export const getWaybillDrivers = (
  dispatch: EtsDispatch,
  formState: Waybill,
  meta: LoadingMeta,
) => {
  const { status } = formState;
  if (!status || status === 'draft') {
    return dispatch(
      actionGetAndSetInStoreWaybillDriver(
        {
          company_id: formState.company_id,
          date_from: formState.plan_departure_date,
          date_to: formState.plan_arrival_date,
        },
        meta,
      ),
    );
  }

  return Promise.resolve(null);
};

export const getTitleByStatus = ({ status }) => {
  switch (status) {
    case 'active':
      return 'Активный путевой лист';
    case 'draft':
      return 'Создание нового путевого листа';
    case 'closed':
      return 'Просмотр путевого листа ';
    default:
      return 'Создать новый путевой лист';
  }
};
