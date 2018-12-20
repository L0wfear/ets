import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryRegistry from 'components/error_boundary_registry/ErrorBoundaryRegistry';

const Component = React.lazy(() => (
  import(/* webpackChunkName: "maintenance_rate" */ 'components/directories/normative/maintenance_rate/MaintenanceRateDirectory')
));

export default [
  {
    component: (props) => (
      <ErrorBoundaryRegistry>
        <React.Suspense fallback={<LoadingComponent />}>
          <Component {...props}/>
        </React.Suspense>
      </ErrorBoundaryRegistry>
    ),
  },
];
