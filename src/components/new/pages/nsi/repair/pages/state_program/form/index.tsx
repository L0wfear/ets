import * as React from 'react';

import { withFormRegistrySearch, WithFormRegistrySearchProps, WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { StateProgram } from 'redux-main/reducers/modules/repair/state_program/@types/stateProgram';

const StateProgramFrom = React.lazy(() => (
  import(/* webpackChunkName: "state_program_form" */ 'components/new/pages/nsi/repair/pages/state_program/form/StateProgramForm')
));

const StateProgramFormLazy: React.FC<WithFormRegistrySearchAddProps<StateProgram>> = React.memo(
  (props) => {
    const type = props.match.params.selected_odh_dt_value;

    const element = React.useMemo(
      () => {
        if (props.element) {
          if (!props.element.id) {
            return {
              ...props.element,
              type,
            };
          }
        }

        return props.element;
      },
      [props.element, type],
    );

    return (
      <StateProgramFrom
        {...props}
        element={element}
      />
    );
  },
);

export default withFormRegistrySearch<WithFormRegistrySearchProps<StateProgram>, StateProgram>({
  add_path: 'state_program',
})(StateProgramFormLazy);
