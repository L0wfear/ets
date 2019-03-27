import * as React from 'react';
import TemplateDashboard from 'components/new/ui/template/dashboard/TemplateDashboard';
import ErrorBoundaryRegistry from 'components/new/ui/error_boundary_registry/ErrorBoundaryRegistry';

const Component = React.lazy(() => (
  import(/* webpackChunkName: "inspection_autobase" */ 'components/new/pages/inspection/autobase/InspectionAutobaseList')
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
