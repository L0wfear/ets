import * as React from 'react';

import { withFormRegistrySearch, WithFormRegistrySearchProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { CarFuncTypes } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

const CarFuncTypesFrom = React.lazy(() => (
  import(/* webpackChunkName: "car_func_types_form" */ 'components/new/pages/nsi/autobase/pages/car-func-types/CarFuncTypesForm/CarFuncTypesForm')
));

export default withFormRegistrySearch<WithFormRegistrySearchProps<CarFuncTypes>, CarFuncTypes>({
  add_path: 'car_func_types',
})(CarFuncTypesFrom);
