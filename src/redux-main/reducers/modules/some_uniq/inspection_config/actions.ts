import { someUniqSetNewData } from 'redux-main/reducers/modules/some_uniq/common';
import { promiseLoadInspectionConfig } from './promise';
import { InspectionConfig } from './@types';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { EtsActionReturnType, EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { getOptionsConfigByObject } from 'utils/functions';
import { actionLoadInspectionCountry } from 'redux-main/reducers/modules/services/services_actions';
import { getCountryOptions } from 'components/new/utils/hooks/services/useOptions/useCountryOptions';

export const actionSetInspectionConfig = (inspectionConfig: InspectionConfig): EtsAction<EtsActionReturnType<typeof someUniqSetNewData>> => (dispatch) => (
  dispatch(
    someUniqSetNewData({
      inspectionConfig,
    }),
  )
);
export const actionResetSetInspectionConfig = (): EtsAction<EtsActionReturnType<typeof actionSetInspectionConfig>> => (dispatch) => (
  dispatch(
    actionSetInspectionConfig(null),
  )
);
export const actionLoadInspectionConfig = (meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseLoadInspectionConfig>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    promiseLoadInspectionConfig(),
    meta,
  );
};

export const actionInspectionConfigGetAndSetInStore = (...arg: Parameters<typeof actionLoadInspectionConfig>): EtsAction<EtsActionReturnType<typeof actionLoadInspectionConfig>> => async (dispatch) => {
  const result = await dispatch(
    actionLoadInspectionConfig(...arg),
  );
  const country = await dispatch(
    actionLoadInspectionCountry(...arg),
  );

  const countryOptions = getCountryOptions(country);
  const optionListByKey = getOptionsConfigByObject(result.data);

  dispatch(
    actionSetInspectionConfig({
      ...optionListByKey,
      origin_country: countryOptions.options,
    }),
  );

  return result;
};
