import * as React from 'react';

import Div from 'components/ui/Div.jsx';

import MissionFormWrap from 'components/missions/mission/MissionFormWrap.jsx';
import DutyMissionFormWrap from 'components/missions/duty_mission/DutyMissionFormWrap';
import OrderMissionTemplate from 'components/directories/order/forms/OrderMissionTemplate/OrderMissionTemplateList';

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
        order,
      },
      dutyMissionData: {
        showForm: sfDM = false,
        dmElement,
        initDutyMission,
      },
      missionTemplateData: {
        typeClick,
        showForm: sfMTemlate = false,
        technical_operations = [],
        orderDates = {},
        mission_source_id,
      },
    } = this.props;

    return (
      <div>
        <MissionFormWrapTSX
          fromOrder={true}
          showForm={sfM}
          onFormHide={this.props.onHideCM}
          element={mElement}
          order={order}
          initMission={initMission}
        />
        <DutyMissionFormWrapTSX
          fromOrder={true}
          showForm={sfDM}
          onFormHide={this.props.onHideCDM}
          element={dmElement}
          initDutyMission={initDutyMission}
        />
        <Div hidden={!sfMTemlate} >
          <OrderMissionTemplate
            showForm={sfMTemlate}
            onFormHide={this.props.onHideCMTemplate}
            technical_operations={technical_operations}
            orderDates={orderDates}
            typeClick={typeClick}
            mission_source_id={mission_source_id}
          />
        </Div>
      </div>
    );
  }
}

export default OrderMissionController;
