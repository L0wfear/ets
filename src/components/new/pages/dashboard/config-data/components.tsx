import * as React from 'react';
import TemplateDashboard from 'components/new/ui/template/dashboard/TemplateDashboard';
import ErrorBoundaryRegistry from 'components/new/ui/error_boundary_registry/ErrorBoundaryRegistry';

const Component = React.lazy(() => (
  import(/* webpackChunkName: "dashboard" */ 'components/new/pages/dashboard/DashboardPage')
));

export default (props) => (
  <ErrorBoundaryRegistry>
    <React.Suspense fallback={<TemplateDashboard />}>
      <Component {...props}/>
    </React.Suspense>
  </ErrorBoundaryRegistry>
);
