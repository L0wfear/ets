import * as React from 'react';

import { DefaultSelectListMapper, defaultSelectListMapper } from 'components/old/ui/input/ReactSelect/utils';
import { MeasureUnit } from 'redux-main/reducers/modules/some_uniq/measure_unit/@types';
import { actionGetTechnicalOperationRegistry } from 'redux-main/reducers/modules/some_uniq/technical_operation_registry/actions';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

const useTechnicalOperationOptions = (meta: LoadingMeta) => {
  const [technicalOperationOptions, setTechnicalOperationOptions] = React.useState<DefaultSelectListMapper<MeasureUnit>>([]);
  const dispatch = etsUseDispatch();

  React.useEffect(
    () => {
      dispatch(
        actionGetTechnicalOperationRegistry({}, meta),
      ).then(
        ({ data }) => (
          setTechnicalOperationOptions(
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
    technicalOperationOptions,
  };
};

export default useTechnicalOperationOptions;
