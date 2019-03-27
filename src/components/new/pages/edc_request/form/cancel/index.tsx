import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';
import { EdcRequestCancelFormLazyProps } from './@types/EdcRequestCancel';

const EdcRequestCancel = React.lazy(() =>
  import(/* webpackChunkName: "edc_request_form" */ 'components/new/pages/edc_request/form/cancel/EdcRequestCancel'),
);

const EdcRequestCancelFormLazy: React.FC<EdcRequestCancelFormLazyProps> = (props) => {
  const page = props.loadingPageName || props.page;
  const path = `${props.path ? `${props.path}-` : ''}-form`;

  return props.showForm ? (
    <ErrorBoundaryForm>
      <React.Suspense fallback={<LoadingComponent />}>
        <EdcRequestCancel
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

export default EdcRequestCancelFormLazy;
