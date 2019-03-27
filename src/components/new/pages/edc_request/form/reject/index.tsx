import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';
import { EdcRequestRejectFormLazyProps } from './@types/EdcRequestReject';

const EdcRequestReject = React.lazy(() =>
  import(/* webpackChunkName: "edc_request_form" */ 'components/new/pages/edc_request/form/reject/EdcRequestReject'),
);

const EdcRequestRejectFormLazy: React.FC<EdcRequestRejectFormLazyProps> = (props) => {
  const page = props.loadingPageName || props.page;
  const path = `${props.path ? `${props.path}-` : ''}-form`;

  return props.showForm ? (
    <ErrorBoundaryForm>
      <React.Suspense fallback={<LoadingComponent />}>
        <EdcRequestReject
          element={props.element}
          edcReques={props.edcReques}
          handleHide={props.onFormHide}
          readOnly={props.readOnly}

          page={page}
          path={path}
        />
      </React.Suspense>
    </ErrorBoundaryForm>
  ) : (
    <DivNone />
  );
};

export default EdcRequestRejectFormLazy;
