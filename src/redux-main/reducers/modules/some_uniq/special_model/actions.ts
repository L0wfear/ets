import { someUniqSetNewData } from 'redux-main/reducers/modules/some_uniq/common';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { promiseGetSpecialModel } from 'redux-main/reducers/modules/some_uniq/special_model/promise';

export const actionSetSpecialModel = (specialModelList: IStateSomeUniq['specialModelList']) => (dispatch) => (
  dispatch(
    someUniqSetNewData({
      specialModelList,
    }),
  )
);
export const actionResetSpecialModel: any = () => (dispatch) => (
  dispatch(
    actionSetSpecialModel([]),
  )
);
export const actionGetCompanyStructure: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: promiseGetSpecialModel(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
export const actionGetAndSetInStoreSpecialModel: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    actionGetCompanyStructure(payload, { page, path }),
  );

  dispatch(
    actionSetSpecialModel(data),
  );

  return {
    driverList: data,
  };
};
