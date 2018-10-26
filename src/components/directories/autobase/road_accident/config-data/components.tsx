  import * as React from 'react';
  import LoadingComponent from 'components/ui/PreloaderMainPage';
  
  const ReactTest: any = React;
  const Component = ReactTest.lazy(() => (
    import(/* webpackChunkName: "hidden_road_accident" */'components/directories/autobase/road_accident/RoadAccidentList')
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
  