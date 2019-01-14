import { createPath } from 'redux-main/redux-utils';
import { IStateCompanyStructure } from 'redux-main/reducers/modules/company_structure/@types/company_structure.h';

const COMPANY_STRUCTURE = createPath('COMPANY_STRUCTURE');

export const COMPANY_STRUCTURE_SET_DATA = COMPANY_STRUCTURE`SET_DATA`;

const initialState: IStateCompanyStructure = {
  companyStructureList: [],
  companyStructureLinearList: [],
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case COMPANY_STRUCTURE_SET_DATA: {
      return {
        ...state,
        ...payload,
      };
    }
    default: {
      return state;
    }
  }
};
