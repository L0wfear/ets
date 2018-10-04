import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

import { DivNone } from 'global-styled/global-styled';

const MissionInfoForm = loadable(
  () => import(/* webpackChunkName: "mission_info_form" */ 'components/missions/mission/MissionInfoForm/MissionInfoForm'), {
  LoadingComponent,
});

class MissionInfoFormWrap extends React.Component<any, {}> {
  render() {
    const { showForm, ...props } = this.props;

    return showForm ?
      (
        <MissionInfoForm {...props} />
      )
      :
      (
        <DivNone />
      )
  }
}

export default MissionInfoFormWrap;
