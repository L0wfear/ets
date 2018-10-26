import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';

const ReactTest: any = React;
const Component = ReactTest.lazy(() => (
  import(/* webpackChunkName: "danger_zones" */'components/directories/geoobjects/pages/danger_zones/DangerZonesDirectory')
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
