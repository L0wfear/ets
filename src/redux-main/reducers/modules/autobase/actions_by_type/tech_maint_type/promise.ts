import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { techMaintType } from 'redux-main/reducers/modules/autobase/constants';
import { TechMaintType } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const getTechMaintType = autobaseLoadByType<TechMaintType>(techMaintType);
