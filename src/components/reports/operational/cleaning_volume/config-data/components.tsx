import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryRegistry from 'components/error_boundary_registry/ErrorBoundaryRegistry';

const Component = React.lazy(() => (
  import(/* webpackChunkName: "car_condition" */'components/reports/operational/cleaning_volume/report')
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
