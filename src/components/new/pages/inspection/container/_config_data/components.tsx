import * as React from 'react';
import TemplateDashboard from 'components/new/ui/template/dashboard/TemplateDashboard';
import ErrorBoundaryRegistry from 'components/new/ui/error_boundary_registry/ErrorBoundaryRegistry';

const Component = React.lazy(() => (
  import(/* webpackChunkName: "inspection_container" */ 'components/new/pages/inspection/container/InspectionContainerList')
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
