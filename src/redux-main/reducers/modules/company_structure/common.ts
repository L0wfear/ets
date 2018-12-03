import {
  COMPANY_STRUCTURE_SET_DATA,
} from 'redux-main/reducers/modules/company_structure/company_structure';
import { IStateCompanyStructure } from 'redux-main/reducers/modules/company_structure/@types/company_structure.h';

export const companyStructureSetNewData = (newStateData: { [K in keyof IStateCompanyStructure]?: IStateCompanyStructure[K] }) => ({
  type: COMPANY_STRUCTURE_SET_DATA,
  payload: newStateData,
});
