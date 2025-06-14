import { createValidDate } from 'components/@next/@utils/dates/dates';
import {
  autobaseCreateByType,
  autobaseUpdateByType,
  autobaseRemoveByType,
} from 'redux-main/reducers/modules/autobase/promises';
import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { insurancePolicy } from 'redux-main/reducers/modules/autobase/constants';
import { get } from 'lodash';
import { InsurancePolicy } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const getInsurancePolicy = autobaseLoadByType<InsurancePolicy>(insurancePolicy);
export const createInsurancePolicy = autobaseCreateByType<InsurancePolicy>(insurancePolicy);
export const updateInsurancePolicy = autobaseUpdateByType<InsurancePolicy>(insurancePolicy);
export const autobaseDeleteInsurancePolicy = autobaseRemoveByType(insurancePolicy);

export const getSetInsurancePolicy = async (payload) => {
  const { data } = await getInsurancePolicy(payload);

  return {
    data: data.map((rowData) => {
      rowData.files = get(rowData, 'files', []);

      return rowData;
    }),
  };
};

export const createSetInsurancePolicy = (rawInsurancePolicy) => {
  const payload = {
    ...rawInsurancePolicy,
    created_at: createValidDate(rawInsurancePolicy.created_at),
    updated_at: createValidDate(rawInsurancePolicy.updated_at),
    date_start: createValidDate(rawInsurancePolicy.date_start),
    date_end: createValidDate(rawInsurancePolicy.date_end),
  };

  return createInsurancePolicy(
    payload,
  );
};
export const updateSetInsurancePolicy = (oldInsurancePolicy) => {
  const payload = {
    ...oldInsurancePolicy,
    created_at: createValidDate(oldInsurancePolicy.created_at),
    updated_at: createValidDate(oldInsurancePolicy.updated_at),
    date_start: createValidDate(oldInsurancePolicy.date_start),
    date_end: createValidDate(oldInsurancePolicy.date_end),
  };

  return updateInsurancePolicy(
    payload,
  );
};
