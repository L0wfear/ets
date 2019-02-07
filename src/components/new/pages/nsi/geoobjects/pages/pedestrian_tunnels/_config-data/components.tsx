import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryRegistry from 'components/new/ui/error_boundary_registry/ErrorBoundaryRegistry';

const Component = React.lazy(() => (
  import(/* webpackChunkName: "pedestrian_tunnels_list" */ 'components/new/pages/nsi/geoobjects/pages/pedestrian_tunnels/PedestrianTunnelsList')
));

export default (props) => (
  <ErrorBoundaryRegistry>
    <React.Suspense fallback={<LoadingComponent />}>
      <Component {...props}/>
    </React.Suspense>
  </ErrorBoundaryRegistry>
);
