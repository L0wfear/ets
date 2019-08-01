import { someUniqSetNewData } from 'redux-main/reducers/modules/some_uniq/common';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { promiseGetSpecialModel } from 'redux-main/reducers/modules/some_uniq/special_model/promise';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';

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
export const actionLoadSpecialModel: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
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

type actionGetAndSetInStoreSpecialModelAns = {
  driverList: any[];
};

export const actionGetAndSetInStoreSpecialModel = (payload: object, meta: LoadingMeta): EtsAction<Promise<actionGetAndSetInStoreSpecialModelAns>> => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    actionLoadSpecialModel(payload, meta),
  );

  dispatch(
    actionSetSpecialModel(data),
  );

  return {
    driverList: data,
  };
};
