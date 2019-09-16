import * as React from 'react';

import { DefaultSelectListMapper, defaultSelectListMapper } from 'components/old/ui/input/ReactSelect/utils';
import { actionLoadMeasureUnit } from 'redux-main/reducers/modules/some_uniq/measure_unit/actions';
import { MeasureUnit } from 'redux-main/reducers/modules/some_uniq/measure_unit/@types';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

const useMeasureUnitOptions = (meta: LoadingMeta) => {
  const [measureUnitOptions, setMeasureUnitOptions] = React.useState<DefaultSelectListMapper<MeasureUnit>>([]);
  const dispatch = etsUseDispatch();

  React.useEffect(
    () => {
      dispatch(
        actionLoadMeasureUnit({}, meta),
      ).then(
        ({ data }) => (
          setMeasureUnitOptions(
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
    measureUnitOptions,
  };
};

export default useMeasureUnitOptions;
