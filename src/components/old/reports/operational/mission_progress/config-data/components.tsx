import * as React from 'react';
import TemplateRegistry from 'components/new/ui/template/registry/TemplateRegistry';
import ErrorBoundaryRegistry from 'components/new/ui/error_boundary_registry/ErrorBoundaryRegistry';

const Component = React.lazy(() => (
  import(/* webpackChunkName: "mission_progress" */ 'components/old/reports/operational/mission_progress/report')
));

export default (props) => (
      <ErrorBoundaryRegistry>
        <React.Suspense fallback={<TemplateRegistry />}>
          <Component {...props}/>
        </React.Suspense>
      </ErrorBoundaryRegistry>
);
