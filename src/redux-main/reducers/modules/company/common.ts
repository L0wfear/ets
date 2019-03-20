import {
  COMPANY_SET_DATA,
} from 'redux-main/reducers/modules/company';
import { IStateCompany } from 'redux-main/reducers/modules/company/@types';

export const actionCompanySetNewData = (newStateData: { [K in keyof IStateCompany]?: IStateCompany[K] }) => ({
  type: COMPANY_SET_DATA,
  payload: newStateData,
});
