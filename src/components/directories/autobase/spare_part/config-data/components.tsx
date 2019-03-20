import * as React from 'react';
import ErrorBoundaryRegistry from 'components/new/ui/error_boundary_registry/ErrorBoundaryRegistry';
import TemplateRegistry from 'components/new/ui/template/registry/TemplateRegistry';

const Component = React.lazy(() => (
  import(/* webpackChunkName: "spare_part" */ 'components/directories/autobase/spare_part/SparePartList')
));

export default (props) => (
  <ErrorBoundaryRegistry>
    <React.Suspense fallback={<TemplateRegistry />}>
      <Component {...props}/>
    </React.Suspense>
  </ErrorBoundaryRegistry>
);
