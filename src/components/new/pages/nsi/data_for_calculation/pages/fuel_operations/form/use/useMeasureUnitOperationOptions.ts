import * as React from 'react';
import { HandleThunkActionCreator } from 'react-redux';
import { DefaultSelectListMapper, defaultSelectListMapper } from 'components/old/ui/input/ReactSelect/utils';
import { actionLoadMeasureUnit } from 'redux-main/reducers/modules/some_uniq/measure_unit/actions';
import { MeasureUnit } from 'redux-main/reducers/modules/some_uniq/measure_unit/@types';

type UseMeasureUnitOperationOptionsAns = {
  measureUnitOperationOptions: DefaultSelectListMapper<MeasureUnit>,
};

type UseMeasureUnitOperationOptions = (
  loadMeasureUnitOperation: HandleThunkActionCreator<typeof actionLoadMeasureUnit>,
  page: string,
  path: string,
) => UseMeasureUnitOperationOptionsAns;

const useMeasureUnitOperationOptions: UseMeasureUnitOperationOptions = (loadMeasureUnitOperation, page, path) => {
  const [measureUnitOperationOptions, setMeasureUnitOperationOptions] = React.useState<DefaultSelectListMapper<MeasureUnit>>([]);

  React.useEffect(
    () => {
      loadMeasureUnitOperation({ type: 'operation' }, { page, path }).then(
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
