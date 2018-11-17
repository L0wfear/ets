import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';

const Component = React.lazy(() => (
  import(/* webpackChunkName: "object_property" */'components/directories/repair/object_property/ObjectPropertyList')
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
