import { someUniqSetNewData } from 'redux-main/reducers/modules/some_uniq/common';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { promiseGetTechnicalOperationRegistry } from 'redux-main/reducers/modules/some_uniq/technical_operation_registry/promise';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

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
export const actionResetTechnicalOperationRegistry = (): EtsAction<void> => async (dispatch) => {
  dispatch(
    actionSetTechnicalOperationRegistry([]),
  );

  return null;
};
export const actionResetTechnicalOperationRegistryForMission = (): EtsAction<void> => async (dispatch) => {
  dispatch(
    actionSetTechnicalOperationRegistryForMission([]),
  );

  return null;
};
export const actionResetTechnicalOperationRegistryForDutyMission = (): EtsAction<void> => async (dispatch) => {
  dispatch(
    actionSetTechnicalOperationRegistryForDutyMission([]),
  );

  return null;
};

/* --------------- запрос --------------- */
export const actionGetTechnicalOperationRegistry = (payload = {}, { page, path }: LoadingMeta): EtsAction<ReturnType<typeof promiseGetTechnicalOperationRegistry>> => async (dispatch) => (
  etsLoadingCounter(
    dispatch,
    promiseGetTechnicalOperationRegistry(payload),
    {
      page,
      path,
    },
  )
);

/* --------------- запрос и установка в стор --------------- */
export const actionGetAndSetInStoreTechnicalOperationRegistry: any = (payload = {}, { page, path }: LoadingMeta): EtsAction<ReturnType<typeof promiseGetTechnicalOperationRegistry>> => async (dispatch) => {
  const result = await dispatch(
    actionGetTechnicalOperationRegistry(payload, { page, path }),
  );

  dispatch(
    actionSetTechnicalOperationRegistry(result.data),
  );

  return result;
};

export const actionGetAndSetInStoreTechnicalOperationRegistryForMission = (payload, { page, path }: LoadingMeta): EtsAction<ReturnType<typeof promiseGetTechnicalOperationRegistry>> => async (dispatch) => {
  const result = await dispatch(
    actionGetTechnicalOperationRegistry(
      {
        for: 'mission',
        ...payload,
      },
      { page, path }),
  );

  dispatch(
    actionSetTechnicalOperationRegistryForMission(result.data),
  );

  return result;
};

export const actionGetAndSetInStoreTechnicalOperationRegistryForDutyMission = (payload = {}, { page, path }: LoadingMeta): EtsAction<ReturnType<typeof promiseGetTechnicalOperationRegistry>> => async (dispatch) => {
  const result = await dispatch(
    actionGetTechnicalOperationRegistry(
      {
        for: 'duty_mission',
        needs_brigade: true,
        ...payload,
      },
      { page, path }),
  );

  dispatch(
    actionSetTechnicalOperationRegistryForDutyMission(result.data),
  );

  return result;
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
