import * as React from 'react';
import TemplateDashboard from 'components/new/ui/template/dashboard/TemplateDashboard';
import ErrorBoundaryRegistry from 'components/new/ui/error_boundary_registry/ErrorBoundaryRegistry';

const Component = React.lazy(() => (
  import(/* webpackChunkName: "inspection_cars_condition" */ 'components/new/pages/inspection/cars_condition/InspectionCarsConditionList')
));

export default (props) => {
  return (
    <ErrorBoundaryRegistry>
      <React.Suspense fallback={<TemplateDashboard />}>
        <Component {...props}/>
      </React.Suspense>
    </ErrorBoundaryRegistry>
  );
};
