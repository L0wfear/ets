import * as React from 'react';
import TemplateMonitor from 'components/new/ui/template/monitor/TemplateMonitor';
import ErrorBoundaryRegistry from 'components/new/ui/error_boundary_registry/ErrorBoundaryRegistry';

const Component = React.lazy(() => (
  import(/* webpackChunkName: "monitor" */ 'components/monitor/MonitorPage')
));

export default (props) => (
  <ErrorBoundaryRegistry>
    <React.Suspense fallback={<TemplateMonitor />}>
      <Component {...props}/>
    </React.Suspense>
  </ErrorBoundaryRegistry>
);
