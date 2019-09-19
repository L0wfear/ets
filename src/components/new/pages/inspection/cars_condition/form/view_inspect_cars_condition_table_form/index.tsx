import * as React from 'react';
import LoadingComponent from 'components/old/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

const WithInspectFormWrapRegistryLazy = React.lazy(() => (
  import(/* webpackChunkName: "ViewInspectCarsConditionTableForm" */ 'components/new/pages/inspection/common_components/form_wrap_registry/withFormWrapRegistry')
));

export default (props) => {
  return (
    <ErrorBoundaryForm>
      <React.Suspense fallback={<LoadingComponent />}>
        <WithInspectFormWrapRegistryLazy {...props} />
      </React.Suspense>
    </ErrorBoundaryForm>
  );
};
