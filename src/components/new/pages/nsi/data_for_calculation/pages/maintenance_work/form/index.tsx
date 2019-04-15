import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';

import { PropsMaintenanceWorkFormLazy } from 'components/new/pages/nsi/data_for_calculation/pages/maintenance_work/form/@types/MaintenanceWorkForm';
import withFormRegistrySearch from 'components/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { compose } from 'recompose';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';

const MaintenanceWorkFrom = React.lazy(() => (
  import(/* webpackChunkName: "maintenance_work_form" */ 'components/new/pages/nsi/data_for_calculation/pages/maintenance_work/form/MaintenanceWorkForm')
));

const MaintenanceWorkFormLazy: React.FC<PropsMaintenanceWorkFormLazy> = React.memo(
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
              <MaintenanceWorkFrom
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

export default compose<PropsMaintenanceWorkFormLazy, any>(
  withFormRegistrySearch({}),
  withSearch,
)(MaintenanceWorkFormLazy);
