import * as React from 'react';
import LoadingComponent from 'components/old/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';

import { PropsFuelOperationsFormLazy } from 'components/new/pages/nsi/data_for_calculation/pages/fuel_operations/form/@types/FuelOperationsForm';
import withFormRegistrySearch from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

const FuelOperationFrom = React.lazy(() => (
  import(/* webpackChunkName: "fuel_operations_form" */ 'components/new/pages/nsi/data_for_calculation/pages/fuel_operations/form/FuelOperationsForm')
));

const FuelOperationsFormLazy: React.FC<PropsFuelOperationsFormLazy> = React.memo(
  (props) => {
    const page = props.registryKey || props.page;
    const path = `${props.path ? `${props.path}-` : ''}spare-part-form`;

    return (
      props.element
        ? (
          <ErrorBoundaryForm>
            <React.Suspense fallback={<LoadingComponent />}>
              <FuelOperationFrom
                element={props.element}
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

export default withFormRegistrySearch({})(FuelOperationsFormLazy);
