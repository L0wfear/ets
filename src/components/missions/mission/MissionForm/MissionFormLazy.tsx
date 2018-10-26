import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';

import { DivNone } from 'global-styled/global-styled';

const ReactTest: any = React;

const MissionForm = ReactTest.lazy(() => (
  import(/* webpackChunkName: "mission_form" */'components/missions/mission/MissionForm/MissionForm')
));

class MissionFormLazy extends React.PureComponent<any, {}> {
  render() {
    return (
      this.props.show ?
      (
        <ReactTest.Suspense fallback={<LoadingComponent />}>
          <MissionForm
            {...this.props}
          />
        </ReactTest.Suspense>
      )
      :
      ( <DivNone /> )
    )
  }
}

export default MissionFormLazy;
