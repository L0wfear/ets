import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { insuranceType } from 'redux-main/reducers/modules/autobase/constants';
import { InsuranceType } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const getInsuranceType = autobaseLoadByType<InsuranceType>(insuranceType);
