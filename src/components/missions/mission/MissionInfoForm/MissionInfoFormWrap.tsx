import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';

import { DivNone } from 'global-styled/global-styled';

const ReactTest: any = React;

const MissionInfoForm = ReactTest.lazy(() => (
  import(/* webpackChunkName: "mission_info_form" */'components/missions/mission/MissionInfoForm/MissionInfoForm')
));

class MissionInfoFormWrap extends React.Component<any, {}> {
  render() {
    const { showForm, ...props } = this.props;

    return showForm ?
      (
        <ReactTest.Suspense fallback={<LoadingComponent />}>
          <MissionInfoForm {...props} />
        </ReactTest.Suspense>
      )
      :
      (
        <DivNone />
      )
  }
}

export default MissionInfoFormWrap;
