import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';

const ReactTest: any = React;
const Component = ReactTest.lazy(() => (
  import(/* webpackChunkName: "car_movement_time_report" */'components/reports/operational/car-movement-time-report/report')
));

export default [
  {
    component: (props) => (
      <ReactTest.Suspense fallback={<LoadingComponent />}>
        <Component {...props}/>
      </ReactTest.Suspense>
    ),
  },
];
