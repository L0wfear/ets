import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';


const Component = React.lazy(() => (
  import(/* webpackChunkName: "maintenance_rate" */'components/directories/normative/maintenance_rate/MaintenanceRateDirectory')
));

export default [
  {
    component: (props) => (
      <React.Suspense fallback={<LoadingComponent />}>
        <Component {...props}/>
      </React.Suspense>
    ),
  },
];
