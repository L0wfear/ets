import * as React from 'react';
import ErrorBoundaryRegistry from 'components/new/ui/error_boundary_registry/ErrorBoundaryRegistry';
import TemplateRegistry from 'components/new/ui/template/registry/TemplateRegistry';

const Component = React.lazy(() => (
  import(/* webpackChunkName: "insurance_policy" */ 'components/directories/autobase/insurance_policy/InsurancePolicyList')
));

export default (props) => (
  <ErrorBoundaryRegistry>
    <React.Suspense fallback={<TemplateRegistry />}>
      <Component {...props}/>
    </React.Suspense>
  </ErrorBoundaryRegistry>
);
