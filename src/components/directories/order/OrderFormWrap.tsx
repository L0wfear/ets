import * as React from 'react';
import MissionFormWrap from 'components/missions/mission/MissionFormWrap.jsx';
import DutyMissionFormWrap from 'components/missions/duty_mission/DutyMissionFormWrap';

// todo
// Описать интерфейсы форм
const MissionFormWrapTSX: any = MissionFormWrap;
const DutyMissionFormWrapTSX: any = DutyMissionFormWrap;

class OrderMissionController extends React.Component<any, any> {
  render() {
    const {
      missionData: {
        showForm: sfM = false,
        mElement,
        initMission,
      },
      dutyMissionData: {
        showForm: sfDM = false,
        dmElement,
        initDutyMission,
      },
    } = this.props;

    return (
      <div>
        <MissionFormWrapTSX
          fromOrder={true}
          showForm={sfM}
          onFormHide={this.props.onHideCM}
          element={mElement}
          initMission={initMission}
        />
        <DutyMissionFormWrapTSX
          fromOrder={true}
          showForm={sfDM}
          onFormHide={this.props.onHideCDM}
          element={dmElement}
          initDutyMission={initDutyMission}
        />
      </div>
    );
  }
}

export default OrderMissionController;
