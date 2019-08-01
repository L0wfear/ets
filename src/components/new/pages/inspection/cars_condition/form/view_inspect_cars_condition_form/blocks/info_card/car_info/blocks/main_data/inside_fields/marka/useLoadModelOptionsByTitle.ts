import * as React from 'react';
import { HandleThunkActionCreator } from 'react-redux';
import { ModelElement } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { actionGetModelList } from 'redux-main/reducers/modules/some_uniq/modelList/actions';
import { DefaultSelectOption } from 'components/old/ui/input/ReactSelect/utils';

type useLoadModelOptionsByTitleAns = {
  modelOptions: DefaultSelectOption<ModelElement['title'], ModelElement['title'], ModelElement>[],
};

type useLoadModelOptionsByTitle = (
  loadLoadModelList: HandleThunkActionCreator<typeof actionGetModelList>,
  page: string,
  path: string,
) => useLoadModelOptionsByTitleAns;

const useLoadModelOptionsByTitle: useLoadModelOptionsByTitle = (loadLoadModelList, page, path) => {
  const [modelOptions, setModelOptions] = React.useState<useLoadModelOptionsByTitleAns['modelOptions']>([]);

  React.useEffect(
    () => {
      loadLoadModelList({}, { page, path }).then(
        ({ payload: { data } }) => (
          setModelOptions(
            (data as ModelElement[]).map((rowData) => ({
              value: rowData.title,
              label: rowData.title,
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
    modelOptions,
  };
};

export default useLoadModelOptionsByTitle;
