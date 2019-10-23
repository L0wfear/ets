import * as React from 'react';
import LoadingComponent from 'components/old/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';
import { PropsInspectContainerFormLazy } from './@types/InspectionContainerList';

const ContainerForm = React.lazy(() =>
  import(/* webpackChunkName: "inspection_container_list_form" */ './InspectionContainerList'),
);

const ContainerFormLazy: React.FC<PropsInspectContainerFormLazy> = (props) => {
  const page = props.loadingPageName || props.page;
  const path = `${props.path ? `${props.path}-` : ''}-form`;

  return props.element ? (
    <ErrorBoundaryForm>
      <React.Suspense fallback={<LoadingComponent />}>
        <ContainerForm
          element={props.element}
          handleHide={props.onFormHide}
          readOnly={props.readOnly}
          isPermittedChangeListParams={props.isPermittedChangeListParams}

          page={page}
          path={path}
        />
      </React.Suspense>
    </ErrorBoundaryForm>
  ) : (
    <DivNone />
  );
};

export default ContainerFormLazy;
