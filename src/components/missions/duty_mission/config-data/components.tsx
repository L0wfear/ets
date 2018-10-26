import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';

const ReactTest: any = React;
const Component = ReactTest.lazy(() => (
  import(/* webpackChunkName: "duty-missions-journal" */'components/missions/duty_mission/config-data/DutyMissionsJournalWrap')
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
