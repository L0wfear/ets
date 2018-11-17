import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';

const Component = React.lazy(() => (
  import(/* webpackChunkName: "user_action_log" */'components/directories/user_action_log/UserActionLogList')
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
