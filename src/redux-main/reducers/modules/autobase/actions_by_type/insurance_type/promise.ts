import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { insuranceType } from 'constants/autobase';

export const getInsuranceType = autobaseLoadByType(insuranceType);
