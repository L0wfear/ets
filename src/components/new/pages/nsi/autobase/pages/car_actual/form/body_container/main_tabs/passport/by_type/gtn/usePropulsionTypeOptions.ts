import * as React from 'react';
import { HandleThunkActionCreator } from 'react-redux';
import { autobaseGetSetPropulsionType } from 'redux-main/reducers/modules/autobase/actions_by_type/propulsion_type/actions';
import { PropulsionType } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { defaultSelectListMapper, DefaultSelectListMapper } from 'components/old/ui/input/ReactSelect/utils';

type UsePropulsionTypeOptionsAns = {
  propulsionTypeOptions: DefaultSelectListMapper<PropulsionType>,
};

type UsePropulsionTypeOptions = (
  loadPropulsionType: HandleThunkActionCreator<typeof autobaseGetSetPropulsionType>,
  page: string,
  path: string,
) => UsePropulsionTypeOptionsAns;

const usePropulsionTypeOptions: UsePropulsionTypeOptions = (loadPropulsionType, page, path) => {
  const [propulsionTypeOptions, setPropulsionTypeList] = React.useState<DefaultSelectListMapper<PropulsionType>>([]);

  React.useEffect(
    () => {
      loadPropulsionType({}, { page, path }).then(
        ({ payload: { data } }) => (
          setPropulsionTypeList(
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
    propulsionTypeOptions,
  };
};

export default usePropulsionTypeOptions;
