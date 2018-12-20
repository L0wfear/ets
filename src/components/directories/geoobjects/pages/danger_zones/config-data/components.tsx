import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryRegistry from 'components/error_boundary_registry/ErrorBoundaryRegistry';

const Component = React.lazy(() => (
  import(/* webpackChunkName: "danger_zones" */ 'components/directories/geoobjects/pages/danger_zones/DangerZonesDirectory')
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
