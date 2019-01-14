import {
  AUTOBASE_SET_DATA,
} from 'redux-main/reducers/modules/autobase/autobase';
import { IStateAutobase } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const autobaseSetNewData = (newStateData: { [K in keyof IStateAutobase]?: IStateAutobase[K] }) => ({
  type: AUTOBASE_SET_DATA,
  payload: newStateData,
});
