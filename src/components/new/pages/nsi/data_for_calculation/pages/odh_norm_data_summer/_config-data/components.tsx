import * as React from 'react';
import TemplateRegistry from 'components/new/ui/template/registry/TemplateRegistry';
import ErrorBoundaryRegistry from 'components/new/ui/error_boundary_registry/ErrorBoundaryRegistry';

const Component = React.lazy(() => (
  import(/* webpackChunkName: "odh_norm_data_summer" */ 'components/new/pages/nsi/data_for_calculation/pages/odh_norm_data_summer/OdhNormDataSummerList')
));

const OdhNormDataSummerLazy = (props) => (
  <ErrorBoundaryRegistry>
    <React.Suspense fallback={<TemplateRegistry />}>
      <Component {...props}/>
    </React.Suspense>
  </ErrorBoundaryRegistry>
);

export default OdhNormDataSummerLazy;
