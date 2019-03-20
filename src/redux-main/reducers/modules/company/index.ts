import { createPath } from 'redux-main/redux-utils';
import { IStateCompany } from 'redux-main/reducers/modules/company/@types';

const COMPANY = createPath('COMPANY');

export const COMPANY_SET_DATA = COMPANY`SET_DATA`;

const initialState: IStateCompany = {
  companyList: [],
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case COMPANY_SET_DATA: {
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
