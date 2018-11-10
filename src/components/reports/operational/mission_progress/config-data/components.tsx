import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';


const Component = React.lazy(() => (
  import(/* webpackChunkName: "mission_progress" */'components/reports/operational/mission_progress/report')
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
