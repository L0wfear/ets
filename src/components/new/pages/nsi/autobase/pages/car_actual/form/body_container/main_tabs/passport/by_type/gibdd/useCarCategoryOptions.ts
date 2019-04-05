import * as React from 'react';
import { HandleThunkActionCreator } from 'react-redux';
import { CarCategory } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { defaultSelectListMapper, DefaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';
import { autobaseGetSetCarCategory } from 'redux-main/reducers/modules/autobase/actions_by_type/car_category/actions';

type UseCarCategoryOptionsAns = {
  carCategoryOptions: DefaultSelectListMapper<CarCategory>,
};

type UseCarCategoryOptions = (
  loadCarCategory: HandleThunkActionCreator<typeof autobaseGetSetCarCategory>,
  page: string,
  path: string,
) => UseCarCategoryOptionsAns;

const useCarCategoryOptions: UseCarCategoryOptions = (loadCarCategory, page, path) => {
  const [carCategoryOptions, setCarCategoryList] = React.useState<DefaultSelectListMapper<CarCategory>>([]);

  React.useEffect(
    () => {
      loadCarCategory({}, { page, path }).then(
        ({ payload: { data } }) => (
          setCarCategoryList(
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
    carCategoryOptions,
  };
};

export default useCarCategoryOptions;
