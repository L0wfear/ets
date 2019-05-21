import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import withFormRegistrySearch from 'components/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { EdcRequest } from 'redux-main/reducers/modules/edc_request/@types';

const RequestForm = React.lazy(() =>
  import(/* webpackChunkName: "request_history" */ 'components/new/pages/edc_request/form/requestInfo/requestInfoForm'),
);

type RequestFormLazyProps = {
  registryKey: string;
  element: EdcRequest;
  onFormHide: (isSubmitted: boolean | any, result?: any) => any;
};

const RequestFormLazy: React.FC<RequestFormLazyProps> = React.memo(
  (props) => {
    return (
      props.element && (
        <ErrorBoundaryForm>
          <React.Suspense fallback={<LoadingComponent />}>
            <RequestForm
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
)(RequestFormLazy);
