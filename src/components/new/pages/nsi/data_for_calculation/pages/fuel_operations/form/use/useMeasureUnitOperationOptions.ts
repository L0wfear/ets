import * as React from 'react';

import { DefaultSelectListMapper, defaultSelectListMapper } from 'components/old/ui/input/ReactSelect/utils';
import { actionLoadMeasureUnit } from 'redux-main/reducers/modules/some_uniq/measure_unit/actions';
import { MeasureUnit } from 'redux-main/reducers/modules/some_uniq/measure_unit/@types';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

const useMeasureUnitOperationOptions = (meta: LoadingMeta) => {
  const [measureUnitOperationOptions, setMeasureUnitOperationOptions] = React.useState<DefaultSelectListMapper<MeasureUnit>>([]);
  const dispatch = etsUseDispatch();

  React.useEffect(
    () => {
      dispatch(
        actionLoadMeasureUnit({ type: 'operation' }, meta),
      ).then(
        ({ data }) => (
          setMeasureUnitOperationOptions(
            data.map(defaultSelectListMapper),
          )
        ),
      ).catch((error) => {
        console.error(error); //tslint:disable-line
      });
    },
    [],
  );

  return {
    measureUnitOperationOptions,
  };
};

export default useMeasureUnitOperationOptions;
