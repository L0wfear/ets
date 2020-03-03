import * as React from 'react';
import { HandleThunkActionCreator } from 'react-redux';
import { ModelElement } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { actionGetModelList } from 'redux-main/reducers/modules/some_uniq/modelList/actions';
import { DefaultSelectOption } from 'components/old/ui/input/ReactSelect/utils';

type useLoadModelOptionsByTitleAns = {
  modelOptions: Array<DefaultSelectOption<ModelElement['title'], ModelElement['title'], ModelElement>>;
};

type useLoadModelOptionsByTitle = (
  loadLoadModelList: HandleThunkActionCreator<typeof actionGetModelList>,
  page: string,
  path: string,
) => useLoadModelOptionsByTitleAns;

export const getModelOptionsByTitle = (data: Array<ModelElement>) => {
  return data.map((rowData) => ({
    value: rowData.title,
    label: rowData.title,
    rowData,
  }));
};

const useLoadModelOptionsByTitle: useLoadModelOptionsByTitle = (loadLoadModelList, page, path) => {
  const [modelOptions, setModelOptions] = React.useState<useLoadModelOptionsByTitleAns['modelOptions']>([]);

  React.useEffect(
    () => {
      loadLoadModelList({}, { page, path }).then(
        ({ data }) => (
          setModelOptions(getModelOptionsByTitle(data))
        ),
      ).catch((error) => {
        console.error(error);
      });
    },
    [],
  );

  return {
    modelOptions,
  };
};

export default useLoadModelOptionsByTitle;
