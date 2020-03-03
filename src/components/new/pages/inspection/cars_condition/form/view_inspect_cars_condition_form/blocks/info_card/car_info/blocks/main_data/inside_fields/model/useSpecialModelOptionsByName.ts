import * as React from 'react';
import { HandleThunkActionCreator } from 'react-redux';
import { DefaultSelectOption } from 'components/old/ui/input/ReactSelect/utils';
import { SpecialModel } from 'redux-main/reducers/modules/some_uniq/special_model/@types';
import { actionLoadSpecialModel } from 'redux-main/reducers/modules/some_uniq/special_model/actions';

type UseSpecialModelOptionsByNameAns = {
  specialModelOptions: Array<DefaultSelectOption<SpecialModel['name'], SpecialModel['name'], SpecialModel>>;
};

type UseSpecialModelOptionsByName = (
  loadLoadSpecialModelList: HandleThunkActionCreator<typeof actionLoadSpecialModel>,
  page: string,
  path: string,
) => UseSpecialModelOptionsByNameAns;

export const getSpecialModelOptions = (data: Array<SpecialModel>) => {
  return data.map((rowData) => ({
    value: rowData.name,
    label: rowData.name,
    rowData,
  }));
};

const useSpecialModelOptionsByName: UseSpecialModelOptionsByName = (loadLoadSpecialModelList, page, path) => {
  const [specialModelOptions, setSpecialModelOptions] = React.useState<UseSpecialModelOptionsByNameAns['specialModelOptions']>([]);

  React.useEffect(
    () => {
      loadLoadSpecialModelList({}, { page, path }).then(
        ({ data }) => (
          setSpecialModelOptions(
            getSpecialModelOptions(data),
          )
        ),
      ).catch((error) => {
        console.error(error);
      });
    },
    [],
  );

  return {
    specialModelOptions,
  };
};

export default useSpecialModelOptionsByName;
