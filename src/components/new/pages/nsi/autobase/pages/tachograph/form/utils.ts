import { isObject, isNullOrUndefined } from 'util';
import { cloneDeep } from 'lodash';
import {
  TachographListWithOuterProps,
  TachographListOuterProps,
  TachographList,
  TachographListDataForValidation,
} from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_registry/@types';

export const defaultTachographOuterProps: TachographListOuterProps = {
  tachograph_data_reading: [],
  tachograph_replacement_skzi: [],
};

export const defaultTachograph: TachographList = {
  activated_at: '',
  calibration_date: '',
  comment: '',
  company_id: null,
  company_name: '',
  company_structure_id: null,
  company_structure_name: '',
  factory_number: '',
  gov_number: '',
  id: null,
  installed_at: '',
  install_company_name: '',
  next_calibration_date: '',
  next_replacement_date: '',
  okrug_id: null,
  okrug_name: '',
  plan_replacement: '',
  reading_fact_date: '',
  reading_plan_date: '',
  repair_date: '',
  repair_reason_name: '',
  replacement_date: '',
  tachograph_brand_name: '',
  tachograph_brand_id: null,
  tachograph_on_car: [],
  uninstalled_at: '',
  verification_date: '',
  verification_date_validity: '',
};

export const defaultTachographDataForValidation: TachographListDataForValidation = {
  current_date: '',
};

export const defaultTachographWithOuterProps: TachographListWithOuterProps = {
  ...defaultTachograph,
  ...defaultTachographOuterProps,
  ...defaultTachographDataForValidation,
};

export const getDefaultTachographElement = (
  element: Partial<TachographListWithOuterProps>
): TachographListWithOuterProps => {
  const newElement = cloneDeep(defaultTachographWithOuterProps);
  if (isObject(element)) {
    Object.keys(defaultTachographWithOuterProps).forEach((key) => {
      if (key === 'tachograph_on_car') {
        if (!isNullOrUndefined(element[key])) {
          newElement[key] = element[key].map((rowData, index) => {
            return {
              ...rowData,
              customId: index + 1,
            };
          });
        } else {
          newElement[key] = !isNullOrUndefined(element[key])
            ? element[key]
            : defaultTachographWithOuterProps[key];
        }
      } else if (key === 'tachograph_data_reading') {
      } else {
        newElement[key] = !isNullOrUndefined(element[key])
          ? element[key]
          : defaultTachographWithOuterProps[key];
      }
    });
  }

  return newElement;
};
