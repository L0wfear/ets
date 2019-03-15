import * as React from 'react';
import TemplateRegistry from 'components/new/ui/template/registry/TemplateRegistry';
import ErrorBoundaryRegistry from 'components/new/ui/error_boundary_registry/ErrorBoundaryRegistry';

const Component = React.lazy(() => (
  import(/* webpackChunkName: "material_consumption_rate" */ 'components/directories/normative/material_consumption_rate/MaterialConsumptionRateList')
));

export default (props) => (
      <ErrorBoundaryRegistry>
        <React.Suspense fallback={<TemplateRegistry />}>
          <Component {...props}/>
        </React.Suspense>
      </ErrorBoundaryRegistry>
);
