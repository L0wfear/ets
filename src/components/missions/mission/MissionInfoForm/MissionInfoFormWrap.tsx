import * as React from 'react';
import { DivNone } from 'global-styled/global-styled';
import MissionInfoForm from 'components/missions/mission/MissionInfoForm/MissionInfoForm';

// надеюсь временно
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
