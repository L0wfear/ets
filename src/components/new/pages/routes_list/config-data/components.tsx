import * as React from 'react';
import TemplateRoute from 'components/new/ui/template/route/TemplateRoute';
import ErrorBoundaryRegistry from 'components/new/ui/error_boundary_registry/ErrorBoundaryRegistry';

const Component = React.lazy(() => (
  import(/* webpackChunkName: "routes_list" */ 'components/new/pages/routes_list/RoutesList')
));

export default (props) => (
  <ErrorBoundaryRegistry>
    <React.Suspense fallback={<TemplateRoute />}>
      <Component {...props}/>
    </React.Suspense>
  </ErrorBoundaryRegistry>
);
