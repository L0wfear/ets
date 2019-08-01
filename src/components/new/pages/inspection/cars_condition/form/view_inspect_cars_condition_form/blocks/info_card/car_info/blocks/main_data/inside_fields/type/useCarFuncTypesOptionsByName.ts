import * as React from 'react';
import { HandleThunkActionCreator } from 'react-redux';
import { DefaultSelectOption } from 'components/old/ui/input/ReactSelect/utils';
import { CarFuncTypes } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseGetSetCarFuncTypes } from 'redux-main/reducers/modules/autobase/car_func_types/actions';

type UseCarFuncTypesOptionsByNameAns = {
  carFuncTypeOptions: DefaultSelectOption<CarFuncTypes['short_name'], CarFuncTypes['short_name'], CarFuncTypes>[],
};

type UseCarFuncTypesOptionsByName = (
  loadCarFuncTypes: HandleThunkActionCreator<typeof autobaseGetSetCarFuncTypes>,
  page: string,
  path: string,
) => UseCarFuncTypesOptionsByNameAns;

const useCarFuncTypesOptionsByName: UseCarFuncTypesOptionsByName = (loadCarFuncTypes, page, path) => {
  const [carFuncTypeOptions, setCarFuncTypeOptions] = React.useState<UseCarFuncTypesOptionsByNameAns['carFuncTypeOptions']>([]);

  React.useEffect(
    () => {
      loadCarFuncTypes({}, { page, path }).then(
        ({ data }) => (
          setCarFuncTypeOptions(
            (data as CarFuncTypes[]).map((rowData) => ({
              value: rowData.short_name,
              label: rowData.short_name,
              rowData,
            })),
          )
        ),
      ).catch((error) => {
        console.error(error); //tslint:disable-line
      });
    },
    [],
  );

  return {
    carFuncTypeOptions,
  };
};

export default useCarFuncTypesOptionsByName;
