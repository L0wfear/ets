import { someUniqSetNewData } from 'redux-main/reducers/modules/some_uniq/common';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { promiseGetTechnicalOperationRegistry } from 'redux-main/reducers/modules/some_uniq/technical_operation_registry/promise';

/* --------------- обновление стора --------------- */
export const actionSetTechnicalOperationRegistry = (technicalOperationRegistryList: IStateSomeUniq['technicalOperationRegistryList']) => (dispatch) => (
  dispatch(
    someUniqSetNewData({
      technicalOperationRegistryList,
    }),
  )
);
export const actionSetTechnicalOperationRegistryForMission = (technicalOperationRegistryForMissionList: IStateSomeUniq['technicalOperationRegistryForMissionList']) => (dispatch) => (
  dispatch(
    someUniqSetNewData({
      technicalOperationRegistryForMissionList,
    }),
  )
);
export const actionSetTechnicalOperationRegistryForDutyMission = (technicalOperationRegistryForDutyMissionList: IStateSomeUniq['technicalOperationRegistryForDutyMissionList']) => (dispatch) => (
  dispatch(
    someUniqSetNewData({
      technicalOperationRegistryForDutyMissionList,
    }),
  )
);

/* --------------- сброс стора --------------- */
export const actionResetTechnicalOperationRegistry: any = () => (dispatch) => (
  dispatch(
    actionSetTechnicalOperationRegistry([]),
  )
);
export const actionResetTechnicalOperationRegistryForMission: any = () => (dispatch) => (
  dispatch(
    actionSetTechnicalOperationRegistryForMission([]),
  )
);
export const actionResetTechnicalOperationRegistryForDutyMission: any = () => (dispatch) => (
  dispatch(
    actionSetTechnicalOperationRegistryForDutyMission([]),
  )
);

/* --------------- запрос --------------- */
export const actionGetTechnicalOperationRegistry: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: promiseGetTechnicalOperationRegistry(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);

/* --------------- запрос и установка в стор --------------- */
export const actionGetAndSetInStoreTechnicalOperationRegistry: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    actionGetTechnicalOperationRegistry(payload, { page, path }),
  );

  dispatch(
    actionSetTechnicalOperationRegistry(data),
  );

  return {
    technicalOperationRegistryList: data,
  };
};
export const actionGetAndSetInStoreTechnicalOperationRegistryForMission: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    actionGetTechnicalOperationRegistry(
      {
        for: 'mission',
        ...payload,
      },
      { page, path }),
  );

  dispatch(
    actionSetTechnicalOperationRegistryForMission(data),
  );

  return {
    technicalOperationRegistryForMissionList: data,
  };
};
export const actionGetAndSetInStoreTechnicalOperationRegistryForDutyMission: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    actionGetTechnicalOperationRegistry(
      {
        for: 'duty-mission',
        ...payload,
      },
      { page, path }),
  );

  dispatch(
    actionSetTechnicalOperationRegistryForDutyMission(data),
  );

  return {
    technicalOperationRegistryForDutyMissionList: data,
  };
};

export default {
  actionSetTechnicalOperationRegistry,
  actionSetTechnicalOperationRegistryForMission,
  actionSetTechnicalOperationRegistryForDutyMission,
  actionResetTechnicalOperationRegistry,
  actionResetTechnicalOperationRegistryForMission,
  actionResetTechnicalOperationRegistryForDutyMission,
  actionGetTechnicalOperationRegistry,
  actionGetAndSetInStoreTechnicalOperationRegistry,
  actionGetAndSetInStoreTechnicalOperationRegistryForMission,
  actionGetAndSetInStoreTechnicalOperationRegistryForDutyMission,
};
