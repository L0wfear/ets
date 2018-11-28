import { createPath } from 'redux-main/redux-utils';
import { IStateAutobase } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

const AUTOBASE = createPath('AUTOBASE');

export const AUTOBASE_SET_DATA = AUTOBASE`SET_DATA`;

const initialState: IStateAutobase = {
  sparePartList: [],
  measureUnitList: [],
  sparePartGroupList: [],
  batteryBrandList: [],
  batteryManufacturerList: [],
  batteryRegistryList: [],
  insuranceTypeList: [],
  insurancePolicyList: [],
  carList: [],
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case AUTOBASE_SET_DATA: {
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
