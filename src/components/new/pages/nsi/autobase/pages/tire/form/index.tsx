import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';

import { PropsTireFormLazy } from 'components/new/pages/nsi/autobase/pages/tire/form/@types/TireForm';
import withFormRegistrySearch from 'components/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

const TireFrom = React.lazy(() => (
  import(/* webpackChunkName: "tire_form" */ 'components/new/pages/nsi/autobase/pages/tire/form/TireForm')
));

const TireFormLazy: React.FC<PropsTireFormLazy> = React.memo(
  (props) => {
    const page = props.registryKey || props.page;
    const path = `${props.path ? `${props.path}-` : ''}battery-brand-form`;

    return (
      props.element
        ? (
          <ErrorBoundaryForm>
            <React.Suspense fallback={<LoadingComponent />}>
              <TireFrom
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

export default withFormRegistrySearch({})(TireFormLazy);
