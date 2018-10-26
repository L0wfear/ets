import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';

const ReactTest: any = React;
const Component = ReactTest.lazy(() => (
  import(/* webpackChunkName: "waybill" */'components/waybill/config-data/WaybillJournalWrap')
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
