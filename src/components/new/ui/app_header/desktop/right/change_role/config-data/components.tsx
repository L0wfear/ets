import * as React from 'react';
import LoadingComponent from 'components/old/ui/PreloaderMainPage';
import ErrorBoundaryRegistry from 'components/new/ui/error_boundary_registry/ErrorBoundaryRegistry';

const Component = React.lazy(() => (
  import(/* webpackChunkName: "cahnge_company" */ 'components/new/ui/app_header/desktop/right/change_role/CahngeCompany')
));

export default (props) => (
  <ErrorBoundaryRegistry>
    <React.Suspense fallback={<LoadingComponent />}>
      <Component {...props}/>
    </React.Suspense>
  </ErrorBoundaryRegistry>
);
