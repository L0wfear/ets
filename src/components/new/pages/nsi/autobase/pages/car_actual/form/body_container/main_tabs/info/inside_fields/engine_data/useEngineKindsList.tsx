/* eslint-disable no-tabs */
import * as React from 'react';

import { DefaultSelectOption } from 'components/old/ui/input/ReactSelect/utils';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { actionGetAndSetInStoreEngineKind } from 'redux-main/reducers/modules/some_uniq/engine_kind/actions';
import { EngineKind } from 'redux-main/reducers/modules/some_uniq/engine_kind/@types';
import { FUEL_ENGINE_TYPE_ID } from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/main_tabs/info/inside_fields/engine_data/FieldSelectEngine';

type UseEngineKindsListAns = Array<DefaultSelectOption<number, string, EngineKind>>;
type UseEngineKindsList = (
	is_main: boolean,
  meta: LoadingMeta,
  formKey?: string, // на какой модалке вызывается
) => UseEngineKindsListAns;

const formForDvs = ['carForm'];

const UseEngineKindsList: UseEngineKindsList = (is_main, meta, formKey = '') => {

  const [engineKindsList, setEngineKindsList] = React.useState([]);
  const dispatch = etsUseDispatch();
  React.useEffect(
    () => {
      dispatch(actionGetAndSetInStoreEngineKind({}, meta)).then(
        ({ data }) => {
          setEngineKindsList(data);
        },
      );
    },
    [],
  );

  const engineKindsOptions = React.useMemo(
    () => {
      return  engineKindsList.reduce( // Фильтруем типы двигателя для карточки ТС -- is_main
        (newArr, currVal) => {
          if (formForDvs.includes(formKey) && currVal.id === FUEL_ENGINE_TYPE_ID) {
            currVal.name = 'ДВС';
          }
          if (is_main && currVal.is_main) {
            newArr.push({
              value: currVal.id,
              label: currVal.name,
              rowData: currVal,
            });
          } else if (!is_main) {
            newArr.push({
              value: currVal.id,
              label: currVal.name,
              rowData: currVal,
            });
          }
          return newArr;
        },
        []);
    },
    [engineKindsList, ],
  );

  return engineKindsOptions;
};

export default UseEngineKindsList;
