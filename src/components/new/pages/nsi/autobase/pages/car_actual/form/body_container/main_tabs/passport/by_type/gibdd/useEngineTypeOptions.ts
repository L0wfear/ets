import * as React from 'react';
import { HandleThunkActionCreator } from 'react-redux';
import { EngineType } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { defaultSelectListMapper, DefaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';
import { autobaseGetSetEngineType } from 'redux-main/reducers/modules/autobase/actions_by_type/engine_type/actions';

type UseEngineTypeOptionsAns = {
  engineTypeOptions: DefaultSelectListMapper<EngineType>,
};

type UseEngineTypeOptions = (
  loadEngineType: HandleThunkActionCreator<typeof autobaseGetSetEngineType>,
  page: string,
  path: string,
) => UseEngineTypeOptionsAns;

const useEngineTypeOptions: UseEngineTypeOptions = (loadEngineType, page, path) => {
  const [engineTypeOptions, setEngineTypeList] = React.useState<DefaultSelectListMapper<EngineType>>([]);

  React.useEffect(
    () => {
      loadEngineType({}, { page, path }).then(
        ({ payload: { data } }) => (
          setEngineTypeList(
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
    engineTypeOptions,
  };
};

export default useEngineTypeOptions;
