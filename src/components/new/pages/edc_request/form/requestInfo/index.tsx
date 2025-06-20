import * as React from 'react';
import LoadingComponent from 'components/old/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { EdcRequest } from 'redux-main/reducers/modules/edc_request/@types';

const RequestInfoForm = React.lazy(() =>
  import(/* webpackChunkName: "request_history" */ 'components/new/pages/edc_request/form/requestInfo/requestInfoForm'),
);

type RequestInfoFormLazyProps = {
  registryKey: string;
  element: EdcRequest;
  onFormHide: (isSubmitted: boolean | any, result?: any) => any;

  page: string;
  path: string;
};

const RequestInfoFormLazy: React.FC<RequestInfoFormLazyProps> = React.memo(
  (props) => {
    return (
      props.element && (
        <ErrorBoundaryForm>
          <React.Suspense fallback={<LoadingComponent />}>
            <RequestInfoForm
              element={props.element}
              handleHide={props.onFormHide}

              page={props.page}
              path={props.path}
            />
          </React.Suspense>
        </ErrorBoundaryForm>
      )
    );
  },
);

export default RequestInfoFormLazy;
