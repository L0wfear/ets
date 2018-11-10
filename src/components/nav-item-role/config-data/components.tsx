import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';


const Component = React.lazy(() => (
  import(/* webpackChunkName: "cahnge_company" */'components/nav-item-role/CahngeCompany')
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

