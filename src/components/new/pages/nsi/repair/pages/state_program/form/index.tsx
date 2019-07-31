import * as React from 'react';
import LoadingComponent from 'components/old/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';

import { PropsStateProgramFormLazy } from 'components/new/pages/nsi/repair/pages/state_program/form/@types/StateProgramForm';
import withFormRegistrySearch from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { compose } from 'recompose';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';

const StateProgramFrom = React.lazy(() => (
  import(/* webpackChunkName: "state_program_form" */ 'components/new/pages/nsi/repair/pages/state_program/form/StateProgramForm')
));

const StateProgramFormLazy: React.FC<PropsStateProgramFormLazy> = React.memo(
  (props) => {
    const page = props.registryKey || props.page;
    const path = `${props.path ? `${props.path}-` : ''}state_program-form`;
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
      element
        ? (
          <ErrorBoundaryForm>
            <React.Suspense fallback={<LoadingComponent />}>
              <StateProgramFrom
                element={element}
                handleHide={props.onFormHide}

                page={page}
                path={path}
              />
            </React.Suspense>
          </ErrorBoundaryForm>
        )
        : (
          <DivNone />
        )
    );
  },
);

export default compose<PropsStateProgramFormLazy, any>(
  withFormRegistrySearch({}),
  withSearch,
)(StateProgramFormLazy);
