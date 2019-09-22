import { someUniqSetNewData } from 'redux-main/reducers/modules/some_uniq/common';
import { promiseLoadInspectionConfig, promiseLoadCountry, promiseLoadAutobaseEngineType } from './promise';
import { InspectionConfig } from './@types';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { EtsActionReturnType, EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { getOptionsConfigByObject } from 'utils/functions';
import { getCountryOptions } from 'components/new/utils/hooks/services/useOptions/useCountryOptions';
import { getAutobaseEngineTypeOptions } from 'components/new/utils/hooks/services/useOptions/useAutobaseEngineTypeOptions';
import { seasonInspectionOptions } from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_form/blocks/info_card/car_info/blocks/main_data/inside_fields/season/FieldCarsConditionsCarSeason';
import { actionLoadSpecialModel } from '../special_model/actions';
import { getSpecialModelOptions } from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_form/blocks/info_card/car_info/blocks/main_data/inside_fields/model/useSpecialModelOptionsByName';
import { actionGetModelList } from '../modelList/actions';
import { getModelOptionsByTitle } from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_form/blocks/info_card/car_info/blocks/main_data/inside_fields/marka/useLoadModelOptionsByTitle';
import { autobaseGetSetCarFuncTypes } from '../../autobase/car_func_types/actions';
import { getCarFuncTypesOptionsByName } from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_form/blocks/info_card/car_info/blocks/main_data/inside_fields/type/useCarFuncTypesOptionsByName';

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

export const actionLoadInspectionCountry = (meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseLoadCountry>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    promiseLoadCountry(),
    meta,
  );
};

export const actionLoadAutobaseEngineType = (meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseLoadAutobaseEngineType>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    promiseLoadAutobaseEngineType(),
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
  const engineType = await dispatch(
    actionLoadAutobaseEngineType(...arg),
  );
  const model = await dispatch(
    actionLoadSpecialModel({}, ...arg),
  );
  const marka = await dispatch(
    actionGetModelList({}, ...arg),
  );
  const type = await dispatch(
    autobaseGetSetCarFuncTypes({}, ...arg),
  );

  const countryOptions = getCountryOptions(country);
  const autobaseEngineTypeOptions = getAutobaseEngineTypeOptions(engineType);
  const modelOptions = getSpecialModelOptions(model.data);
  const markaOptions = getModelOptionsByTitle(marka.data);
  const typeOptions = getCarFuncTypesOptionsByName(type.data);
  const optionListByKey = getOptionsConfigByObject(result.data);

  dispatch(
    actionSetInspectionConfig({
      ...optionListByKey,
      origin_country: countryOptions.options,
      engine_type: autobaseEngineTypeOptions.options,
      season: seasonInspectionOptions,
      model: modelOptions,
      marka: markaOptions,
      type: typeOptions,
    }),
  );

  return result;
};
