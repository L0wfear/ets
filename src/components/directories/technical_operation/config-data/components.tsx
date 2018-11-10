import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';


const Component = React.lazy(() => (
  import(/* webpackChunkName: "technical_operation" */'components/directories/technical_operation/TechnicalOperationsDirectory')
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
