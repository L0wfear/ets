import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { insuranceType } from 'redux-main/reducers/modules/autobase/constants';

export const getInsuranceType = autobaseLoadByType(insuranceType);
