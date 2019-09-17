import * as React from 'react';

import { WithFormRegistrySearchProps, withFormRegistrySearch } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { CleaningAreaRate } from 'redux-main/reducers/modules/cleaning_area_rate/@types/cleaningAreaRate';

const CleaningAreaRateFormContextReactLazy = React.lazy(() => (
  import(/* webpackChunkName: "cleaning_area_rate_form" */ 'components/new/pages/nsi/data_for_calculation/pages/cleaning_area_rate/form/CleaningAreaRateContext')
));

export default withFormRegistrySearch<WithFormRegistrySearchProps<CleaningAreaRate>, CleaningAreaRate>({
  add_path: 'cleaning_area_rate',
})(CleaningAreaRateFormContextReactLazy);
