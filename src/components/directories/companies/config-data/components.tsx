import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';

const Component = React.lazy(() => (
  import(/* webpackChunkName: "companies" */ 'components/directories/companies/CompaniesList')
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
