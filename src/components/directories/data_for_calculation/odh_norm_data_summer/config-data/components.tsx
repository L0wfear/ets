import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';


const Component = React.lazy(() => (
  import(/* webpackChunkName: "odh_norm_data_summer" */'components/directories/data_for_calculation/odh_norm_data_summer/ODHNormDataSummerList')
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
