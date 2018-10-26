import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';

const ReactTest: any = React;
const Component = ReactTest.lazy(() => (
  import(/* webpackChunkName: "route_odh_coverage" */'components/reports/operational/route_odh_coverage/report')
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
