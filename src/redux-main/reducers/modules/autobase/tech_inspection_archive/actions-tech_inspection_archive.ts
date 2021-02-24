import {
  promiseChangeArchiveStatus
} from 'redux-main/reducers/modules/autobase/tech_inspection_archive/promises';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';
import { TechInspection } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const actionTechInspectionToArchive = (id: TechInspection['id'], meta: LoadingMeta): EtsAction<Promise<void>> => async (dispatch) => {
  await etsLoadingCounter(
    dispatch,
    promiseChangeArchiveStatus(id, true),
    meta,
  );
};
export const actionTechInspectionFromArchive = (id: TechInspection['id'], meta: LoadingMeta): EtsAction<Promise<void>> => async (dispatch) => {
  await etsLoadingCounter(
    dispatch,
    promiseChangeArchiveStatus(id, false),
    meta,
  );
};