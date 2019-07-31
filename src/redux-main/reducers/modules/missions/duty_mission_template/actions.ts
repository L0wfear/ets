import { missionsSetNewData } from 'redux-main/reducers/modules/missions/common';
import { IStateMissions } from 'redux-main/reducers/modules/missions/@types/missions.h';
import {
  promiseGetDutyMissionTemplate,
  promiseCreateDutyMissionTemplate,
  promiseUpdateDutyMissionTemplate,
  promiseRemoveDutyMissionTemplates,
  promiseRemoveDutyMissionTemplate,
} from 'redux-main/reducers/modules/missions/duty_mission_template/promise';
import { DutyMissionTemplate } from './@types/index.h';
import { EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { HandleThunkActionCreator } from 'react-redux';

export const actionSetDutyMissionTemplate = (dutyMissionTemplateList: IStateMissions['dutyMissionTemplateList']): EtsAction<IStateMissions['dutyMissionTemplateList']> => (dispatch) => {
  dispatch(
    missionsSetNewData({
      dutyMissionTemplateList,
    }),
  );

  return dutyMissionTemplateList;
};
export const actionResetDutyMissionTemplate = (): EtsAction<IStateMissions['dutyMissionTemplateList']> => (dispatch) => {
  const dutyMissionTemplateList: IStateMissions['dutyMissionTemplateList'] = [];

  dispatch(
    actionSetDutyMissionTemplate(dutyMissionTemplateList),
  );

  return dutyMissionTemplateList;
};
export const actionGetDutyMissionTemplate = (payloadOwn: object, meta: LoadingMeta): EtsAction<ReturnType<typeof promiseGetDutyMissionTemplate>> => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseGetDutyMissionTemplate(payloadOwn),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};
export const actionGetAndSetInStoreDutyMissionTemplate = (payloadOwn: object, meta: LoadingMeta): EtsAction<ReturnType<HandleThunkActionCreator<typeof actionGetDutyMissionTemplate>>> => async (dispatch) => {
  dispatch(actionResetDutyMissionTemplate());

  const response = await dispatch(
    actionGetDutyMissionTemplate(payloadOwn, meta),
  );

  dispatch(
    actionSetDutyMissionTemplate(response.data),
  );

  return response;
};
export const actionCreateDutyMissionTemplate = (dutyDutyMissionTemplateRaw: Partial<DutyMissionTemplate>, meta: LoadingMeta): EtsAction<ReturnType<typeof promiseCreateDutyMissionTemplate>>  => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseCreateDutyMissionTemplate(dutyDutyMissionTemplateRaw),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};
export const actionUpdateDutyMissionTemplate = (dutyDutyMissionTemplateOld: Partial<DutyMissionTemplate> & Pick<DutyMissionTemplate, 'id'>, meta: LoadingMeta): EtsAction<ReturnType<typeof promiseUpdateDutyMissionTemplate>> => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseUpdateDutyMissionTemplate(dutyDutyMissionTemplateOld),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};
export const actionRemoveDutyMissionTemplates = (dutyDutyMissionTemplateOldArr: (Pick<DutyMissionTemplate, 'id'> & Partial<DutyMissionTemplate>)[], meta: LoadingMeta): EtsAction<ReturnType<typeof promiseRemoveDutyMissionTemplates>> => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseRemoveDutyMissionTemplates(dutyDutyMissionTemplateOldArr.map(({ id }) => id)),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};
export const actionRemoveDutyMissionTemplate = (dutyDutyMissionTemplateOld: Pick<DutyMissionTemplate, 'id'> & Partial<DutyMissionTemplate>, meta: LoadingMeta): EtsAction<ReturnType<typeof promiseRemoveDutyMissionTemplate>> => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseRemoveDutyMissionTemplate(dutyDutyMissionTemplateOld.id),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};

export default {
  actionSetDutyMissionTemplate,
  actionResetDutyMissionTemplate,
  actionGetDutyMissionTemplate,
  actionGetAndSetInStoreDutyMissionTemplate,
  actionCreateDutyMissionTemplate,
  actionUpdateDutyMissionTemplate,
  actionRemoveDutyMissionTemplates,
  actionRemoveDutyMissionTemplate,
};
