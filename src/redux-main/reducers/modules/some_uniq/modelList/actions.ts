import { someUniqSetNewData } from 'redux-main/reducers/modules/some_uniq/common';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { promiseGetModelList } from 'redux-main/reducers/modules/some_uniq/modelList/promise';

export const actionSetModelList = (modelsList: IStateSomeUniq['modelsList']) => (dispatch) => (
  dispatch(
    someUniqSetNewData({
      modelsList,
    }),
  )
);
export const actionResetModelList: any = () => (dispatch) => (
  dispatch(
    actionSetModelList([]),
  )
);

export const actionGetModelList: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: promiseGetModelList(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);

export const actionGetAndSetInStoreModelList: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    actionGetModelList(payload, { page, path }),
  );

  dispatch(
    actionSetModelList(data),
  );

  return {
    driverList: data,
  };
};
