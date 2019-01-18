import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryRegistry from 'components/new/ui/error_boundary_registry/ErrorBoundaryRegistry';

const Component = React.lazy(() => (
  import(/* webpackChunkName: "danger_zone_list" */ 'components/new/pages/nsi/geoobjects/pages/danger_zone/DangerZoneList')
));

export default (props) => (
  <ErrorBoundaryRegistry>
    <React.Suspense fallback={<LoadingComponent />}>
      <Component {...props}/>
    </React.Suspense>
  </ErrorBoundaryRegistry>
);
