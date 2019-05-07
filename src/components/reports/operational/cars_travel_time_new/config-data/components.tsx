import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryRegistry from 'components/new/ui/error_boundary_registry/ErrorBoundaryRegistry';

// const Component = React.lazy(() =>
//   import(/* webpackChunkName: "cars_travel_time_new" */ 'components/reports/operational/cars_travel_time_new/report'),
// );

const Component = React.lazy(() =>
  import(/* webpackChunkName: "cars_travel_time_new" */ 'components/reports/operational/cars_travel_time_new/ReportContainerWithForm'),
);

export default (props) => (
  <ErrorBoundaryRegistry>
    <React.Suspense fallback={<LoadingComponent />}>
      <Component {...props} />
    </React.Suspense>
  </ErrorBoundaryRegistry>
);
