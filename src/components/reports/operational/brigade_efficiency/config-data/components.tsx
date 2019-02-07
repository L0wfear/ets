import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryRegistry from 'components/new/ui/error_boundary_registry/ErrorBoundaryRegistry';

const Component = React.lazy(() => (
  import(/* webpackChunkName: "brigade_efficiency" */ 'components/reports/operational/brigade_efficiency/report')
));

export default (props) => (
      <ErrorBoundaryRegistry>
        <React.Suspense fallback={<LoadingComponent />}>
          <Component {...props}/>
        </React.Suspense>
      </ErrorBoundaryRegistry>
);
