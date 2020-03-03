import * as React from 'react';

import { withFormRegistrySearch, WithFormRegistrySearchProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

const CarFrom = React.lazy(() => (
  import(/* webpackChunkName: "car_form" */ 'components/new/pages/nsi/autobase/pages/car_actual/form/CarForm')
));

export default withFormRegistrySearch<WithFormRegistrySearchProps<Partial<Car>>, Car>({
  add_path: 'car',
  cant_create: true,
  no_find_in_arr: true,
  replace_uniqKey_on: 'asuods_id',
})(CarFrom);
