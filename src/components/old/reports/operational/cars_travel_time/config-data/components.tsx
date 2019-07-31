import * as React from 'react';
import LoadingComponent from 'components/old/ui/PreloaderMainPage';
import ErrorBoundaryRegistry from 'components/new/ui/error_boundary_registry/ErrorBoundaryRegistry';

// const Component = React.lazy(() =>
//   import(/* webpackChunkName: "cars_travel_time" */ 'components/old/reports/operational/cars_travel_time/report'),
// );

const Component = React.lazy(() =>
  import(/* webpackChunkName: "cars_travel_time" */ 'components/old/reports/operational/cars_travel_time/ReportContainerWithForm'),
);

export default (props) => (
  <ErrorBoundaryRegistry>
    <React.Suspense fallback={<LoadingComponent />}>
      <Component {...props} />
    </React.Suspense>
  </ErrorBoundaryRegistry>
);
