import * as React from 'react';
import { HandleThunkActionCreator } from 'react-redux';
import { CarFuncTypes } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { DefaultSelectOption } from 'components/ui/input/ReactSelect/utils';
import { autobaseGetSetCarFuncTypes } from 'redux-main/reducers/modules/autobase/car_func_types/actions';

type UseCarFuncTypesOptionsAns = {
  carFuncTypesOptions: DefaultSelectOption<CarFuncTypes['asuods_id'], CarFuncTypes['short_name'], CarFuncTypes>[],
};

type UseCarFuncTypesOptions = (
  loadCarFuncTypes: HandleThunkActionCreator<typeof autobaseGetSetCarFuncTypes>,
  page: string,
  path: string,
) => UseCarFuncTypesOptionsAns;

const useCarFuncTypesOptions: UseCarFuncTypesOptions = (loadCarFuncTypes, page, path) => {
  const [carFuncTypesOptions, setCarFuncTypesList] = React.useState<DefaultSelectOption<CarFuncTypes['asuods_id'], CarFuncTypes['short_name'], CarFuncTypes>[]>([]);

  React.useEffect(
    () => {
      loadCarFuncTypes({}, { page, path }).then(
        ({ data }) => (
          setCarFuncTypesList(
            data.map((rowData) => ({
              value: rowData.asuods_id,
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
    carFuncTypesOptions,
  };
};

export default useCarFuncTypesOptions;
