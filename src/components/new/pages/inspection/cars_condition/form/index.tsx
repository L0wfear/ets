import * as React from 'react';
import LoadingComponent from 'components/old/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

const InspectionCarsConditionForm = React.lazy(() => (
  import(/* webpackChunkName: "InspectionCarsConditionForm" */ 'components/new/pages/inspection/cars_condition/form/InspectionCarsConditionForm')
));

export default (props) => {
  return (
    <ErrorBoundaryForm>
      <React.Suspense fallback={<LoadingComponent />}>
        <InspectionCarsConditionForm {...props}/>
      </React.Suspense>
    </ErrorBoundaryForm>
  );
};
