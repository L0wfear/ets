import * as React from 'react';
import TemplateRegistry from 'components/new/ui/template/registry/TemplateRegistry';
import ErrorBoundaryRegistry from 'components/new/ui/error_boundary_registry/ErrorBoundaryRegistry';

const Component = React.lazy(() => (
  import(/* webpackChunkName: "duty_mission_list" */ 'components/new/pages/missions/duty_mission/DutyMissionList')
));

export default (props) => (
  <ErrorBoundaryRegistry>
    <React.Suspense fallback={<TemplateRegistry />}>
      <Component {...props}/>
    </React.Suspense>
  </ErrorBoundaryRegistry>
);
