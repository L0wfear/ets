import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';

import { PropsEfficiencyFormLazy } from 'components/new/pages/nsi/data_for_calculation/pages/efficiency/form/@types/EfficiencyForm';
import withFormRegistrySearch from 'components/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { compose } from 'recompose';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';

const EfficiencyFrom = React.lazy(() => (
  import(/* webpackChunkName: "efficiency_form" */ 'components/new/pages/nsi/data_for_calculation/pages/efficiency/form/EfficiencyForm')
));

const EfficiencyFormLazy: React.FC<PropsEfficiencyFormLazy> = React.memo(
  (props) => {
    const page = props.registryKey || props.page;
    const path = `${props.path ? `${props.path}-` : ''}cleaning-rate-form`;
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
              <EfficiencyFrom
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

export default compose<PropsEfficiencyFormLazy, any>(
  withFormRegistrySearch({}),
  withSearch,
)(EfficiencyFormLazy);
