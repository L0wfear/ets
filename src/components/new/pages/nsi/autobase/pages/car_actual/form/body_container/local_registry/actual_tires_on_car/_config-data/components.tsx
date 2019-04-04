import * as React from 'react';
import TemplateRegistry from 'components/new/ui/template/registry/TemplateRegistry';
import ErrorBoundaryRegistry from 'components/new/ui/error_boundary_registry/ErrorBoundaryRegistry';

const Component = React.lazy(() => (
  import(/* webpackChunkName: "actual_tires_on_car" */ 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/local_registry/actual_tires_on_car/ActualTiresOnCarList')
));

const TireLazy = (props) => (
  <ErrorBoundaryRegistry>
    <React.Suspense fallback={<TemplateRegistry />}>
      <Component {...props}/>
    </React.Suspense>
  </ErrorBoundaryRegistry>
);

export default TireLazy;
