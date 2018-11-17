import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';

const Component = React.lazy(() => (
  import(/* webpackChunkName: "ssp" */'components/directories/geoobjects/pages/ssp/SSPDirectory')
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
