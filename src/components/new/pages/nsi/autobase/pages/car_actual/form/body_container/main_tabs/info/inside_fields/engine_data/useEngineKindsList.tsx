/* eslint-disable no-tabs */
import * as React from 'react';

import { DefaultSelectOption } from 'components/old/ui/input/ReactSelect/utils';
import { CarWrap } from 'components/new/pages/nsi/autobase/pages/car_actual/form/@types/CarForm';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { actionGetAndSetInStoreEngineKind } from 'redux-main/reducers/modules/some_uniq/engine_kind/actions';
import { EngineKind } from 'redux-main/reducers/modules/some_uniq/engine_kind/@types';

type UseEngineKindsListAns = Array<DefaultSelectOption<number, string, EngineKind>>;
type UseEngineKindsList = (
	car_id: CarWrap['asuods_id'],
	is_main: boolean,
  meta: LoadingMeta,
) => UseEngineKindsListAns;

const UseEngineKindsList: UseEngineKindsList = (car_id, is_main, meta) => {

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
    [engineKindsList, car_id, ],
  );

  return engineKindsOptions;
};

export default UseEngineKindsList;
