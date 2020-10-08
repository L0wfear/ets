import * as React from 'react';
import TemplateRegistry from 'components/new/ui/template/registry/TemplateRegistry';
import ErrorBoundaryRegistry from 'components/new/ui/error_boundary_registry/ErrorBoundaryRegistry';

const Component = React.lazy(() => (
  import(/* webpackChunkName: "tachograph_metrological_verification" */ 'components/new/pages/nsi/autobase/pages/tachograph_metrological_verification/TachographMetrologicalVerificationList')
));

const TachographMetrologicalVerificationLazy = (props) => (
  <ErrorBoundaryRegistry>
    <React.Suspense fallback={<TemplateRegistry />}>
      <Component {...props}/>
    </React.Suspense>
  </ErrorBoundaryRegistry>
);

export default TachographMetrologicalVerificationLazy;
