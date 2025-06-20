import * as React from 'react';
import TemplateRegistry from 'components/new/ui/template/registry/TemplateRegistry';
import ErrorBoundaryRegistry from 'components/new/ui/error_boundary_registry/ErrorBoundaryRegistry';

const Component = React.lazy(() => (
  import(/* webpackChunkName: "tech_maintenance" */ 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/local_registry/tech_maintenance/TechMintenanceList')
));

const TechMaintenanceLazy = (props) => (
  <ErrorBoundaryRegistry>
    <React.Suspense fallback={<TemplateRegistry />}>
      <Component {...props}/>
    </React.Suspense>
  </ErrorBoundaryRegistry>
);

export default TechMaintenanceLazy;
