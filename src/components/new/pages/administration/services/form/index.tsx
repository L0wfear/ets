import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import withFormRegistrySearch from 'components/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { Service } from 'redux-main/reducers/modules/services/@types/services';

const ServicesForm = React.lazy(() =>
  import(/* webpackChunkName: "service_history" */ 'components/new/pages/administration/services/form/ServicesForm'),
);

type ServicesFormLazyProps = {
  registryKey: string;
  element: Service;
  onFormHide: (isSubmitted: boolean | any, result?: any) => any;
};

const ServicesFormLazy: React.FC<ServicesFormLazyProps> = React.memo(
  (props) => {
    return (
      props.element && (
        <ErrorBoundaryForm>
          <React.Suspense fallback={<LoadingComponent />}>
            <ServicesForm
              element={props.element}
              handleHide={props.onFormHide}

              page={props.registryKey}
              path={`${props.registryKey}_services`}
            />
          </React.Suspense>
        </ErrorBoundaryForm>
      )
    );
  },
);

export default withFormRegistrySearch(
  {
    cantCreate: true,
    hideWithClose: ['date_from', 'date_to', 'service_history_registry_page'],
  },
)(ServicesFormLazy);
