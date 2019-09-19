import * as React from 'react';

import { withFormRegistrySearch, WithFormRegistrySearchProps, WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { CleaningRate } from 'redux-main/reducers/modules/cleaning_rate/@types/cleaningRate';

const CleaningRateFromContextReactLazy = React.lazy(() => (
  import(/* webpackChunkName: "cleaning_rate_form" */ 'components/new/pages/nsi/data_for_calculation/pages/cleaning_rate/form/CleaningRateFormContext')
));

const CleaningRateFormLazy: React.FC<WithFormRegistrySearchAddProps<CleaningRate>> = React.memo(
  (props) => {
    const type = props.match.params.selected_odh_dt_value;

    const element = React.useMemo(
      () => {
        return {
          ...props.element,
          type,
        };
      },
      [props.element, type],
    );

    return (
      <CleaningRateFromContextReactLazy
        {...props}
        element={element}
      />
    );
  },
);

export default withFormRegistrySearch<WithFormRegistrySearchProps<CleaningRate>, CleaningRate>({
  add_path: 'cleaning-rate',
})(CleaningRateFormLazy);
