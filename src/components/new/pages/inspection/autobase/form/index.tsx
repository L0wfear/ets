import * as React from 'react';
import LoadingComponent from 'components/old/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

const InspectionAutobaseForm = React.lazy(() => (
  import(/* webpackChunkName: "InspectionAutobaseForm" */ 'components/new/pages/inspection/autobase/form/InspectionAutobaseForm')
));

export default (props) => {
  return (
    <ErrorBoundaryForm>
      <React.Suspense fallback={<LoadingComponent />}>
        <InspectionAutobaseForm {...props}/>
      </React.Suspense>
    </ErrorBoundaryForm>
  );
};
