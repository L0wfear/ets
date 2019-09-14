import * as React from 'react';

import { withFormRegistrySearchNew, WithFormRegistrySearchProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearchNew';
import { CarFuncTypes } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

const CarFuncTypesFrom = React.lazy(() => (
  import(/* webpackChunkName: "car_func_types_form" */ 'components/new/pages/nsi/autobase/pages/car-func-types/CarFuncTypesForm/CarFuncTypesForm')
));

export default withFormRegistrySearchNew<WithFormRegistrySearchProps<CarFuncTypes>, CarFuncTypes>({
  add_path: 'car_func_types',
})(CarFuncTypesFrom);
