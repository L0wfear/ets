import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

const InspectionPgmBaseForm = React.lazy(() => (
  import(/* webpackChunkName: "InspectionPgmBaseForm" */ 'components/new/pages/inspection/pgm_base/form/InspectionPgmBaseForm')
));

export default (props) => {
  return (
    <ErrorBoundaryForm>
      <React.Suspense fallback={<LoadingComponent />}>
        <InspectionPgmBaseForm {...props}/>
      </React.Suspense>
    </ErrorBoundaryForm>
  );
};
