import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';

import { DivNone } from 'global-styled/global-styled';

const ReactTest: any = React;

const MissionFormOld = ReactTest.lazy(() => (
  import(/* webpackChunkName: "mission_form_old" */'components/missions/mission/MissionForm/MissionFormOld')
));

class MissionFormOldLazy extends React.PureComponent<any, {}> {
  render() {
    return (
      this.props.show ?
      (
        <ReactTest.Suspense fallback={<LoadingComponent />}>
          <MissionFormOld
            {...this.props}
          />
        </ReactTest.Suspense>
      )
      :
      ( <DivNone /> )
    )
  }
}

export default MissionFormOldLazy;
