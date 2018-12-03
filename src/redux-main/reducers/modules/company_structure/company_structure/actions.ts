import { companyStructureSetNewData } from 'redux-main/reducers/modules/company_structure/common';
import {
  getSetCompanyStructure,
  getSetCompanyStructureLinear,
} from 'redux-main/reducers/modules/company_structure/company_structure/promise';
import { IStateCompanyStructure } from 'redux-main/reducers/modules/company_structure/@types/company_structure.h';

export const companyStructureDriverSetCompanyStructure = (companyStructureList: IStateCompanyStructure['companyStructureList']) => (dispatch) => (
  dispatch(
    companyStructureSetNewData({
      companyStructureList,
    }),
  )
);
export const company_structureDriverResetSetDriver = () => (dispatch) => (
  dispatch(
    companyStructureDriverSetCompanyStructure([]),
  )
);
export const companyStructureDriverGetSetCompanyStructure: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: getSetCompanyStructure(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
export const driverGetAndSetInStore = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    companyStructureDriverGetSetCompanyStructure(payload, { page, path }),
  );

  dispatch(
    companyStructureDriverSetCompanyStructure(data),
  );

  return {
    driverList: data,
  };
};

export const companyStructureDriverSetCompanyStructureLinear = (companyStructureLinearList: IStateCompanyStructure['companyStructureLinearList']) => (dispatch) => (
  dispatch(
    companyStructureSetNewData({
      companyStructureLinearList,
    }),
  )
);
export const companyStructureDriverResetSetCompanyStructureLinear = () => (dispatch) => (
  dispatch(
    companyStructureDriverSetCompanyStructure([]),
  )
);
export const companyStructureDriverGetSetCompanyStructureLinear: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: getSetCompanyStructureLinear(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
export const companyStructureLinearGetAndSetInStore = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    companyStructureDriverGetSetCompanyStructureLinear(payload, { page, path }),
  );

  dispatch(
    companyStructureDriverSetCompanyStructureLinear(data),
  );

  return {
    driverList: data,
  };
};
