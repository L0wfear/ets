import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryRegistry from 'components/error_boundary_registry/ErrorBoundaryRegistry';

const Component = React.lazy(() => (
  import(/* webpackChunkName: "msp" */ 'components/directories/geoobjects/pages/msp/MSPDirectory')
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
