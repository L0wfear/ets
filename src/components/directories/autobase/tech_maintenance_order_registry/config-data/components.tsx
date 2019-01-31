import * as React from 'react';
import ErrorBoundaryRegistry from 'components/new/ui/error_boundary_registry/ErrorBoundaryRegistry';
import TemplateRegistry from 'components/new/ui/template/registry/TemplateRegistry';

const Component = React.lazy(() => (
  import(/* webpackChunkName: "tech_maintenance_order_registry" */ 'components/directories/autobase/tech_maintenance_order_registry/TechMaintOrderList')
));

export default (props) => (
  <ErrorBoundaryRegistry>
    <React.Suspense fallback={<TemplateRegistry />}>
      <Component {...props}/>
    </React.Suspense>
  </ErrorBoundaryRegistry>
);
