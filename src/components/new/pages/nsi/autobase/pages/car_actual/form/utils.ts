import { isObject, isNullOrUndefined } from 'util';
import memoizeOne from 'memoize-one';
import { CarWrap, MileageTypesArray } from './@types/CarForm';
import { Employee } from 'redux-main/reducers/modules/employee/@types/employee.h';
import { isFourDigitGovNumber } from 'utils/functions';
import { createValidDate, diffDates } from 'components/@next/@utils/dates/dates';
import { get } from 'lodash';
import * as React from 'react';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { actionGetAndSetInStoreMileageOptions } from 'redux-main/reducers/modules/some_uniq/car_mileage_options/actions';
import { MileageType } from 'redux-main/reducers/modules/some_uniq/car_mileage_options/@types';

export const getDefaultCar = (): CarWrap => ({
  asuods_id: null,
  available: null,
  available_to_bind: null,
  body_capacity: null,
  body_number: '',
  car_group_id: null,
  car_group_name: '',
  certificate_number: '',
  company_id: null,
  company_name: '',
  company_name_contractor: '',
  company_name_customer: '',
  company_structure_id: null,
  company_structure_name: '',
  condition: null,
  condition_bool: null,
  condition_text: '',
  equipment_sensors_str: '',
  equipment_sensors_types_ids: [],
  exploitation_date_start: '',
  factory_number: '',
  for_driver_license: null,
  for_special_license: null,
  fuel_correction_rate: null,
  full_model_name: '',
  garage_number: '',
  gov_number: '',
  gps_code: '',
  is_common: false,
  is_gibdd_passport: null,
  is_gtn_passport: null,
  is_gims_passport: null,
  is_trailer: null,
  is_trailer_required: null,
  level_sensors_num: null,
  load_capacity: null,
  max_speed: null,
  mileage_type_id: null,
  model_id: null,
  model_name: '',
  note: '',
  okrug_id: null,
  okrug_name: '',
  operating_mode: '',
  owner_id: null,
  owner_name: '',
  parking_address: '',
  passport_number: null,
  season: null,
  season_label: null,
  season_name: '',
  special_model_id: null,
  special_model_name: '',
  type_id: null,
  type_image_name: '',
  type_name: '',
  vin: '',

  drivers_data: {
    car_id: null,
    primary_drivers: [],
    secondary_drivers: [],
  },
  registration_data: {
    car_id: null,
    certificate_number: '',
    given_at: '',
    given_by: '',
    id: null,
    note: '',
    disabled: false,
    files: [],
    passport_data_type: null,
  },
  passport_data: {
    address: '',
    axle_number: '',
    body_color: '',
    body_number: '',
    car_id: null,
    category_id: null,
    chassis: '',
    company_address: '',
    conformity_certificate: '',
    customs_declaration: '',
    customs_restrictions: '',
    dimensions: '',
    empty_weight: null,
    engine_model: '',
    engine_number: '',
    engine_power: null,
    engine_type_id: null,
    engine_volumne: null,
    environmental_class: '',
    exporter_country_id: null,
    func_type_id: null,
    func_type_name: '',
    gearbox: '',
    given_at: '',
    given_by: '',
    id: null,
    is_gibdd: null,
    is_gims: null,
    is_gtn: null,
    manufactured_at: null,
    manufacturer: '',
    max_speed: null,
    max_weight: null,
    number: null,
    origin_country_id: null,
    propulsion_type_id: null,
    seria_number: '',
    tech_inspection_certificate: '',
    type: null,
    vin: '',
    car_passports: [],
    disabled: false,
    files: [],
  },
  employee_data: {
    data: [],
    dataIndex: {},
  },
  engine_kind_ids: [],
});

export const getDefaultCarElement = (element: Partial<CarWrap>): CarWrap => {
  const newElement = { ...getDefaultCar() };
  if (isObject(element)) {
    Object.keys(newElement).forEach((key) => {
      if (key === 'drivers_data') {
        newElement[key] = getDefaultCar()[key];
        if (isObject(element[key])) {
          Object.keys(newElement[key]).forEach((key2) => {
            newElement[key][key2] = !isNullOrUndefined(element[key][key2]) ? element[key][key2] : getDefaultCar()[key][key2];
          });
        }
      } else if (key === 'registration_data') {
        newElement[key] = getDefaultCar()[key];
        if (isObject(element[key])) {
          Object.keys(newElement[key]).forEach((key2) => {
            newElement[key][key2] = !isNullOrUndefined(element[key][key2]) ? element[key][key2] : getDefaultCar()[key][key2];
          });
        }
      } else if (key === 'passport_data') {
        newElement[key] = getDefaultCar()[key];
        if (isObject(element[key])) {
          Object.keys(newElement[key]).forEach((key2) => {
            newElement[key][key2] = !isNullOrUndefined(element[key][key2]) ? element[key][key2] : getDefaultCar()[key][key2];
          });
        }
      } else if (key === 'exploitation_date_start' && !isNullOrUndefined(element[key])) {
        newElement[key] = createValidDate(element[key]);
      } else {
        newElement[key] = !isNullOrUndefined(element[key]) ? element[key] : getDefaultCar()[key];
      }
    });
  }

  return newElement;
};

export const memoizeMergeElement = memoizeOne(
  (element: any, selectedCarData: CarWrap) => {
    if (!element.car_id && selectedCarData) {
      return {
        ...element,
        car_id: selectedCarData.asuods_id,
        car_gov_number: selectedCarData.gov_number,
      };
    }

    return element;
  },
);

/**
 * Проверка доступности водителя на прикрепление к ТС
 * @param employeeData данные по водителю из employee
 * @param gov_number номер ТС
 * @param payload Дополнительные параметры фильтрыции
 */
export const filterDriver = (employeeData: Employee, gov_number: CarWrap['gov_number'], payload?: { includeNotActive?: boolean; isValidSpecialLicense?: boolean; isValidDriverlLicense?: boolean; isValidOneOfLicense?: boolean; }) => {
  if (employeeData) {
    const isFourInGovNumver = isFourDigitGovNumber(gov_number);

    if (employeeData.active || get(payload, 'includeNotActive')) {             // сотрудник активен || включить некактивных

      const validSpecialLicense = employeeData.special_license                 // есть специальное удостоверение
        && employeeData.special_license_date_end                               // есть дата окончания специального удостоверения
        && diffDates(employeeData.special_license_date_end, new Date()) > 0;   // срок действия специального удостоверения не закончился

      const validDriverLicense = employeeData.drivers_license                                            // есть водительское удостоверение
        && employeeData.drivers_license_date_end                                // есть дата окончания водительского удостоверения
        && diffDates(employeeData.drivers_license_date_end, new Date()) > 0;    // срок действия водительского удостоверения не закончился
      
      if (payload?.isValidOneOfLicense){   
        return validSpecialLicense || validDriverLicense;
      }

      if (payload?.isValidSpecialLicense){                                       // у сотрудника есть спец. удостоверение и оно валидно
        return validSpecialLicense;
      }

      if (payload?.isValidDriverlLicense){                                       // у сотрудника есть вод. удостоверение и оно валидно
        return validDriverLicense;
      }

      if (isFourInGovNumver) {
        return validSpecialLicense;
      }

      return validDriverLicense;
    }
  }

  return false;
};

/**
 * Проверка водителя для карточки ТС вкладки ДТП
 * @param employeeData данные по водителю из driver
 * @param gov_number номер ТС
 */
export const filterDriverAccident = (employeeData: any, gov_number: CarWrap['gov_number']) => {
  if (employeeData) {
    const isFourInGovNumver = isFourDigitGovNumber(gov_number);

    if (isFourInGovNumver) {
      return employeeData.special_license;                                         // есть специальное удостоверение
    }

    return employeeData.drivers_license;                                            // есть водительское удостоверение

  }

  return false;
};

export const useMileageOptions = (meta: {page: string; path?: string;}): MileageTypesArray => {
  const dispatch = etsUseDispatch();
  const [mileageTypesList, setMileageTypesList] = React.useState<Array<MileageType>>([]);
  React.useEffect(() => {
    ( async () => {
      const mileageTypesList = await (await dispatch(actionGetAndSetInStoreMileageOptions({}, meta)))?.data;
      setMileageTypesList(mileageTypesList);
    })();
  }, []);

  const mileageTypeOptions = React.useMemo(() => {
    return mileageTypesList.map((el) => (
      {
        value: el.id,
        label: el.name,
      }
    ));
  }, [mileageTypesList]);
  return mileageTypeOptions;
};