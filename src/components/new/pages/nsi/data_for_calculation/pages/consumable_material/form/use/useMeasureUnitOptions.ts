import * as React from 'react';
import { HandleThunkActionCreator } from 'react-redux';
import { DefaultSelectListMapper, defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';
import { actionLoadMeasureUnit } from 'redux-main/reducers/modules/some_uniq/measure_unit/actions';
import { MeasureUnit } from 'redux-main/reducers/modules/some_uniq/measure_unit/@types';

type useMeasureUnitOptionsAns = {
  measureUnitOptions: DefaultSelectListMapper<MeasureUnit>,
};

type useMeasureUnitOptions = (
  loadMeasureUnit: HandleThunkActionCreator<typeof actionLoadMeasureUnit>,
  page: string,
  path: string,
) => useMeasureUnitOptionsAns;

const useMeasureUnitOptions: useMeasureUnitOptions = (loadMeasureUnit, page, path) => {
  const [measureUnitOptions, setMeasureUnitOptions] = React.useState<DefaultSelectListMapper<MeasureUnit>>([]);

  React.useEffect(
    () => {
      loadMeasureUnit({}, { page, path }).then(
        (data) => (
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
