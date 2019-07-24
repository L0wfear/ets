import { createPath } from 'redux-main/redux-utils';
import { IStateAutobase } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

const AUTOBASE = createPath('AUTOBASE');

export const AUTOBASE_SET_DATA = AUTOBASE`SET_DATA`;

export const autobaseInitialState: IStateAutobase = {
  sparePartList: [],
  measureUnitList: [],
  sparePartGroupList: [],
  batteryBrandList: [],
  batteryManufacturerList: [],
  batteryRegistryList: [],
  batteryAvailableCarList: [],
  insuranceTypeList: [],
  insurancePolicyList: [],
  carList: [],
  carFuncTypesList: [],
  repairList: [],
  repairCompanyList: [],
  repairTypeList: [],
  roadAccidentList: [],
  roadAccidentCauseList: [],
  techInspectionList: [],
  techMaintOrderList: [],
  techMaintTypeList: [],
  measureUnitRunList: [],
  tireModelList: [],
  tireManufacturerList: [],
  tireList: [],
  tireSizeList: [],
  tireAvailableCarList: [],
  spareAvailableCarList: [],
  actualBatteriesOnCarList: [],
  actualTiresOnCarList: [],
  techMaintList: [],
  techMaintExtra: {
    car_interval_time: null,
    car_interval_probeg: null,
  },
  carCategoryList: [],
  engineTypeList: [],
  propulsionTypeList: [],
  fuelCardsList: [],
  fuelTypeList: [],
  typesAttrList: [],
};

export default (state = autobaseInitialState, { type, payload }) => {
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
